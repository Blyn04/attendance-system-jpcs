    import React, { useState, useEffect } from 'react';
import { Input, Button, Select, message } from 'antd';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; // Import UUID for customId
import '../../css/Attendance.css';

const { Option } = Select;

const AddStudent = ({ onAddStudent, students, editingStudentId }) => {
    const [studentName, setStudentName] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editingStudentId) {
            const editingStudent = students.find(student => student._id === editingStudentId);
            if (editingStudent) {
                setStudentName(editingStudent.name);
                setSelectedSection(editingStudent.section);
            }
        } else {
            setStudentName('');
            setSelectedSection('');
        }
    }, [editingStudentId, students]);

    const handleAdd = async () => {
        if (studentName.trim() === '' || selectedSection === '') {
            message.warning('Please fill in all fields');
            return;
        }
    
        const newStudent = {
            name: studentName,
            section: selectedSection,
            customId: uuidv4(), // Generate a unique ID for the student
        };
    
        // Check for existing student
        const nameExists = students.some(existingStudent => 
            existingStudent.name.toLowerCase() === studentName.toLowerCase() && existingStudent.section === selectedSection
        );
        if (nameExists) {
            message.warning('This student name already exists in this section');
            return;
        }
    
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/main/attendance', newStudent);
            console.log('API Response:', response.data); // Log the response
            onAddStudent(response.data);
            setStudentName('');
            setSelectedSection('');
        } catch (error) {
            console.error('Failed to add student:', error);
            message.error(`Error: ${error.response?.data?.message || 'Failed to add student'}`);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div>
            <Input
                className="student-input"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter student name"
            />
            <div className="actions-container" style={{ marginTop: '10px' }}>
                <label>Select Section: </label>
                <Select 
                    value={selectedSection}
                    onChange={(value) => setSelectedSection(value)}
                    placeholder="Select a section" 
                    style={{ width: 120, marginLeft: '10px', marginRight: '20px' }}
                >
                    <Option value="INF223">INF223</Option>
                    <Option value="INF224">INF224</Option>
                </Select>
                <Button 
                    onClick={handleAdd} 
                    type="primary" 
                    loading={loading}
                >
                    Add
                </Button>
            </div>
        </div>
    );
};

export default AddStudent;
