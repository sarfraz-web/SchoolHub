import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { studentApi, attendanceApi, marksApi, feesApi, examApi } from '../services/mockApi';

const StudentProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [marks, setMarks] = useState([]);
  const [fees, setFees] = useState([]);
  const [exams, setExams] = useState([]);

  useEffect(() => {
    loadStudentData();
  }, [id]);

  const loadStudentData = () => {
    let studentId = id;
    
    // If no ID provided, get current user's student data
    if (!studentId) {
      if (user.role === 'student') {
        const currentStudent = studentApi.getAll().find(s => s.email === user.email);
        studentId = currentStudent?.id;
      } else if (user.role === 'parent') {
        const parentStudent = studentApi.getAll().find(s => s.parentEmail === user.email);
        studentId = parentStudent?.id;
      }
    }

    if (studentId) {
      const studentData = studentApi.getById(studentId);
      setStudent(studentData);
      
      if (studentData) {
        setAttendance(attendanceApi.getByStudent(studentId));
        setMarks(marksApi.getByStudent(studentId));
        setFees(feesApi.getByStudent(studentId));
        setExams(examApi.getAll());
      }
    }
  };

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Student Not Found</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const attendancePercentage = attendance.length > 0 
    ? Math.round((attendance.filter(a => a.status === 'present').length / attendance.length) * 100)
    : 0;

  const averageMarks = marks.length > 0
    ? Math.round(marks.reduce((sum, mark) => sum + mark.marks, 0) / marks.length)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="py-4 sm:py-6">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 sm:px-6 py-4 sm:py-5">
              <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900">
                Student Profile
              </h3>
              <p className="mt-1 max-w-2xl text-xs sm:text-sm text-gray-500">
                Complete information about {student.name}
              </p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-3 sm:px-4 py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-xs sm:text-sm font-medium text-gray-500">Full name</dt>
                  <dd className="mt-1 text-xs sm:text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {student.name}
                  </dd>
                </div>
                <div className="bg-white px-3 sm:px-4 py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-xs sm:text-sm font-medium text-gray-500">Student ID</dt>
                  <dd className="mt-1 text-xs sm:text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {student.studentId}
                  </dd>
                </div>
                <div className="bg-gray-50 px-3 sm:px-4 py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-xs sm:text-sm font-medium text-gray-500">Email address</dt>
                  <dd className="mt-1 text-xs sm:text-sm text-gray-900 sm:mt-0 sm:col-span-2 break-all">
                    {student.email}
                  </dd>
                </div>
                <div className="bg-white px-3 sm:px-4 py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-xs sm:text-sm font-medium text-gray-500">Class</dt>
                  <dd className="mt-1 text-xs sm:text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {student.class}
                  </dd>
                </div>
                <div className="bg-gray-50 px-3 sm:px-4 py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-xs sm:text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-xs sm:text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {student.phone}
                  </dd>
                </div>
                <div className="bg-white px-3 sm:px-4 py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-xs sm:text-sm font-medium text-gray-500">Date of Birth</dt>
                  <dd className="mt-1 text-xs sm:text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {student.dateOfBirth}
                  </dd>
                </div>
                <div className="bg-gray-50 px-3 sm:px-4 py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-xs sm:text-sm font-medium text-gray-500">Admission Date</dt>
                  <dd className="mt-1 text-xs sm:text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {student.admissionDate}
                  </dd>
                </div>
                <div className="bg-white px-3 sm:px-4 py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-xs sm:text-sm font-medium text-gray-500">Address</dt>
                  <dd className="mt-1 text-xs sm:text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {student.address}
                  </dd>
                </div>
                <div className="bg-gray-50 px-3 sm:px-4 py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-xs sm:text-sm font-medium text-gray-500">Parent Name</dt>
                  <dd className="mt-1 text-xs sm:text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {student.parentName}
                  </dd>
                </div>
                <div className="bg-white px-3 sm:px-4 py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-xs sm:text-sm font-medium text-gray-500">Parent Email</dt>
                  <dd className="mt-1 text-xs sm:text-sm text-gray-900 sm:mt-0 sm:col-span-2 break-all">
                    {student.parentEmail}
                  </dd>
                </div>
                <div className="bg-gray-50 px-3 sm:px-4 py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-xs sm:text-sm font-medium text-gray-500">Parent Phone</dt>
                  <dd className="mt-1 text-xs sm:text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {student.parentPhone}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <h3 className="text-sm sm:text-lg font-semibold text-gray-900">Attendance</h3>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">{attendancePercentage}%</p>
              <p className="text-xs sm:text-sm text-gray-500">
                {attendance.filter(a => a.status === 'present').length} of {attendance.length} days
              </p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <h3 className="text-sm sm:text-lg font-semibold text-gray-900">Average Marks</h3>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">{averageMarks}%</p>
              <p className="text-xs sm:text-sm text-gray-500">
                Based on {marks.length} exams
              </p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <h3 className="text-sm sm:text-lg font-semibold text-gray-900">Pending Fees</h3>
              <p className="text-2xl sm:text-3xl font-bold text-red-600">
                {fees.filter(f => !f.isPaid).length}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                Total: ${fees.filter(f => !f.isPaid).reduce((sum, f) => sum + f.amount, 0)}
              </p>
            </div>
          </div>

          {/* Recent Marks */}
          {marks.length > 0 && (
            <div className="mt-6 sm:mt-8 bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 sm:px-6 py-4 sm:py-5">
                <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900">Recent Marks</h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {marks.slice(0, 5).map((mark) => {
                  const exam = exams.find(e => e.id === mark.examId);
                  return (
                    <li key={mark.id} className="px-3 sm:px-4 py-3 sm:py-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                            {exam?.name || 'Unknown Exam'}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {exam?.subject || 'N/A'} • {new Date(mark.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-base sm:text-lg font-semibold text-gray-900">
                            {mark.marks}%
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
