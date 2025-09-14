import React from 'react';
import { useAuth } from '../context/AuthContext';
import { studentApi, noticeApi, feesApi } from '../services/mockApi';

const Dashboard = () => {
  const { user } = useAuth();
  
  const students = studentApi.getAll();
  const notices = noticeApi.getAll();
  const fees = feesApi.getAll();

  const getDashboardContent = () => {
    switch (user.role) {
      case 'admin':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Total Students</h3>
              <p className="text-3xl font-bold text-blue-600">{students.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Total Notices</h3>
              <p className="text-3xl font-bold text-green-600">{notices.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Pending Fees</h3>
              <p className="text-3xl font-bold text-red-600">
                {fees.filter(f => !f.isPaid).length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Paid Fees</h3>
              <p className="text-3xl font-bold text-green-600">
                {fees.filter(f => f.isPaid).length}
              </p>
            </div>
          </div>
        );
      
      case 'teacher':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">My Students</h3>
              <p className="text-3xl font-bold text-blue-600">{students.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Recent Notices</h3>
              <p className="text-3xl font-bold text-green-600">{notices.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Subject</h3>
              <p className="text-lg font-bold text-purple-600">{user.subject || 'N/A'}</p>
            </div>
          </div>
        );
      
      case 'student':
        const studentFees = fees.filter(f => f.studentId === user.id);
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">My Class</h3>
              <p className="text-2xl font-bold text-blue-600">{user.class || 'N/A'}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Student ID</h3>
              <p className="text-2xl font-bold text-green-600">{user.studentId || 'N/A'}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Pending Fees</h3>
              <p className="text-3xl font-bold text-red-600">
                {studentFees.filter(f => !f.isPaid).length}
              </p>
            </div>
          </div>
        );
      
      case 'parent':
        const parentStudent = students.find(s => s.parentEmail === user.email);
        const parentFees = parentStudent ? fees.filter(f => f.studentId === parentStudent.id) : [];
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Child's Name</h3>
              <p className="text-2xl font-bold text-blue-600">{parentStudent?.name || 'N/A'}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Child's Class</h3>
              <p className="text-2xl font-bold text-green-600">{parentStudent?.class || 'N/A'}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Pending Fees</h3>
              <p className="text-3xl font-bold text-red-600">
                {parentFees.filter(f => !f.isPaid).length}
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Welcome, {user.name}!
          </h1>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Dashboard Overview</h2>
            {getDashboardContent()}
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Notices</h3>
            </div>
            <div className="p-6">
              {notices.length > 0 ? (
                <div className="space-y-4">
                  {notices.slice(0, 3).map((notice) => (
                    <div key={notice.id} className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold text-gray-900">{notice.title}</h4>
                      <p className="text-gray-600 text-sm mt-1">{notice.content}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(notice.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No notices available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
