import React, { useState, useEffect } from 'react';
import { Table, Select, Button, DatePicker, Checkbox, message } from 'antd';
import dayjs from 'dayjs';
import axios from 'axios';

const AttendanceList = () => {
  const [dataSource, setDataSource] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs()); // Use dayjs for date state management
  const [selectedSection, setSelectedSection] = useState('INF223'); // Default section

  // Fetch students based on the selected section
  const fetchData = async () => {
      try {
          const response = await axios.get('http://localhost:5000/main/attendance', {
              params: { section: selectedSection } // Send selected section as a query parameter
          });
          
          console.log('Response from API:', response.data); // Log response
          const students = response.data.map((student) => ({
              key: student._id,
              studentId: student.customId,
              name: student.name,
              section: student.section, // Add the section field
              attendance: student.attendance || new Array(31).fill(false),
          }));
          console.log('Formatted students for table:', students); // Log formatted students
          setDataSource(students);
      } catch (error) {
          console.error('Error fetching data:', error);
          message.error('Failed to fetch attendance data');
      }
  };

  // Re-fetch data whenever the selected section changes
  useEffect(() => {
    fetchData(); // Ensure fetchData is called when selectedSection changes
  }, [selectedSection]);

  // Column definitions for the table
  const columns = [
    { title: 'Section', dataIndex: 'section', key: 'section' }, // Add section column
    { title: 'Student Id', dataIndex: 'studentId', key: 'studentId' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    ...Array.from({ length: 31 }, (_, i) => ({
      title: (i + 1).toString(),
      dataIndex: `attendance_${i + 1}`,
      key: `attendance_${i + 1}`,
      render: (_, record) => (
        <Checkbox
          checked={record.attendance[i]}
          onChange={(e) => handleAttendanceChange(record.key, i, e.target.checked)}
        />
      ),
    })),
  ];

  // Handle attendance checkbox changes
  const handleAttendanceChange = (key, day, checked) => {
    const updatedData = dataSource.map((item) => {
      if (item.key === key) {
        const newAttendance = [...item.attendance];
        newAttendance[day] = checked;
        return { ...item, attendance: newAttendance };
      }
      return item;
    });
    setDataSource(updatedData);
  };

  // Handle date selection changes
  const handleDateChange = (date) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  // Handle section selection changes
  const handleSectionChange = (value) => {
    setSelectedSection(value); // Update selected section
    console.log('Selected section changed to:', value); // Debugging line
  };

  // Informational search action
  const handleSearch = () => {
    const formattedDate = selectedDate.format('DD MMMM YYYY');
    message.info(`Searching for students in Section ${selectedSection} on ${formattedDate}`);
    fetchData(); // Optionally, refetch data on search
  };

  return (
    <div style={{ padding: '20px', maxWidth: '100vw' }}>
      <h1>Attendance</h1>
      <div style={{ marginBottom: 20 }}>
        <label>Select Date: </label>
        <DatePicker value={selectedDate} onChange={handleDateChange} style={{ marginRight: 16 }} />
        
        <h3>Student Count: {dataSource.length}</h3> {/* Display number of students */}
        <h3>Selected Section: {selectedSection}</h3> {/* Display selected section */}

        <label>Select Section: </label>
        <Select value={selectedSection} onChange={handleSectionChange} style={{ width: 120, marginRight: 16 }}>
          <Select.Option value="INF223">INF223</Select.Option>
          <Select.Option value="INF224">INF224</Select.Option>
          {/* Add more sections as needed */}
        </Select>

        <Button type="primary" onClick={handleSearch}>
          Search
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        scroll={{ x: '100%' }}
        style={{ width: '100%' }}
      />
    </div>
  );
};

export default AttendanceList;
