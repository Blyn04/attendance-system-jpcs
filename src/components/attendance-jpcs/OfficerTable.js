import React from 'react';
import { Table as AntTable, Checkbox, Input, Button } from 'antd';
import '../../css/AttendanceTable.css'; // Make sure the CSS matches your needs

const OfficerTable = ({
    officers,
    attendance,
    toggleAttendance,
    editingOfficerId,
    editingOfficerName,
    setEditingOfficerName,
    saveOfficer,
    startEditing,
    deleteOfficer,
    hideActions,
}) => {
    // Define columns with fields: Name, Position, Present, and optional Actions column
    const columns = [
        !hideActions && {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <>
                    {editingOfficerId === record._id ? (
                        <Button onClick={() => saveOfficer(record._id)} type="link">
                            Save
                        </Button>
                    ) : (
                        <Button onClick={() => startEditing(record)} type="link">
                            Update
                        </Button>
                    )}
                    <br />
                    <Button onClick={() => deleteOfficer(record._id)} type="link" danger>
                        Delete
                    </Button>
                </>
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) =>
                editingOfficerId === record._id ? (
                    <Input
                        value={editingOfficerName}
                        onChange={(e) => setEditingOfficerName(e.target.value)}
                        onPressEnter={() => saveOfficer(record._id)}
                    />
                ) : (
                    text
                ),
        },
        {
            title: 'Position', // Officer's position
            dataIndex: 'position',
            key: 'position',
        },
        {
            title: 'Present',
            key: 'present',
            render: (_, record) => (
                <Checkbox
                    checked={attendance[record._id]?.present || false}
                    onChange={() => toggleAttendance(record._id, 'present')}
                />
            ),
        },
    ].filter(Boolean); // Filter out "Actions" column if it's set to be hidden

    return (
        <div className="table-container">
            <AntTable
                dataSource={officers} // Use "officers" instead of "students"
                columns={columns}
                rowKey="_id"
                pagination={false}
                scroll={{ x: 'max-content' }}
            />
        </div>
    );
};

export default OfficerTable;
