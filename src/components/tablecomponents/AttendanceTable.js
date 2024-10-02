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

const AttendanceTable = ({
    students,
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
    // Define columns and conditionally include the "Actions" column
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
            render: (text) => text.slice(0, 8), // Display only the first 8 characters of customId
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
    ].filter(Boolean); // This filters out the "Actions" column if it's set to be hidden

    return (
        <div className="table-container">
            <AntTable
                dataSource={students}
                columns={columns}
                rowKey="_id"
                pagination={false}
                scroll={{ x: 'max-content' }}
            />
        </div>
    );
};

export default AttendanceTable;
