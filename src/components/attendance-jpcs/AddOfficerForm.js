import React, { useState, useEffect } from 'react';
import { Input, Button, Select, message, Switch } from 'antd';
import axios from 'axios';
import '../../css/Attendance.css'; // Make sure this file is tailored to your officer forms

const { Option } = Select;

const AddOfficerForm = ({ onAddOfficer, officers, editingOfficerId }) => {
    const [officerName, setOfficerName] = useState('');
    const [selectedPosition, setSelectedPosition] = useState('');
    const [present, setPresent] = useState(false); // Boolean for present status
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editingOfficerId) {
            const editingOfficer = officers.find(officer => officer._id === editingOfficerId);
            if (editingOfficer) {
                setOfficerName(editingOfficer.name);
                setSelectedPosition(editingOfficer.position);
                setPresent(editingOfficer.present);
            }
        } else {
            setOfficerName('');
            setSelectedPosition('');
            setPresent(false); // Reset present status to false
        }
    }, [editingOfficerId, officers]);

    const handleAdd = async () => {
        if (officerName.trim() === '' || selectedPosition === '') {
            message.warning('Please fill in all fields');
            return;
        }
    
        const newOfficer = {
            name: officerName,
            position: selectedPosition,
            present: present, // Include present status
        };
    
        // Check for existing officer
        const nameExists = officers.some(existingOfficer => 
            existingOfficer.name.toLowerCase() === officerName.toLowerCase() && existingOfficer.position === selectedPosition
        );
        if (nameExists) {
            message.warning('This officer already exists with the same position');
            return;
        }
    
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/main/jpcs-officers', newOfficer);
            console.log('API Response:', response.data);
            onAddOfficer(response.data);
            setOfficerName('');
            setSelectedPosition('');
            setPresent(false); // Reset present status after adding
        } catch (error) {
            console.error('Failed to add officer:', error);
            message.error(`Error: ${error.response?.data?.message || 'Failed to add officer'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Input
                className="officer-input"
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                placeholder="Enter officer name"
            />
            <div className="actions-container" style={{ marginTop: '10px' }}>
                <label>Select Position: </label>
                <Select 
                    value={selectedPosition}
                    onChange={(value) => setSelectedPosition(value)}
                    placeholder="Select a position" 
                    style={{ width: 180, marginLeft: '10px', marginRight: '20px' }}
                >
                    <Option value="President">President</Option>
                    <Option value="Vice President">Vice President</Option>
                    <Option value="Secretary">Secretary</Option>
                    <Option value="Treasurer">Treasurer</Option>
                </Select>
                <div style={{ display: 'inline-flex', alignItems: 'center', marginRight: '20px' }}>
                    <label style={{ marginRight: '10px' }}>Present:</label>
                    <Switch 
                        checked={present}
                        onChange={(checked) => setPresent(checked)}
                    />
                </div>
                <Button 
                    onClick={handleAdd} 
                    type="primary" 
                    loading={loading}
                >
                    {editingOfficerId ? 'Update Officer' : 'Add Officer'}
                </Button>
            </div>
        </div>
    );
};

export default AddOfficerForm;
