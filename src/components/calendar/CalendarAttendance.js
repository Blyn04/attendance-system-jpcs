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

// import React, { useEffect, useState } from 'react';
// import { Table as AntTable, Checkbox, Input, Button, message } from 'antd';
// import axios from 'axios'; // To make requests to the backend
// import '../../css/AttendanceTable.css';

// const CalendarAttendance = ({
//     attendance,
//     toggleAttendance,
//     editingStudentId,
//     editingStudentName,
//     setEditingStudentName,
//     saveStudent,
//     startEditing,
//     deleteStudent,
//     hideActions,
// }) => {
//     const [students, setStudents] = useState([]);
//     const [searchQuery, setSearchQuery] = useState('');

//     // Fetch students from MongoDB
//     useEffect(() => {
//         const fetchStudents = async () => {
//             try {
//                 const response = await axios.get('http://localhost:5000/main/attendance');
//                 setStudents(response.data);
//             } catch (error) {
//                 console.error('Error fetching students:', error);
//                 message.error('Failed to load students');
//             }
//         };

//         fetchStudents();
//     }, []); // Run only on component mount

//     // Filter students based on search query
//     const filteredStudents = students.filter((student) =>
//         student.name.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     const columns = [
//         !hideActions && {
//             title: 'Actions',
//             key: 'actions',
//             render: (_, record) => (
//                 <>
//                     {editingStudentId === record._id ? (
//                         <Button onClick={() => saveStudent(record._id)} type="link">
//                             Save
//                         </Button>
//                     ) : (
//                         <Button onClick={() => startEditing(record)} type="link">
//                             Update
//                         </Button>
//                     )}
//                     <br />
//                     <Button onClick={() => deleteStudent(record._id)} type="link" danger>
//                         Delete
//                     </Button>
//                 </>
//             ),
//         },
//         {
//             title: 'Student Id',
//             dataIndex: 'customId', // Use customId instead of _id
//             key: 'customId',
//         },
//         {
//             title: 'Name',
//             dataIndex: 'name',
//             key: 'name',
//             render: (text, record) =>
//                 editingStudentId === record._id ? (
//                     <Input
//                         value={editingStudentName}
//                         onChange={(e) => setEditingStudentName(e.target.value)}
//                         onPressEnter={() => saveStudent(record._id)}
//                     />
//                 ) : (
//                     text
//                 ),
//         },
//         {
//             title: 'Section',
//             dataIndex: 'section',
//             key: 'section',
//             render: (section) => section || 'N/A',
//         },
//         {
//             title: 'Present',
//             key: 'present',
//             render: (_, record) => (
//                 <Checkbox
//                     checked={attendance[record._id]?.present || false}
//                     onChange={() => toggleAttendance(record._id, 'present')}
//                 />
//             ),
//         },
//         {
//             title: 'Not Present',
//             key: 'notPresent',
//             render: (_, record) => (
//                 <Checkbox
//                     checked={!attendance[record._id]?.present || false}
//                     onChange={() => toggleAttendance(record._id, 'notPresent')}
//                 />
//             ),
//         },
//     ].filter(Boolean);

//     return (
//         <div className="table-container">
//             {/* Add search input */}
//             <Input
//                 placeholder="Search students"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 style={{ marginBottom: 16 }}
//             />
//             <AntTable
//                 dataSource={filteredStudents}
//                 columns={columns}
//                 rowKey="_id" // Ensure this matches the MongoDB field
//                 pagination={false}
//                 scroll={{ x: 'max-content' }}
//             />
//         </div>
//     );
// };

// export default CalendarAttendance;

import React, { useEffect, useState } from 'react';
import { Table as AntTable, Checkbox, Input, Button, message } from 'antd';
import axios from 'axios';
import '../../css/AttendanceTable.css';

const CalendarAttendance = ({ eventId, hideActions }) => {
  const [event, setEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch event details by ID
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await axios.get(`/main/events/${eventId}`);
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event data:', error);
        message.error('Failed to fetch event data');
      }
    };

    fetchEventData();
  }, [eventId]);

  // Toggle attendance status for a student
  const toggleAttendance = async (studentId, present) => {
    try {
      await axios.put(`/main/events/${eventId}/students/${studentId}`, { present });
      // Update the attendance status in the local state
      setEvent((prevEvent) => {
        const updatedStudents = prevEvent.students.map((student) =>
          student.studentId._id === studentId ? { ...student, present } : student
        );
        return { ...prevEvent, students: updatedStudents };
      });
    } catch (error) {
      console.error('Error updating attendance:', error);
      message.error('Failed to update attendance');
    }
  };

  // Filter students based on search query
  const filteredStudents = event?.students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    // Conditional rendering of Actions column
    !hideActions && {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button
            onClick={() => message.info('Edit functionality not implemented')}
            type="link"
          >
            Update
          </Button>
          <br />
          <Button
            onClick={() => message.info('Delete functionality not implemented')}
            type="link"
            danger
          >
            Delete
          </Button>
        </>
      ),
    },
    {
      title: 'Student ID',
      dataIndex: 'customId', // Use customId instead of _id
      key: 'customId',
      render: (text, record) => record.studentId.customId,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
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
          checked={record.present}
          onChange={() => toggleAttendance(record.studentId._id, true)}
        />
      ),
    },
    {
      title: 'Not Present',
      key: 'notPresent',
      render: (_, record) => (
        <Checkbox
          checked={!record.present}
          onChange={() => toggleAttendance(record.studentId._id, false)}
        />
      ),
    },
  ].filter(Boolean); // Filter out undefined values for columns

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <div className="table-container">
      <h1>{event.title}</h1>
      <p>{event.description}</p>
      <p>Date: {new Date(event.date).toLocaleDateString()}</p>
      
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
        rowKey="studentId" // Ensure this matches the MongoDB field
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

export default CalendarAttendance;

