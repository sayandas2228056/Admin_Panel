import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './Pages/Login'
import AuthOtp from './Pages/AuthOtp'
import Dashboard from './Pages/Dashboard'
import TicketDetails from './Pages/TicketDetails'
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth-otp" element={<AuthOtp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tickets/:id" element={<TicketDetails />} />
      </Routes>
    </div>
  )
}

export default App