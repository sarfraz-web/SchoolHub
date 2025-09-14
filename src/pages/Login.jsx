import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register({
          ...formData,
          name: formData.email.split('@')[0],
          phone: '123-456-7890'
        });
      }
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { role: 'Admin', email: 'admin@school.com', password: 'admin123' },
    { role: 'Teacher', email: 'teacher@school.com', password: 'teacher123' },
    { role: 'Student', email: 'student@school.com', password: 'student123' },
    { role: 'Parent', email: 'parent@school.com', password: 'parent123' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header - Only show on small screens */}
      <div className="md:hidden bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-900">SchoolHub</h1>
              <p className="text-sm text-gray-600">School Management System</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-screen">
        {/* Left Section - Branding (Hidden on mobile/tablet) */}
        <div className="hidden lg:flex w-1/2 items-center justify-center px-8 py-0 bg-white">
          <div className="max-w-md w-full">
            {/* Logo */}
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
            </div>
            
            {/* App Name */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              SchoolHub
            </h1>
            <p className="text-lg text-gray-600 mb-12 leading-relaxed">
              Comprehensive School Management System for modern educational institutions
            </p>
            
            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Multi-Role Access</h3>
                  <p className="text-sm text-gray-600">Admin, Teacher, Student, Parent</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Grade Management</h3>
                  <p className="text-sm text-gray-600">Complete academic tracking</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 102.828 2.828L7.828 10H4.828zM4.828 17H7.828l-2.586 2.586a2 2 0 01-2.828-2.828L4.828 17z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Real-time Updates</h3>
                  <p className="text-sm text-gray-600">Instant notifications</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Attendance Tracking</h3>
                  <p className="text-sm text-gray-600">Automated monitoring</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Section - Login Form (Full width on mobile/tablet) */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
                Welcome to SchoolHub
              </h2>
              
              {/* Toggle Buttons */}
              <div className="flex mb-6 sm:mb-8 bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                    isLogin 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                    !isLogin 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Register
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Role
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                      required
                    >
                      <option value="student">Student</option>
                      <option value="parent">Parent</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username or Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your username or email"
                    className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    required
                  />
                </div>

                {error && (
                  <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 sm:py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {loading ? 'Signing in...' : isLogin ? 'Sign In' : 'Register'}
                </button>
              </form>
              
              {/* Demo Accounts */}
              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-3 sm:mb-4 text-center">
                  Demo Accounts - Click to use:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {demoAccounts.map((account) => (
                    <button
                      key={account.role}
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          email: account.email,
                          password: account.password
                        });
                      }}
                      className="text-xs sm:text-sm text-gray-700 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 border border-gray-200 p-2 sm:p-3 rounded-lg transition-colors text-left"
                    >
                      <div className="font-semibold text-gray-900 mb-1">{account.role}</div>
                      <div className="text-gray-600 text-xs">{account.email}</div>
                      <div className="text-gray-500 text-xs">Password: {account.password}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;