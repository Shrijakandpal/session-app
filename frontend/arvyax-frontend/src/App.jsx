// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegistrationPage';
import Dashboard from './pages/Dashboard';
import WellnessForm from './pages/WellnessForm';
import MySessions from './pages/MySessions'; 
import EditSession from './pages/EditSession';
import SessionDetails from './pages/SessionDetails';
import PublicSessionDetails from './pages/PublicSessionDetails';

function App() {
  return (
    <Routes>
      <Route path="/" element={<RegisterPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create-session" element={<WellnessForm />} />
      <Route path="/my-sessions" element={<MySessions />} />
      <Route path="/session/edit/:id" element={<EditSession />} />
      <Route path="/session/view/:id" element={<SessionDetails />} />
      <Route path="/session/view/:id" element={<PublicSessionDetails />} />


    </Routes>
  );
}

export default App;
