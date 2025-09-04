import { faker } from '@faker-js/faker';
import { Doctor, Appointment } from '../types';

const specialties = [
  'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology',
  'Neurology', 'Oncology', 'Orthopedics', 'Pediatrics', 'Psychiatry',
  'Radiology', 'Surgery', 'Urology'
];

const locations = [
  'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX',
  'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA',
  'Dallas, TX', 'San Jose, CA'
];

const generateTimeSlots = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  return days.map(day => ({
    day,
    startTime: '09:00',
    endTime: '17:00',
    isAvailable: true
  }));
};

export const generateMockDoctors = (count: number = 20): Doctor[] => {
  const doctors: Doctor[] = [];
  
  for (let i = 0; i < count; i++) {
    const doctor: Doctor = {
      id: faker.string.uuid(),
      name: `Dr. ${faker.person.firstName()} ${faker.person.lastName()}`,
      email: faker.internet.email(),
      role: 'doctor',
      phone: faker.phone.number(),
      specialty: faker.helpers.arrayElement(specialties),
      experience: faker.number.int({ min: 2, max: 30 }),
      qualifications: [
        faker.helpers.arrayElement(['MD', 'MBBS', 'DO']),
        faker.helpers.arrayElement(['Board Certified', 'Fellowship Trained', 'Residency Completed'])
      ],
      location: faker.helpers.arrayElement(locations),
      rating: parseFloat(faker.number.float({ min: 3.5, max: 5.0 }).toFixed(1)),
      consultationFee: faker.number.int({ min: 100, max: 500 }),
      bio: faker.lorem.paragraph(),
      availability: generateTimeSlots(),
      image: `https://images.unsplash.com/photo-${1559757148 + i}?w=400&h=400&fit=crop&crop=face&auto=format`
    };
    
    doctors.push(doctor);
  }
  
  return doctors;
};

export const generateMockAppointments = (patientId: string, doctorIds: string[]): Appointment[] => {
  const appointments: Appointment[] = [];
  
  for (let i = 0; i < 5; i++) {
    const appointment: Appointment = {
      id: faker.string.uuid(),
      patientId,
      doctorId: faker.helpers.arrayElement(doctorIds),
      date: faker.date.future().toISOString().split('T')[0],
      time: faker.helpers.arrayElement(['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']),
      status: faker.helpers.arrayElement(['pending', 'confirmed', 'completed']),
      reason: faker.helpers.arrayElement([
        'Regular checkup', 'Follow-up consultation', 'Symptom evaluation',
        'Preventive care', 'Second opinion', 'Prescription renewal'
      ]),
      notes: faker.lorem.sentence(),
      createdAt: faker.date.past().toISOString()
    };
    
    appointments.push(appointment);
  }
  
  return appointments;
};

// Initialize mock data
export const initializeMockData = (): void => {
  if (!localStorage.getItem('doctors')) {
    const doctors = generateMockDoctors();
    localStorage.setItem('doctors', JSON.stringify(doctors));
  }
  
  if (!localStorage.getItem('appointments')) {
    localStorage.setItem('appointments', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('users')) {
    // Create some default users for testing
    const defaultUsers = [
      {
        id: '1',
        name: 'Admin User',
        email: 'admin@doccare.com',
        password: 'admin123',
        role: 'admin',
        phone: '+1234567890'
      },
      {
        id: '2',
        name: 'John Patient',
        email: 'patient@doccare.com',
        password: 'patient123',
        role: 'patient',
        phone: '+1234567891',
        dateOfBirth: '1990-01-01',
        gender: 'male'
      }
    ];
    localStorage.setItem('users', JSON.stringify(defaultUsers));
  }
};
