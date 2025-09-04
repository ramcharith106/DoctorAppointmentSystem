import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Doctor } from '../../types';
import { MapPin, Star, Clock, Award, Calendar } from 'lucide-react';

const DoctorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    const doctors = JSON.parse(localStorage.getItem('doctors') || '[]');
    const foundDoctor = doctors.find((d: Doctor) => d.id === id);
    setDoctor(foundDoctor || null);
  }, [id]);

  if (!doctor) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Doctor not found.</p>
        <Link to="/doctors" className="mt-4 text-blue-600 hover:text-blue-700 font-medium">
          Back to Doctor List
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
          <img
            src={doctor.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=3b82f6&color=fff&size=200`}
            alt={doctor.name}
            className="w-32 h-32 rounded-full object-cover mx-auto md:mx-0"
          />
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900">{doctor.name}</h1>
            <p className="text-xl text-blue-600 font-medium mt-1">{doctor.specialty}</p>
            
            <div className="flex items-center justify-center md:justify-start space-x-4 mt-4">
              <div className="flex items-center space-x-1">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="font-semibold">{doctor.rating}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Award className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{doctor.experience} years experience</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{doctor.location}</span>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-2xl font-bold text-gray-900">
                ${doctor.consultationFee}
                <span className="text-base font-normal text-gray-600"> / consultation</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <Link
              to={`/book-appointment/${doctor.id}`}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
            >
              Book Appointment
            </Link>
            <Link
              to="/doctors"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center"
            >
              Back to List
            </Link>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">About Dr. {doctor.name.split(' ').pop()}</h2>
        <p className="text-gray-600 leading-relaxed">{doctor.bio}</p>
      </div>

      {/* Qualifications */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Qualifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {doctor.qualifications.map((qualification, index) => (
            <div key={index} className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
              <Award className="h-6 w-6 text-blue-600" />
              <span className="font-medium text-gray-900">{qualification}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Availability</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctor.availability.map((slot, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-gray-900">{slot.day}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{slot.startTime} - {slot.endTime}</span>
              </div>
              <div className="mt-2">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  slot.isAvailable 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {slot.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
        <div className="space-y-3">
          <div>
            <span className="font-medium text-gray-900">Email: </span>
            <span className="text-gray-600">{doctor.email}</span>
          </div>
          {doctor.phone && (
            <div>
              <span className="font-medium text-gray-900">Phone: </span>
              <span className="text-gray-600">{doctor.phone}</span>
            </div>
          )}
          <div>
            <span className="font-medium text-gray-900">Location: </span>
            <span className="text-gray-600">{doctor.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
