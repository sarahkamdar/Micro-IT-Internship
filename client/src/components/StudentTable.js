import React, { useEffect } from 'react';
import axios from 'axios';

function StudentTable({ onEdit, onStudentAddedOrUpdated, onStudentDeleted, students }) {
  useEffect(() => {
    // students are now passed as a prop, no need to fetch here initially
    // fetchStudents(); // Removed initial fetch
  }, [onStudentAddedOrUpdated, onStudentDeleted]); // Refetch when students are added, updated, or deleted

  const handleMarkAttendance = async (studentId) => {
    try {
      await axios.post(`/api/students/${studentId}/attendance`, { date: new Date().toISOString().split('T')[0] }); // Use today's date
      if (onStudentAddedOrUpdated) onStudentAddedOrUpdated(); // Trigger refetch in parent
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Failed to mark attendance.');
    }
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      await axios.delete(`/api/students/${studentId}`);
      if (onStudentDeleted) onStudentDeleted(); // Trigger refetch in parent
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Failed to delete student.');
    }
  };

  const handleShowHistory = async (studentId) => {
    try {
      const response = await axios.get(`/api/students/${studentId}/attendance`);
      // Display attendance history - could be a modal later
      if (response.data.attendance && response.data.attendance.length > 0) {
        alert('Attendance History:\n' + response.data.attendance.map(a => a.date).join('\n'));
      } else {
        alert('No attendance history found.');
      }
    } catch (error) {
      console.error('Error fetching attendance history:', error);
      alert('Failed to fetch attendance history.');
    }
  };

  return React.createElement('div', { className: 'card' },
    React.createElement('h3', null, 'Student List'),
    React.createElement('table', { className: 'student-table' },
      React.createElement('thead', null,
        React.createElement('tr', null,
          React.createElement('th', null, 'Name'),
          React.createElement('th', null, 'Roll No'),
          React.createElement('th', null, 'Department'),
          React.createElement('th', null, 'CGPA'),
          React.createElement('th', null, 'Attendance'),
          React.createElement('th', null, 'Actions')
        )
      ),
      React.createElement('tbody', null,
        students.map(student => (
          React.createElement('tr', { key: student._id },
            React.createElement('td', null, student.name),
            React.createElement('td', null, student.rollNo),
            React.createElement('td', null, student.department),
            React.createElement('td', null, student.cgpa),
            React.createElement('td', null, `${student.attendanceCount || 0} days`),
            React.createElement('td', { className: 'table-actions' },
              React.createElement('button', { onClick: () => handleMarkAttendance(student._id), className: 'button-mark-today' }, 'Mark Today'),
              React.createElement('button', { onClick: () => handleShowHistory(student._id), className: 'button-show-history' }, 'Show History'),
              React.createElement('button', { onClick: () => onEdit(student), className: 'button-edit' }, 'Edit'),
              React.createElement('button', { onClick: () => handleDeleteStudent(student._id), className: 'button-delete' }, 'Delete')
            )
          )
        ))
      )
    )
  );
}

export default StudentTable; 