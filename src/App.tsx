import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { initializeMockData } from './data/mockData';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import DoctorList from './pages/Doctors/DoctorList';
import DoctorProfile from './pages/Doctors/DoctorProfile';
import BookAppointment from './pages/BookAppointment';
import PatientDashboard from './pages/Patient/PatientDashboard';
import PatientAppointments from './pages/Patient/PatientAppointments';

function App() {
  useEffect(() => {
    initializeMockData();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/doctors" element={<DoctorList />} />
            <Route path="/doctors/:id" element={<DoctorProfile />} />
            
            {/* Protected Routes */}
            <Route 
              path="/book-appointment/:doctorId" 
              element={
                <ProtectedRoute>
                  <BookAppointment />
                </ProtectedRoute>
              } 
            />
            
            {/* Patient Routes */}
            <Route 
              path="/patient" 
              element={
                <ProtectedRoute requiredRole="patient">
                  <PatientDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/patient/appointments" 
              element={
                <ProtectedRoute requiredRole="patient">
                  <PatientAppointments />
                </ProtectedRoute>
              } 
            />
            
            {/* Doctor Routes */}
            <Route 
              path="/doctor" 
              element={
                <ProtectedRoute requiredRole="doctor">
                  <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Doctor Dashboard</h1>
                    <p className="text-gray-600">Coming soon...</p>
                  </div>
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
                    <p className="text-gray-600">Coming soon...</p>
                  </div>
                </ProtectedRoute>
              } 
            />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
