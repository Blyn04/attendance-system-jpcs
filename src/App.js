import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LayoutMain from './components/LayoutMain';
import Login from './components/login/Login';
import CalendarComponent from './components/calendar/CalendarComponent';
import Attendance from './components/tablecomponents/Attendance';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/main/*" element={<LayoutMain />} /> 
      {/* Remove these standalone routes since they are now part of LayoutMain */}
      {/* <Route path="/events" element={<CalendarComponent />} /> */}
      {/* <Route path="/attendance" element={<Attendance />} /> */}
      <Route path="*" element={<Navigate to="/login" />} /> 
    </Routes>
  );
}

export default App;
