const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true },
  department: { type: String, required: true },
  marks: { type: Number, required: true }
});

module.exports = mongoose.model('Student', studentSchema);
