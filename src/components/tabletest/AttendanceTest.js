import React, { useState, useEffect } from 'react';
import { Button, Modal, Input, message } from 'antd';
import axios from 'axios';
import '../../css/Attendance.css';
import AttendanceList from './AttendanceList';
import AddStudent from './AddStudent';

const AttendanceTest = () => {
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [editingStudentId, setEditingStudentId] = useState(null);
    const [editingStudentName, setEditingStudentName] = useState('');
    const [editingStudentSection, setEditingStudentSection] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Fetch students when the component mounts
        const fetchStudents = async () => {
            try {
                const response = await axios.get('http://localhost:5000/main/attendance');
                setStudents(response.data);
            } catch (error) {
                console.error('Error fetching students:', error);
                message.error('Failed to load students');
            }
        };
        fetchStudents();
    }, []);

    const addStudent = (student) => {
        const nameExists = students.some(existingStudent =>
            existingStudent.name.toLowerCase() === student.name.toLowerCase() &&
            existingStudent.section === student.section
        );

        if (nameExists) {
            alert('This student name already exists in this section');
            return;
        }

        setStudents(prevStudents => [...prevStudents, student]);
    };

    const startEditing = (student) => {
        setEditingStudentId(student._id);
        setEditingStudentName(student.name);
        setEditingStudentSection(student.section);
    };

    const saveStudent = async (id) => {
        const nameExists = students.some(student =>
            student.name.toLowerCase() === editingStudentName.toLowerCase() && student._id !== id
        );

        if (nameExists) {
            alert('This student name already exists');
            return;
        }

        if (/^[a-zA-Z\s]*$/.test(editingStudentName)) {
            try {
                const updatedStudent = { name: editingStudentName, section: editingStudentSection };
                const response = await axios.put(`http://localhost:5000/main/attendance/${id}`, updatedStudent);
                setStudents(students.map(student =>
                    student._id === id ? response.data : student
                ));
                setEditingStudentId(null);
                setEditingStudentName('');
                setEditingStudentSection('');
                message.success('Student updated successfully');
            } catch (error) {
                console.error('Error updating student:', error);
                message.error('Failed to update student');
            }
        } else {
            alert('Please enter letters only');
        }
    };

    const deleteStudent = (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this student?',
            content: 'This action cannot be undone.',
            onOk: async () => {
                try {
                    await axios.delete(`http://localhost:5000/main/attendance/${id}`);
                    setStudents(students.filter(student => student._id !== id));
                    message.success('Student deleted successfully');
                } catch (error) {
                    console.error('Error deleting student:', error);
                    message.error('Failed to delete student');
                }
            },
        });
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.section.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='attendance-container'>
            <AddStudent onAddStudent={addStudent} students={students} />
            <div style={{ marginBottom: 16 }}>
                <Input
                    placeholder="Search by name or section"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: 300, marginRight: 8 }}
                />
                <Button
                    type="primary"
                    onClick={() => setSearchTerm('')} // Clear the search term
                >
                    Clear Search
                </Button>
            </div>
            <AttendanceList
                students={filteredStudents}
                attendance={attendance}
                toggleAttendance={(studentId, attendanceType) => setAttendance(prev => ({
                    ...prev,
                    [studentId]: { present: attendanceType === 'present' },
                }))}
                editingStudentId={editingStudentId}
                editingStudentName={editingStudentName}
                editingStudentSection={editingStudentSection}
                setEditingStudentName={setEditingStudentName}
                setEditingStudentSection={setEditingStudentSection}
                saveStudent={saveStudent}
                startEditing={startEditing}
                deleteStudent={deleteStudent}
            />
        </div>
    );
};

export default AttendanceTest;
