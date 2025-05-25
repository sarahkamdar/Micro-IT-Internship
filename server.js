const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = 3000;

// ====== MONGODB CONNECTION ======
mongoose.connect('mongodb://localhost:27017/todoApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ Connected to MongoDB");
}).catch(err => {
  console.error("❌ MongoDB connection error:", err);
});

// ====== MONGOOSE SCHEMA ======
const taskSchema = new mongoose.Schema({
  text: String,
  completed: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: ['Work', 'Personal', 'Shopping', 'Health', 'Other'],
    default: 'Other'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  dueDate: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Task = mongoose.model('Task', taskSchema);

// ====== MIDDLEWARE ======
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ====== ROUTES ======

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get all tasks (JSON)
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Add new task
app.post('/add', async (req, res) => {
  const { task, category, priority, dueDate } = req.body;
  if (task && task.trim() !== '') {
    try {
      await Task.create({
        text: task.trim(),
        category: category || 'Other',
        priority: priority || 'Medium',
        dueDate: dueDate || null
      });
    } catch (err) {
      console.error('Error adding task:', err);
    }
  }
  res.redirect('/');
});

// Update task completion status
app.put('/tasks/:id/complete', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    task.completed = !task.completed;
    await task.save();
    res.json({ success: true, completed: task.completed });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update task' });
  }
});

// Update task details
app.put('/tasks/:id', async (req, res) => {
  try {
    const { text, category, priority, dueDate } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { text, category, priority, dueDate },
      { new: true }
    );
    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update task' });
  }
});

// Delete task
app.delete('/delete/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await Task.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete task' });
  }
});

// ====== START SERVER ======
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
