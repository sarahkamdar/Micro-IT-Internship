import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import StudentForm from './components/StudentForm';
import StudentTable from './components/StudentTable';
import './styles.css';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/students');
      console.log('Fetched students data:', response.data);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleAddOrUpdateStudent = async (studentData) => {
    try {
      if (editingStudent) {
        await axios.put(`/api/students/${editingStudent._id}`, studentData);
        setEditingStudent(null);
      } else {
        await axios.post('/api/students', studentData);
      }
      fetchStudents(); // Refresh the list
    } catch (error) {
      console.error('Error saving student:', error);
    }
  };

  const handleDeleteStudent = async () => {
      fetchStudents(); // Refresh the list after deletion
  }

  const handleEditStudent = (student) => {
    setEditingStudent(student);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return React.createElement('div', { className: 'container' },
    React.createElement(SearchBar, { onSearch: handleSearch }),
    React.createElement(StudentForm, { onSubmit: handleAddOrUpdateStudent, editingStudent: editingStudent, setEditingStudent: setEditingStudent }),
    React.createElement(StudentTable, { students: filteredStudents, onEdit: handleEditStudent, onStudentAddedOrUpdated: fetchStudents, onStudentDeleted: handleDeleteStudent })
  );
}

export default App;
