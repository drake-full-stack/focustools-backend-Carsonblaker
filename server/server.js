require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((error) => console.error("❌ Error:", error));

// Import models
const Task = require("./models/Task");
const Session = require("./models/Session");

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "FocusTools API",
    status: "Running",
    endpoints: {
      tasks: "/api/tasks",
      sessions: "/api/sessions",
    },
  });
});

// TODO: Add your Task routes here
app.post("/api/tasks", async (req, res) => {
  try {
    const newTask = new Task(req.body);
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  }catch (error) {
    res.status(400).json({message: error.message});
  }
});
app.get("/api/tasks", async (req, res)=> {
  try {
  const tasks = await Task.find();
  res.json(tasks);
} catch (error) {
  res.status(500).json({message: error.message});
}
});
app.get("/api/tasks/:id", async (req, res)=>{ 
try {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      message: "Task Not Found",
    });
  }
  res.json(task);
} catch(error) {
  res.status(500).json({message: error.message});
}
})
app.put("/api/tasks/:id", async (req, res) =>{
  try {
    const updateTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updateTask) {
      return res.status(404).json({
        message:"Task not found",
      });
    }
    res.json(updateTask);
  }catch(error) {
    res.status(400).json({message: error.message});
  }
})
app.delete("/api/tasks/:id", async(req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({
        message: "Task Not Found",   
      });
    }
    res.json({
      message: "Task Deleted successfully",
      book: deletedTask,
    });
  } catch (error) {
    res.status(500).json({ message: error.message});
  }
  });


// TODO: Add your Session routes here
app.post("/api/sessions", async (req, res) => {
  try {
    const newSession = new Session(req.body);
    const savedSession = await newSession.save();

    res.status(201).json(savedSession);
  } catch(error) {
    res.status(400).json({message: error.message});
  }
});
app.get("/api/sessions", async (req, res)=> {
  try{
    const sessions = await Session.find().populate("taskId");
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
