import React, { useState, useEffect } from 'react';
import { Button, Modal, Input, message } from 'antd';
import AddOfficerForm from './AddOfficerForm'; // Assuming you will create a similar form for officers
import AttendanceTable from './OfficerTable'; // Reuse the updated AttendanceTable
import axios from 'axios';
import '../../css/Attendance.css';

const OfficerAttendance = () => {
    const [attendance, setAttendance] = useState({});
    const [officers, setOfficers] = useState([]);
    const [editingOfficerId, setEditingOfficerId] = useState(null);
    const [editingOfficerName, setEditingOfficerName] = useState('');
    const [editingOfficerPosition, setEditingOfficerPosition] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Fetch officers when the component mounts
        const fetchOfficers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/main/jpcs-officers');
                setOfficers(response.data);
            } catch (error) {
                console.error('Error fetching officers:', error);
                message.error('Failed to load officers');
            }
        };
        fetchOfficers();
    }, []);

    const toggleAttendance = (officerId, attendanceType) => {
        setAttendance(prev => ({
            ...prev,
            [officerId]: {
                present: attendanceType === 'present',
            },
        }));
    };

    const addOfficer = (officer) => {
        const nameExists = officers.some(existingOfficer => 
            existingOfficer.name.toLowerCase() === officer.name.toLowerCase() && existingOfficer.position === officer.position
        );

        if (nameExists) {
            alert('This officer name already exists in this position');
            return;
        }

        setOfficers([...officers, officer]); // Add the entire officer object
    };

    const startEditing = (officer) => {
        setEditingOfficerId(officer._id);
        setEditingOfficerName(officer.name);
        setEditingOfficerPosition(officer.position);
    };

    const saveOfficer = async (id) => {
        const nameExists = officers.some(officer =>
            officer.name.toLowerCase() === editingOfficerName.toLowerCase() && officer._id !== id
        );

        if (nameExists) {
            alert('This officer name already exists');
            return;
        }

        if (/^[a-zA-Z\s]*$/.test(editingOfficerName)) {
            try {
                const updatedOfficer = { name: editingOfficerName, position: editingOfficerPosition };
                const response = await axios.put(`http://localhost:5000/main/jpcs-officers/${id}`, updatedOfficer);
                setOfficers(officers.map(officer =>
                    officer._id === id ? response.data : officer
                ));
                setEditingOfficerId(null);
                setEditingOfficerName('');
                setEditingOfficerPosition('');
                message.success('Officer updated successfully');
            } catch (error) {
                console.error('Error updating officer:', error);
                message.error('Failed to update officer');
            }
        } else {
            alert('Please enter letters only');
        }
    };

    const deleteOfficer = (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this officer?',
            content: 'This action cannot be undone.',
            onOk: async () => {
                try {
                    await axios.delete(`http://localhost:5000/main/jpcs-officers/${id}`);
                    setOfficers(officers.filter(officer => officer._id !== id));
                    message.success('Officer deleted successfully');
                } catch (error) {
                    console.error('Error deleting officer:', error);
                    message.error('Failed to delete officer');
                }
            },
        });
    };

    const filteredOfficers = officers.filter(officer =>
        officer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        officer.position.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='attendance-container'>
            <h1>Officer Attendance</h1>
            <AddOfficerForm onAddOfficer={addOfficer} officers={officers} />

            <div style={{ marginBottom: 16 }}>
                <Input
                    placeholder="Search by name or position"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: 300, marginRight: 8 }}
                />
                <Button
                    type="primary"
                    onClick={() => setSearchTerm('')}
                >
                    Clear Search
                </Button>
            </div>

            <AttendanceTable
                officers={filteredOfficers} 
                attendance={attendance}
                toggleAttendance={toggleAttendance}
                editingOfficerId={editingOfficerId}
                editingOfficerName={editingOfficerName}
                editingOfficerPosition={editingOfficerPosition}
                setEditingOfficerName={setEditingOfficerName}
                setEditingOfficerPosition={setEditingOfficerPosition}
                saveOfficer={saveOfficer}
                startEditing={startEditing}
                deleteOfficer={deleteOfficer}
                hideActions={false}
            />
        </div>
    );
};

export default OfficerAttendance;
