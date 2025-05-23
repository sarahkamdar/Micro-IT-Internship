const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true },
  department: { type: String, required: true },
  cgpa: { type: Number, required: true },
  attendance: [{
    date: { type: String, required: true },
    status: { type: String, enum: ['present', 'absent'], default: 'present' }
  }]
});

// Add a virtual for attendance count
studentSchema.virtual('attendanceCount').get(function() {
  return this.attendance.filter(a => a.status === 'present').length;
});

module.exports = mongoose.model('Student', studentSchema);
