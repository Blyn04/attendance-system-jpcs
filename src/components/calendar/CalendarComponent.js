// import React, { useState } from 'react';
// import { Calendar, Badge, Modal, Button, Input, Form } from 'antd';
// import dayjs from 'dayjs';
// import '../../css/Calendar.css';
// import AttendanceTable from '../tablecomponents/AttendanceTable';
// import CalendarAttendance from './CalendarAttendance';
// import axios from 'axios';

// const CalendarComponent = () => {
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [events, setEvents] = useState({});
//   const [isEditing, setIsEditing] = useState(false);
//   const [selectedEventIndex, setSelectedEventIndex] = useState(null);
//   const [clickedEventIndex, setClickedEventIndex] = useState(null);
//   const [form] = Form.useForm();

//   // Attendance Table states
//   const [isAttendanceVisible, setIsAttendanceVisible] = useState(false);
//   const [students, setStudents] = useState([]);
//   const [attendance, setAttendance] = useState({});
//   const [editingStudentId, setEditingStudentId] = useState(null);
//   const [editingStudentName, setEditingStudentName] = useState('');

//   const handleDateSelect = (value) => {
//     const dateString = dayjs(value).format('YYYY-MM-DD');
//     setSelectedDate(dateString);

//     if (events[dateString] && events[dateString].length > 0) {
//       setSelectedEventIndex(0);
//       showEventDetails(events[dateString][0], 0);
//     } else {
//       setIsEditing(false);
//       setSelectedEventIndex(null);
//       form.resetFields();
//       setIsModalVisible(true);
//     }
//   };

//   const showEventDetails = (event, index) => {
//     setSelectedEventIndex(index);
//     form.setFieldsValue({
//       eventTitle: event.content,
//       eventDescription: event.description,
//     });
//     setIsEditing(true);
//     setIsModalVisible(true);
//   };

  
//   const dateCellRender = (value) => {
//     const dateString = dayjs(value).format('YYYY-MM-DD');
//     const listData = events[dateString] || [];

//     return (
//       <ul className="events">
//         {listData.map((item, index) => (
//           <li
//             key={index}
//             onClick={() => {
//               showEventDetails(item, index);
//               setClickedEventIndex(index);
//             }}
//             className={clickedEventIndex === index ? 'clicked' : ''}
//           >
//             <Badge status={item.type} text={item.content} />
//           </li>
//         ))}
//       </ul>
//     );
//   };

//   const fetchEvents = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/main/events');
//       const fetchedEvents = response.data.reduce((acc, event) => {
//         const date = dayjs(event.date).format('YYYY-MM-DD');
//         acc[date] = acc[date] || [];
//         acc[date].push({
//           type: 'success',
//           content: event.title,
//           description: event.description,
//           id: event._id,
//           students: event.students,
//         });
//         return acc;
//       }, {});
//       setEvents(fetchedEvents);
//     } catch (error) {
//       console.error('Failed to fetch events:', error);
//     }
//   };

//   const toggleAttendance = async (eventId, studentId, present) => {
//     try {
//       await axios.put(
//         `http://localhost:5000/main/events/${eventId}/students/${studentId}`,
//         { present }
//       );
//       fetchEvents(); // Refresh events after updating
//     } catch (error) {
//       console.error('Failed to update attendance:', error);
//     }
//   };
  

//   return (
//     <div className="calendar-container">
//       <Calendar dateCellRender={dateCellRender} onSelect={handleDateSelect} />

