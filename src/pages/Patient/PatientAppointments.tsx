import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Appointment, Doctor } from '../../types';
import { Calendar, Clock, Filter, Search, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const PatientAppointments: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (user) {
      const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      const userAppointments = allAppointments
        .filter((app: Appointment) => app.patientId === user.id)
        .sort((a: Appointment, b: Appointment) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setAppointments(userAppointments);
      setFilteredAppointments(userAppointments);

      const allDoctors = JSON.parse(localStorage.getItem('doctors') || '[]');
      setDoctors(allDoctors);
    }
  }, [user]);

  useEffect(() => {
    let filtered = appointments;

    if (searchTerm) {
      filtered = filtered.filter(app => {
        const doctor = getDoctorName(app.doctorId);
        const specialty = getDoctorSpecialty(app.doctorId);
        return doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
               specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
               app.reason.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    if (statusFilter) {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    setFilteredAppointments(filtered);
  }, [appointments, searchTerm, statusFilter]);

  const getDoctorName = (doctorId: string): string => {
    const doctor = doctors.find(d => d.id === doctorId);
    return doctor ? doctor.name : 'Unknown Doctor';
  };

  const getDoctorSpecialty = (doctorId: string): string => {
    const doctor = doctors.find(d => d.id === doctorId);
    return doctor ? doctor.specialty : 'Unknown Specialty';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  const handleCancelAppointment = (appointmentId: string): void => {
    const updatedAppointments = appointments.map(app =>
      app.id === appointmentId ? { ...app, status: 'cancelled' as const } : app
    );
    
    setAppointments(updatedAppointments);
    
    // Update localStorage
    const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const updatedAllAppointments = allAppointments.map((app: Appointment) =>
      app.id === appointmentId ? { ...app, status: 'cancelled' } : app
    );
    localStorage.setItem('appointments', JSON.stringify(updatedAllAppointments));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
        <p className="text-gray-600">Manage your healthcare appointments</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search appointments..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('');
            }}
            className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span>Clear Filters</span>
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''}
      </div>

      {/* Appointments List */}
      {filteredAppointments.length > 0 ? (
        <div className="space-y-4">
          {filteredAppointments.map(appointment => (
            <div key={appointment.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 pt-1">
                    {getStatusIcon(appointment.status)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {getDoctorName(appointment.doctorId)}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </div>
                    
                    <p className="text-blue-600 font-medium mb-2">{getDoctorSpecialty(appointment.doctorId)}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{format(parseISO(appointment.date), 'EEEE, MMMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{appointment.time}</span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700">Reason for Visit:</p>
                      <p className="text-sm text-gray-600">{appointment.reason}</p>
                    </div>
                    
                    {appointment.notes && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700">Notes:</p>
                        <p className="text-sm text-gray-600">{appointment.notes}</p>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500">
                      Booked on {format(parseISO(appointment.createdAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 ml-4">
                  {appointment.status === 'pending' && (
                    <button
                      onClick={() => handleCancelAppointment(appointment.id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No appointments found</p>
          <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default PatientAppointments;
