import React, { useState, useEffect } from 'react';

function StudentForm({ onSubmit, editingStudent, setEditingStudent }) {
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [department, setDepartment] = useState('');
  const [cgpa, setCgpa] = useState('');

  useEffect(() => {
    if (editingStudent) {
      setName(editingStudent.name);
      setRollNo(editingStudent.rollNo);
      setDepartment(editingStudent.department);
      setCgpa(editingStudent.cgpa);
    } else {
      setName('');
      setRollNo('');
      setDepartment('');
      setCgpa('');
    }
  }, [editingStudent]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ name, rollNo, department, cgpa: parseFloat(cgpa) });
    // Clear form after submission if not editing
    if (!editingStudent) {
        setName('');
        setRollNo('');
        setDepartment('');
        setCgpa('');
    }
  };

  const handleCancelEdit = () => {
      setEditingStudent(null);
  };

  return React.createElement('div', { className: 'card' },
    React.createElement('h3', null, editingStudent ? 'Edit Student' : 'Add New Student'),
    React.createElement('form', { onSubmit: handleSubmit },
      React.createElement('div', { className: 'form-group' },
        React.createElement('label', null, 'Name:'),
        React.createElement('input', { type: 'text', value: name, onChange: (e) => setName(e.target.value) })
      ),
      React.createElement('div', { className: 'form-group' },
        React.createElement('label', null, 'Roll Number:'),
        React.createElement('input', { type: 'text', value: rollNo, onChange: (e) => setRollNo(e.target.value) })
      ),
      React.createElement('div', { className: 'form-group' },
        React.createElement('label', null, 'Department:'),
        React.createElement('select', { value: department, onChange: (e) => setDepartment(e.target.value) },
          React.createElement('option', { value: '' }, 'Select department'),
          React.createElement('option', { value: 'CSE' }, 'CSE'),
          React.createElement('option', { value: 'IT' }, 'IT'),
          React.createElement('option', { value: 'Civil' }, 'Civil'),
          React.createElement('option', { value: 'CE' }, 'CE'),
          React.createElement('option', { value: 'Mech' }, 'Mechanical')
        )
      ),
      React.createElement('div', { className: 'form-group' },
        React.createElement('label', null, 'CGPA:'),
        React.createElement('input', { type: 'number', step: '0.1', value: cgpa, onChange: (e) => setCgpa(e.target.value) })
      ),
      React.createElement('div', { className: 'form-actions' },
        React.createElement('button', { type: 'submit' }, editingStudent ? 'Update Student' : 'Add Student'),
        editingStudent && React.createElement('button', { type: 'button', onClick: handleCancelEdit }, 'Cancel')
      )
    )
  );
}

export default StudentForm; 