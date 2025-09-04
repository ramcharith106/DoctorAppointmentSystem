import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, Users, Clock, Shield } from 'lucide-react';

const Home: React.FC = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Calendar,
      title: 'Easy Booking',
      description: 'Book appointments with qualified doctors in just a few clicks'
    },
    {
      icon: Users,
      title: 'Qualified Doctors',
      description: 'Access to experienced healthcare professionals across specialties'
    },
    {
      icon: Clock,
      title: 'Flexible Scheduling',
      description: 'Choose appointment times that work with your schedule'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your health information is protected with enterprise-grade security'
    }
  ];

  const getDashboardLink = (): string => {
    if (!user) return '/login';
    
    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'doctor':
        return '/doctor';
      case 'patient':
        return '/patient';
      default:
        return '/login';
    }
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
          Your Health,
          <span className="text-blue-600"> Our Priority</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Book appointments with qualified doctors online. Find healthcare professionals 
          by specialty and location, manage your health appointments efficiently.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <Link
              to={getDashboardLink()}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="/doctors"
                className="border border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Find Doctors
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <feature.icon className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </section>

      {/* Stats Section */}
      <section className="bg-blue-600 text-white rounded-2xl p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">500+</div>
            <div className="text-blue-100">Qualified Doctors</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">10,000+</div>
            <div className="text-blue-100">Happy Patients</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">50+</div>
            <div className="text-blue-100">Medical Specialties</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="text-center bg-gray-100 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of patients who trust DocCare for their healthcare needs.
          </p>
          <Link
            to="/register"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
          >
            Create Your Account
          </Link>
        </section>
      )}
    </div>
  );
};

export default Home;