//       <Modal
//         title={isEditing ? `Edit Event for ${selectedDate}` : `Add Event for ${selectedDate}`}
//         visible={isModalVisible}
//         onOk={handleOk}
//         onCancel={() => {
//           setIsModalVisible(false);
//           form.resetFields();
//           setIsEditing(false);
//           setSelectedEventIndex(null);
//           setClickedEventIndex(null);
//         }}
//         footer={[
//           isEditing && (
//             <Button key="delete" type="danger" onClick={handleDelete}>
//               Delete Event
//             </Button>
//           ),
//           events[selectedDate]?.length > 0 && (
//             <Button
//               key="attendance"
//               type="default"
//               onClick={() => setIsAttendanceVisible(true)}
//             >
//               Attendance
//             </Button>
//           ),
//           <Button key="submit" type="primary" onClick={handleOk}>
//             {isEditing ? 'Update Event' : 'Add Event'}
//           </Button>
//         ]}
//       >
//         <Form form={form} layout="vertical">
//           <Form.Item
//             name="eventTitle"
//             label="Event Title"
//             rules={[{ required: true, message: 'Please input the event title!' }]}
//           >
//             <Input placeholder="Enter event title" />
//           </Form.Item>
//           <Form.Item
//             name="eventDescription"
//             label="Event Description"
//           >
//             <Input.TextArea placeholder="Enter event description (optional)" />
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* Attendance Modal */}
//       <Modal
//         title="Attendance"
//         visible={isAttendanceVisible}
//         onCancel={() => setIsAttendanceVisible(false)}
//         footer={null} // No footer, just close button
//       >
//         <CalendarAttendance
//           // attendance={attendance}
//           students={events[selectedDate]?.[selectedEventIndex]?.students || []}
//           toggleAttendance={(studentId, present) =>
//             toggleAttendance(
//               events[selectedDate]?.[selectedEventIndex]?.id,
//               studentId,
//               present
//             )
//           }
//           editingStudentId={editingStudentId}
//           editingStudentName={editingStudentName}
//           setEditingStudentName={setEditingStudentName}
//           saveStudent={(id) => {
//             // Implement your save logic here
//           }}
//           startEditing={(student) => {
//             setEditingStudentId(student.id);
//             setEditingStudentName(student.name);
//           }}
//           deleteStudent={(id) => {
//             // Implement your delete logic here
//           }}
//           hideActions={true} 
//         />
//       </Modal>
//     </div>
//   );
// };

// export default CalendarComponent;

import React, { useState, useEffect } from 'react';
import { Calendar, Badge, Modal, Button, Input, Form, message } from 'antd';
import dayjs from 'dayjs';
import '../../css/Calendar.css';
import axios from 'axios';
import CalendarAttendance from './CalendarAttendance';

