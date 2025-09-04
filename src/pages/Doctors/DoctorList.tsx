import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Doctor } from '../../types';
import { Search, MapPin, Star, Filter } from 'lucide-react';

const DoctorList: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  useEffect(() => {
    const storedDoctors = JSON.parse(localStorage.getItem('doctors') || '[]');
    setDoctors(storedDoctors);
    setFilteredDoctors(storedDoctors);
  }, []);

  useEffect(() => {
    let filtered = doctors;

    if (searchTerm) {
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSpecialty) {
      filtered = filtered.filter(doctor => doctor.specialty === selectedSpecialty);
    }

    if (selectedLocation) {
      filtered = filtered.filter(doctor => doctor.location === selectedLocation);
    }

    setFilteredDoctors(filtered);
  }, [doctors, searchTerm, selectedSpecialty, selectedLocation]);

  const specialties = Array.from(new Set(doctors.map(doctor => doctor.specialty)));
  const locations = Array.from(new Set(doctors.map(doctor => doctor.location)));

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Doctors</h1>
        <p className="text-gray-600">Search for qualified healthcare professionals</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors or specialties..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              <option value="">All Specialties</option>
              {specialties.map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedSpecialty('');
              setSelectedLocation('');
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
        Showing {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''}
      </div>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map(doctor => (
          <div key={doctor.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <img
                src={doctor.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=3b82f6&color=fff`}
                alt={doctor.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">{doctor.rating}</span>
                  <span className="text-sm text-gray-400">({doctor.experience} years exp.)</span>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{doctor.location}</span>
              </div>
              <div className="text-sm text-gray-600">
                Consultation Fee: <span className="font-semibold text-gray-900">${doctor.consultationFee}</span>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-600 line-clamp-2">{doctor.bio}</p>
            </div>

            <div className="mt-6 flex space-x-3">
              <Link
                to={`/doctors/${doctor.id}`}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-center hover:bg-blue-700 transition-colors"
              >
                View Profile
              </Link>
              <Link
                to={`/book-appointment/${doctor.id}`}
                className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded-md text-center hover:bg-blue-50 transition-colors"
              >
                Book Now
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No doctors found matching your criteria.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedSpecialty('');
              setSelectedLocation('');
            }}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorList;
