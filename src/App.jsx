import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import StudentsList from './pages/StudentsList';
import StudentProfile from './pages/StudentProfile';
import Attendance from './pages/Attendance';
import Exams from './pages/Exams';
import Marks from './pages/Marks';
import Notices from './pages/Notices';
import Fees from './pages/Fees';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Student Management */}
            <Route 
              path="/students" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                  <StudentsList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/students/:id" 
              element={
                <ProtectedRoute>
                  <StudentProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <StudentProfile />
                </ProtectedRoute>
              } 
            />
            
            {/* Attendance */}
            <Route 
              path="/attendance" 
              element={
                <ProtectedRoute>
                  <Attendance />
                </ProtectedRoute>
              } 
            />
            
            {/* Exams */}
            <Route 
              path="/exams" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                  <Exams />
                </ProtectedRoute>
              } 
            />
            
            {/* Marks */}
            <Route 
              path="/marks" 
              element={
                <ProtectedRoute>
                  <Marks />
                </ProtectedRoute>
              } 
            />
            
            {/* Notices */}
            <Route 
              path="/notices" 
              element={
                <ProtectedRoute>
                  <Notices />
                </ProtectedRoute>
              } 
            />
            
            {/* Fees */}
            <Route 
              path="/fees" 
              element={
                <ProtectedRoute>
                  <Fees />
                </ProtectedRoute>
              } 
            />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
