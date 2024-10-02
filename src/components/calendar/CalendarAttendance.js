// // AttendanceTable.js
// import React from 'react';
// import { Table as AntTable, Checkbox, Input, Button } from 'antd';
// import '../css/AttendanceTable.css';

// const AttendanceTable = ({ students, attendance, toggleAttendance, editingStudentId, editingStudentName, setEditingStudentName, saveStudent, startEditing, deleteStudent, daysInMonth }) => {
//     const columns = [
//         {
//             title: 'Actions',
//             key: 'actions',
//             render: (_, record) => (
//                 <>
//                     {editingStudentId === record.id ? (
//                         <Button onClick={() => saveStudent(record.id)} type="link">
//                             Save
//                         </Button>
//                     ) : (
//                         <Button onClick={() => startEditing(record)} type="link">
//                             Update
//                         </Button>
//                     )}

//                     <br/>
//                     <Button onClick={() => deleteStudent(record.id)} type="link" danger>
//                         Delete
//                     </Button>
//                 </>
//             ),
//         },

//         {
//             title: 'Student Id',
//             dataIndex: 'id',
//             key: 'id',
//         },

//         {
//             title: 'Name',
//             dataIndex: 'name',
//             key: 'name',
//             render: (text, record) => (
//                 editingStudentId === record.id ? (
//                     <Input
//                         value={editingStudentName}
//                         onChange={(e) => setEditingStudentName(e.target.value)}
//                         onPressEnter={() => saveStudent(record.id)}
//                     />
//                 ) : (
//                     text
//                 )
//             ),
//         },

//         ...daysInMonth.map(day => ({
//             title: day,
//             dataIndex: `day${day}`,
//             key: `day${day}`,
//             render: (_, record) => (
//                 <Checkbox
//                     checked={attendance[record.id]?.[day] || false}
//                     onChange={() => toggleAttendance(record.id, day)}
//                 />
//             ),
//         })),
//     ];

//     return (
//         <div className="table-container"> {/* Apply the CSS class */}
//             <AntTable
//                 dataSource={students}
//                 columns={columns}
//                 rowKey="id"
//                 pagination={false}
//                 scroll={{ x: 'max-content' }}
//             />
//         </div>
//     );
// };

// export default AttendanceTable;

// AttendanceTable.js
// import React from 'react';
// import { Table as AntTable, Checkbox, Input, Button } from 'antd';
// import '../../css/AttendanceTable.css';

// const AttendanceTable = ({
//     students,
//     attendance,
//     toggleAttendance,
//     editingStudentId,
//     editingStudentName,
//     setEditingStudentName,
//     saveStudent,
//     startEditing,
//     deleteStudent,
// }) => {
//     // Define columns with a new one for the section
//     const columns = [
//         {
//             title: 'Actions',
//             key: 'actions',
//             render: (_, record) => (
//                 <>
//                     {editingStudentId === record.id ? (
//                         <Button onClick={() => saveStudent(record.id)} type="link">
//                             Save
//                         </Button>
//                     ) : (
//                         <Button onClick={() => startEditing(record)} type="link">
//                             Update
//                         </Button>
//                     )}
//                     <br />
//                     <Button onClick={() => deleteStudent(record.id)} type="link" danger>
//                         Delete
//                     </Button>
//                 </>
//             ),
//         },
//         {
//             title: 'Student Id',
//             dataIndex: 'id',
//             key: 'id',
//         },
//         {
//             title: 'Name',
//             dataIndex: 'name',
//             key: 'name',
//             render: (text, record) =>
//                 editingStudentId === record.id ? (
//                     <Input
//                         value={editingStudentName}
//                         onChange={(e) => setEditingStudentName(e.target.value)}
//                         onPressEnter={() => saveStudent(record.id)}
//                     />
//                 ) : (
//                     text
//                 ),
//         },
//         {
//             title: 'Section', // New column for section
//             dataIndex: 'section', // Field name in the student object
//             key: 'section',
//             render: (section) => section || 'N/A', // Display 'N/A' if no section is available
//         },
//         {
//             title: 'Present',
//             key: 'present',
//             render: (_, record) => (
//                 <Checkbox
//                     checked={attendance[record.id]?.present || false}
//                     onChange={() => toggleAttendance(record.id, 'present')}
//                 />
//             ),
//         },
//         {
//             title: 'Not Present',
//             key: 'notPresent',
//             render: (_, record) => (
//                 <Checkbox
//                     checked={!attendance[record.id]?.present || false}
//                     onChange={() => toggleAttendance(record.id, 'notPresent')}
//                 />
//             ),
//         },
//     ];

//     return (
//         <div className="table-container">
//             <AntTable
//                 dataSource={students}
//                 columns={columns}
//                 rowKey="id"
//                 pagination={false}
//                 scroll={{ x: 'max-content' }}
//             />
//         </div>
//     );
// };

// export default AttendanceTable;

import React, { useEffect, useState } from 'react';
import { Table as AntTable, Checkbox, Input, Button, message } from 'antd';
import axios from 'axios'; // To make requests to the backend
import '../../css/AttendanceTable.css';

const CalendarAttendance = ({
    attendance,
    toggleAttendance,
    editingStudentId,
    editingStudentName,
    setEditingStudentName,
    saveStudent,
    startEditing,
    deleteStudent,
    hideActions,
}) => {
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch students from MongoDB
    useEffect(() => {
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
    }, []); // Run only on component mount

    // Filter students based on search query
    const filteredStudents = students.filter((student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const columns = [
        !hideActions && {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <>
                    {editingStudentId === record._id ? (
                        <Button onClick={() => saveStudent(record._id)} type="link">
                            Save
                        </Button>
                    ) : (
                        <Button onClick={() => startEditing(record)} type="link">
                            Update
                        </Button>
                    )}
                    <br />
                    <Button onClick={() => deleteStudent(record._id)} type="link" danger>
                        Delete
                    </Button>
                </>
            ),
        },
        {
            title: 'Student Id',
            dataIndex: 'customId', // Use customId instead of _id
            key: 'customId',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) =>
                editingStudentId === record._id ? (
                    <Input
                        value={editingStudentName}
                        onChange={(e) => setEditingStudentName(e.target.value)}
                        onPressEnter={() => saveStudent(record._id)}
                    />
                ) : (
                    text
                ),
        },
        {
            title: 'Section',
            dataIndex: 'section',
            key: 'section',
            render: (section) => section || 'N/A',
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
        {
            title: 'Not Present',
            key: 'notPresent',
            render: (_, record) => (
                <Checkbox
                    checked={!attendance[record._id]?.present || false}
                    onChange={() => toggleAttendance(record._id, 'notPresent')}
                />
            ),
        },
    ].filter(Boolean);

    return (
        <div className="table-container">
            {/* Add search input */}
            <Input
                placeholder="Search students"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ marginBottom: 16 }}
            />
            <AntTable
                dataSource={filteredStudents}
                columns={columns}
                rowKey="_id" // Ensure this matches the MongoDB field
                pagination={false}
                scroll={{ x: 'max-content' }}
            />
        </div>
    );
};

export default CalendarAttendance;
