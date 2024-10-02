import React, { useState } from 'react';
import { Calendar, Badge, Modal, Button, Input, Form } from 'antd';
import dayjs from 'dayjs';
import '../../css/Calendar.css';
import AttendanceTable from '../tablecomponents/AttendanceTable';
import CalendarAttendance from './CalendarAttendance';

const CalendarComponent = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEventIndex, setSelectedEventIndex] = useState(null);
  const [clickedEventIndex, setClickedEventIndex] = useState(null);
  const [form] = Form.useForm();

  // Attendance Table states
  const [isAttendanceVisible, setIsAttendanceVisible] = useState(false);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editingStudentName, setEditingStudentName] = useState('');

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
    form.validateFields()
      .then((values) => {
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
      })
      .catch((info) => {
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
          events[selectedDate]?.length > 0 && (
            <Button
              key="attendance"
              type="default"
              onClick={() => setIsAttendanceVisible(true)}
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
          <Form.Item
            name="eventDescription"
            label="Event Description"
          >
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
          toggleAttendance={(id, type) => {
            // Implement your toggle logic here
          }}
          editingStudentId={editingStudentId}
          editingStudentName={editingStudentName}
          setEditingStudentName={setEditingStudentName}
          saveStudent={(id) => {
            // Implement your save logic here
          }}
          startEditing={(student) => {
            setEditingStudentId(student.id);
            setEditingStudentName(student.name);
          }}
          deleteStudent={(id) => {
            // Implement your delete logic here
          }}
          hideActions={true} 
        />
      </Modal>
    </div>
  );
};

export default CalendarComponent;
