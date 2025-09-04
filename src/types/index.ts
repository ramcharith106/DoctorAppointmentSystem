export interface User {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'doctor' | 'admin';
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
}

export interface Doctor extends User {
  specialty: string;
  experience: number;
  qualifications: string[];
  location: string;
  rating: number;
  consultationFee: number;
  bio: string;
  availability: TimeSlot[];
  image?: string;
}

export interface Patient extends User {
  medicalHistory?: string;
  emergencyContact?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  reason: string;
  notes?: string;
  createdAt: string;
}

export interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}