const CalendarComponent = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEventIndex, setSelectedEventIndex] = useState(null);
  const [clickedEventIndex, setClickedEventIndex] = useState(null);
  const [form] = Form.useForm();

  // Attendance state management
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [isAttendanceVisible, setIsAttendanceVisible] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editingStudentName, setEditingStudentName] = useState('');

  // Fetch students from MongoDB when attendance modal is opened
  const loadStudentsForEvent = async (date) => {
    try {
      const response = await axios.get(`http://localhost:5000/main/students/${date}`);
      setStudents(response.data);
      setAttendance((prev) => {
        const newAttendance = { ...prev };
        response.data.forEach((student) => {
          if (!newAttendance[student._id]) {
            newAttendance[student._id] = { present: false };
          }
        });
        return newAttendance;
      });
    } catch (error) {
      console.error('Error fetching students:', error);
      message.error('Failed to load students.');
    }
  };

  const toggleAttendance = (studentId, type) => {
    setAttendance((prev) => {
  const updatedAttendance = { ...prev };
  updatedAttendance[studentId] = { present: type === 'present' };
  return updatedAttendance;
});
};

  const handleDateSelect = (value) => {
    const dateString = dayjs(value).format('YYYY-MM-DD');
    setSelectedDate(dateString);

    if (events[dateString] && events[dateString].length > 0) {
      setSelectedEventIndex(0);
      showEventDetails(events[dateString][0], 0);
    } else {
      setIsEditing(false);
      setSelectedEventIndex(null);
      form.resetFields();
      setIsModalVisible(true);
    }
  };

  const showEventDetails = (event, index) => {
    setSelectedEventIndex(index);
    form.setFieldsValue({
      eventTitle: event.content,
      eventDescription: event.description,
    });
    setIsEditing(true);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const newEvents = { ...events };
      if (!newEvents[selectedDate]) {
        newEvents[selectedDate] = [];
      }

      if (isEditing && selectedEventIndex !== null) {
        newEvents[selectedDate][selectedEventIndex] = {
          type: 'success',
          content: values.eventTitle,
          description: values.eventDescription || '',
        };
      } else {
        newEvents[selectedDate].push({
          type: 'success',
          content: values.eventTitle,
          description: values.eventDescription || '',
        });
      }

      setEvents(newEvents);
      setIsModalVisible(false);
      form.resetFields();
      setIsEditing(false);
      setSelectedEventIndex(null);
      setClickedEventIndex(null);
    }).catch((info) => {
      console.log('Validation failed:', info);
    });
  };

  const handleDelete = () => {
    const newEvents = { ...events };
    if (newEvents[selectedDate]) {
      newEvents[selectedDate].splice(selectedEventIndex, 1);
      if (newEvents[selectedDate].length === 0) {
        delete newEvents[selectedDate];
      }
      setEvents(newEvents);
      setIsModalVisible(false);
      form.resetFields();
      setSelectedEventIndex(null);
      setClickedEventIndex(null);
    }
  };

  const dateCellRender = (value) => {
    const dateString = dayjs(value).format('YYYY-MM-DD');
    const listData = events[dateString] || [];

    return (
      <ul className="events">
        {listData.map((item, index) => (
          <li
            key={index}
            onClick={() => {
              showEventDetails(item, index);
              setClickedEventIndex(index);
            }}
            className={clickedEventIndex === index ? 'clicked' : ''}
          >
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="calendar-container">
      <Calendar dateCellRender={dateCellRender} onSelect={handleDateSelect} />

      <Modal
        title={isEditing ? `Edit Event for ${selectedDate}` : `Add Event for ${selectedDate}`}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setIsEditing(false);
          setSelectedEventIndex(null);
          setClickedEventIndex(null);
        }}
        footer={[
          isEditing && (
            <Button key="delete" type="danger" onClick={handleDelete}>
              Delete Event
            </Button>
          ),
          isEditing && (
            <Button
              key="attendance"
              type="default"
              onClick={() => {
                setIsAttendanceVisible(true);
                loadStudentsForEvent(selectedDate); // Load students for this event
              }}
            >
              Attendance
            </Button>
          ),
          <Button key="submit" type="primary" onClick={handleOk}>
            {isEditing ? 'Update Event' : 'Add Event'}
          </Button>
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="eventTitle"
            label="Event Title"
            rules={[{ required: true, message: 'Please input the event title!' }]}
          >
            <Input placeholder="Enter event title" />
          </Form.Item>
          <Form.Item name="eventDescription" label="Event Description">
            <Input.TextArea placeholder="Enter event description (optional)" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Attendance Modal */}
      <Modal
        title="Attendance"
        visible={isAttendanceVisible}
        onCancel={() => setIsAttendanceVisible(false)}
        footer={null} // No footer, just close button
      >
        <CalendarAttendance
          students={students}
          attendance={attendance}
          setAttendance={setAttendance} // Pass setAttendance to CalendarAttendance
          toggleAttendance={(id, type) => {
            setAttendance((prev) => {
              const updatedAttendance = { ...prev };
              updatedAttendance[id] = { present: type === 'present' };
              return updatedAttendance;
            });
          }}
          editingStudentId={editingStudentId}
          editingStudentName={editingStudentName}
          setEditingStudentName={setEditingStudentName}
          saveStudent={(id) => {
            // Implement saving student logic if needed
          }}
          startEditing={(student) => {
            setEditingStudentId(student._id);
            setEditingStudentName(student.name);
          }}
          deleteStudent={(id) => {
            // Implement student deletion logic if needed
          }}
          hideActions={false} // Make actions visible if necessary
        />
      </Modal>
    </div>
  );
};

export default CalendarComponent;
