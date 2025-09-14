import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { marksApi, examApi, studentApi } from '../services/mockApi';

const Marks = () => {
  const { user } = useAuth();
  const [marks, setMarks] = useState([]);
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');

  useEffect(() => {
    loadData();
  }, [selectedStudent]);

  const loadData = () => {
    setExams(examApi.getAll());
    setStudents(studentApi.getAll());
    
    if (selectedStudent) {
      setMarks(marksApi.getByStudent(selectedStudent));
    } else {
      setMarks(marksApi.getAll());
    }
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown Student';
  };

  const getExamName = (examId) => {
    const exam = exams.find(e => e.id === examId);
    return exam ? exam.name : 'Unknown Exam';
  };

  const getGrade = (marks) => {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B';
    if (marks >= 60) return 'C';
    if (marks >= 50) return 'D';
    return 'F';
  };

  const getGradeColor = (marks) => {
    if (marks >= 80) return 'text-green-600';
    if (marks >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // For students - show their own marks
  if (user.role === 'student') {
    const student = students.find(s => s.email === user.email);
    if (!student) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Student Data Not Found</h2>
          </div>
        </div>
      );
    }

    const studentMarks = marksApi.getByStudent(student.id);
    const averageMarks = studentMarks.length > 0 
      ? Math.round(studentMarks.reduce((sum, mark) => sum + mark.marks, 0) / studentMarks.length)
      : 0;

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
          <div className="py-4 sm:py-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">My Exam Results</h1>
            
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Performance Summary</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-blue-600">{averageMarks}%</p>
                  <p className="text-xs sm:text-sm text-gray-500">Average</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">{studentMarks.length}</p>
                  <p className="text-xs sm:text-sm text-gray-500">Exams</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-purple-600">
                    {studentMarks.filter(m => m.marks >= 80).length}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">A Grades</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-orange-600">
                    {studentMarks.filter(m => m.marks < 60).length}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">Below 60%</p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 sm:px-6 py-4 sm:py-5">
                <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900">Detailed Results</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Exam
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Marks
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grade
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {studentMarks.map((mark) => {
                      const exam = exams.find(e => e.id === mark.examId);
                      if (!exam) return null;
                      
                      return (
                        <tr key={mark.id}>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                            {exam.name}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            {exam.subject}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            {new Date(exam.date).toLocaleDateString()}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                            {mark.marks}/{mark.maxMarks}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <span className={`text-xs sm:text-sm font-medium ${getGradeColor(mark.marks)}`}>
                              {getGrade(mark.marks)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For parents - show their child's marks
  if (user.role === 'parent') {
    const parentStudent = students.find(s => s.parentEmail === user.email);
    if (!parentStudent) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Child's Data Not Found</h2>
          </div>
        </div>
      );
    }

    const childMarks = marksApi.getByStudent(parentStudent.id);
    const averageMarks = childMarks.length > 0 
      ? Math.round(childMarks.reduce((sum, mark) => sum + mark.marks, 0) / childMarks.length)
      : 0;

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
          <div className="py-4 sm:py-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
              {parentStudent.name}'s Exam Results
            </h1>
            
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Performance Summary</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-blue-600">{averageMarks}%</p>
                  <p className="text-xs sm:text-sm text-gray-500">Average</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">{childMarks.length}</p>
                  <p className="text-xs sm:text-sm text-gray-500">Exams</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-purple-600">
                    {childMarks.filter(m => m.marks >= 80).length}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">A Grades</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-orange-600">
                    {childMarks.filter(m => m.marks < 60).length}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">Below 60%</p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 sm:px-6 py-4 sm:py-5">
                <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900">Detailed Results</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Exam
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Marks
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grade
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {childMarks.map((mark) => {
                      const exam = exams.find(e => e.id === mark.examId);
                      if (!exam) return null;
                      
                      return (
                        <tr key={mark.id}>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                            {exam.name}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            {exam.subject}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            {new Date(exam.date).toLocaleDateString()}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                            {mark.marks}/{mark.maxMarks}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <span className={`text-xs sm:text-sm font-medium ${getGradeColor(mark.marks)}`}>
                              {getGrade(mark.marks)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For teachers and admins - show all marks with filtering
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Marks Management</h1>
            <div className="flex items-center space-x-4">
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base w-full sm:w-auto"
              >
                <option value="">All Students</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} ({student.studentId})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 sm:px-6 py-4 sm:py-5">
              <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900">
                {selectedStudent ? `${getStudentName(selectedStudent)}'s Marks` : 'All Marks'}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Exam
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Marks
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {marks.map((mark) => {
                    const exam = exams.find(e => e.id === mark.examId);
                    if (!exam) return null;
                    
                    return (
                      <tr key={mark.id}>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                          {getStudentName(mark.studentId)}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                          {exam.name}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                          {exam.subject}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                          {new Date(exam.date).toLocaleDateString()}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                          {mark.marks}/{mark.maxMarks}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <span className={`text-xs sm:text-sm font-medium ${getGradeColor(mark.marks)}`}>
                            {getGrade(mark.marks)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {marks.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-500 text-sm sm:text-base">No marks found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marks;
