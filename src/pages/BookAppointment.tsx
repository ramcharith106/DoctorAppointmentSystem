import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Doctor, Appointment } from '../types';
import { Calendar, Clock, User, FileText, AlertCircle } from 'lucide-react';
import { format, addDays, parseISO } from 'date-fns';

const BookAppointment: React.FC = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const doctors = JSON.parse(localStorage.getItem('doctors') || '[]');
    const foundDoctor = doctors.find((d: Doctor) => d.id === doctorId);
    setDoctor(foundDoctor || null);
  }, [doctorId, user, navigate]);

  const getAvailableDates = (): string[] => {
    const dates: string[] = [];
    for (let i = 1; i <= 14; i++) {
      const date = addDays(new Date(), i);
      dates.push(format(date, 'yyyy-MM-dd'));
    }
    return dates;
  };

  const getAvailableTimes = (): string[] => {
    if (!selectedDate || !doctor) return [];
    
    const dayOfWeek = format(parseISO(selectedDate), 'EEEE');
    const availability = doctor.availability.find(slot => slot.day === dayOfWeek);
    
    if (!availability || !availability.isAvailable) return [];
    
    const times: string[] = [];
    const startHour = parseInt(availability.startTime.split(':')[0]);
    const endHour = parseInt(availability.endTime.split(':')[0]);
    
    for (let hour = startHour; hour < endHour; hour++) {
      times.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < endHour - 1) {
        times.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    
    return times;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!user || !doctor) return;
    
    setError('');
    setLoading(true);

    if (!selectedDate || !selectedTime || !reason.trim()) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      patientId: user.id,
      doctorId: doctor.id,
      date: selectedDate,
      time: selectedTime,
      status: 'pending',
      reason: reason.trim(),
      notes: notes.trim(),
      createdAt: new Date().toISOString()
    };

    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    appointments.push(newAppointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));

    setLoading(false);
    navigate('/patient/appointments');
  };

  if (!user) {
    return null;
  }

  if (!doctor) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Doctor not found.</p>
      </div>
    );
  }

  const availableDates = getAvailableDates();
  const availableTimes = getAvailableTimes();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Appointment</h1>
        <p className="text-gray-600">Schedule a consultation with {doctor.name}</p>
      </div>

      {/* Doctor Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-4">
          <img
            src={doctor.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=3b82f6&color=fff`}
            alt={doctor.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
            <p className="text-blue-600 font-medium">{doctor.specialty}</p>
            <p className="text-gray-600">Consultation Fee: <span className="font-semibold">${doctor.consultationFee}</span></p>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              Select Date
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedTime(''); // Reset time when date changes
              }}
              required
            >
              <option value="">Choose a date...</option>
              {availableDates.map(date => (
                <option key={date} value={date}>
                  {format(parseISO(date), 'EEEE, MMMM dd, yyyy')}
                </option>
              ))}
            </select>
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="inline h-4 w-4 mr-1" />
              Select Time
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              required
              disabled={!selectedDate}
            >
              <option value="">Choose a time...</option>
              {availableTimes.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
            {selectedDate && availableTimes.length === 0 && (
              <p className="text-sm text-red-600 mt-1">No available times for this date</p>
            )}
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="inline h-4 w-4 mr-1" />
              Reason for Visit *
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            >
              <option value="">Select reason...</option>
              <option value="Regular checkup">Regular checkup</option>
              <option value="Follow-up consultation">Follow-up consultation</option>
              <option value="Symptom evaluation">Symptom evaluation</option>
              <option value="Preventive care">Preventive care</option>
              <option value="Second opinion">Second opinion</option>
              <option value="Prescription renewal">Prescription renewal</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Any additional information you'd like to share with the doctor..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Patient Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
              <User className="h-4 w-4 mr-1" />
              Patient Information
            </h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Name:</span> {user.name}</p>
              <p><span className="font-medium">Email:</span> {user.email}</p>
              {user.phone && <p><span className="font-medium">Phone:</span> {user.phone}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading || !selectedDate || !selectedTime || !reason.trim()}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/doctors')}
              className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-md font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
