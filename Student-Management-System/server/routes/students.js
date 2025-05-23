const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// CREATE
router.post('/', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark attendance for a student (POST /:id/attendance)
router.post('/:id/attendance', async (req, res) => {
  try {
    const { date } = req.body;
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    // Prevent duplicate marking for the same day
    if (!student.attendance.some(a => a.date === date)) {
      student.attendance.push({ date, status: 'present' });
      await student.save();
    }
    res.json({ attendance: student.attendance, attendanceCount: student.attendance.filter(a => a.status === 'present').length });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get attendance for a student (GET /:id/attendance)
router.get('/:id/attendance', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json({ attendance: student.attendance, attendanceCount: student.attendance.filter(a => a.status === 'present').length });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
