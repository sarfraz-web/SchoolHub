import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentApi, attendanceApi } from '../services/mockApi';
import Button from '../components/Button';
import Input from '../components/Input';

const Attendance = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [isMarkingMode, setIsMarkingMode] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedClass]);

  const loadData = () => {
    const allStudents = studentApi.getAll();
    let filteredStudents = allStudents;
    
    if (selectedClass) {
      filteredStudents = allStudents.filter(s => s.class === selectedClass);
    }
    
    setStudents(filteredStudents);
    
    // Load attendance for selected date
    const allAttendance = attendanceApi.getAll();
    const dateAttendance = allAttendance.filter(a => a.date === selectedDate);
    setAttendance(dateAttendance);
  };

  const getUniqueClasses = () => {
    const allStudents = studentApi.getAll();
    return [...new Set(allStudents.map(s => s.class))];
  };

  const getAttendanceStatus = (studentId) => {
    const record = attendance.find(a => a.studentId === studentId);
    return record ? record.status : null;
  };

  const markAttendance = (studentId, status) => {
    attendanceApi.markAttendance({
      studentId,
      date: selectedDate,
      status,
      markedBy: user.id
    });
    loadData();
  };

  const getStudentAttendance = (studentId) => {
    const allAttendance = attendanceApi.getAll();
    return allAttendance.filter(a => a.studentId === studentId);
  };

  const getAttendancePercentage = (studentId) => {
    const studentAttendance = getStudentAttendance(studentId);
    if (studentAttendance.length === 0) return 0;
    const presentDays = studentAttendance.filter(a => a.status === 'present').length;
    return Math.round((presentDays / studentAttendance.length) * 100);
  };

  // For students and parents - show their own attendance
  if (user.role === 'student' || user.role === 'parent') {
    const studentId = user.role === 'student' 
      ? students.find(s => s.email === user.email)?.id
      : students.find(s => s.parentEmail === user.email)?.id;
    
    if (!studentId) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Student Data Found</h2>
          </div>
        </div>
      );
    }

    const studentAttendance = getStudentAttendance(studentId);
    const attendancePercentage = getAttendancePercentage(studentId);

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
          <div className="py-4 sm:py-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">My Attendance</h1>
            
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Attendance Summary</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-blue-600">{attendancePercentage}%</p>
                  <p className="text-xs sm:text-sm text-gray-500">Overall Attendance</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">
                    {studentAttendance.filter(a => a.status === 'present').length}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">Days Present</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-red-600">
                    {studentAttendance.filter(a => a.status === 'absent').length}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">Days Absent</p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 sm:px-6 py-4 sm:py-5">
                <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900">Attendance History</h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {studentAttendance.slice(0, 20).map((record) => (
                  <li key={record.id} className="px-3 sm:px-4 py-3 sm:py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-900">
                          {new Date(record.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          record.status === 'present' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {record.status}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For teachers and admins - show marking interface
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Attendance Management</h1>
            <Button onClick={() => setIsMarkingMode(!isMarkingMode)} className="w-full sm:w-auto">
              {isMarkingMode ? 'View Mode' : 'Mark Attendance'}
            </Button>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-4 sm:mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Date
                </label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Class
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                >
                  <option value="">All Classes</option>
                  {getUniqueClasses().map((className) => (
                    <option key={className} value={className}>
                      {className}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {isMarkingMode ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 sm:px-6 py-4 sm:py-5">
                <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900">
                  Mark Attendance for {new Date(selectedDate).toLocaleDateString()}
                </h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {students.map((student) => {
                  const currentStatus = getAttendanceStatus(student.id);
                  return (
                    <li key={student.id} className="px-3 sm:px-4 py-3 sm:py-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-500 flex items-center justify-center">
                              <span className="text-white font-semibold text-sm sm:text-base">
                                {student.name.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                            <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                              {student.name}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500">
                              {student.studentId} • {student.class}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <Button
                            variant={currentStatus === 'present' ? 'success' : 'outline'}
                            size="sm"
                            onClick={() => markAttendance(student.id, 'present')}
                            className="text-xs sm:text-sm px-2 sm:px-3"
                          >
                            Present
                          </Button>
                          <Button
                            variant={currentStatus === 'absent' ? 'danger' : 'outline'}
                            size="sm"
                            onClick={() => markAttendance(student.id, 'absent')}
                            className="text-xs sm:text-sm px-2 sm:px-3"
                          >
                            Absent
                          </Button>
                          <Button
                            variant={currentStatus === 'late' ? 'secondary' : 'outline'}
                            size="sm"
                            onClick={() => markAttendance(student.id, 'late')}
                            className="text-xs sm:text-sm px-2 sm:px-3"
                          >
                            Late
                          </Button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 sm:px-6 py-4 sm:py-5">
                <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900">
                  Attendance Overview
                </h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {students.map((student) => {
                  const attendancePercentage = getAttendancePercentage(student.id);
                  const currentStatus = getAttendanceStatus(student.id);
                  
                  return (
                    <li key={student.id} className="px-3 sm:px-4 py-3 sm:py-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-500 flex items-center justify-center">
                              <span className="text-white font-semibold text-sm sm:text-base">
                                {student.name.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                            <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                              {student.name}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500">
                              {student.studentId} • {student.class}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4">
                          <div className="text-left sm:text-right">
                            <p className="text-xs sm:text-sm font-medium text-gray-900">
                              {attendancePercentage}%
                            </p>
                            <p className="text-xs text-gray-500">Overall</p>
                          </div>
                          {currentStatus && (
                            <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              currentStatus === 'present' 
                                ? 'bg-green-100 text-green-800' 
                                : currentStatus === 'late'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {currentStatus}
                            </span>
                          )}
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

export default Attendance;
