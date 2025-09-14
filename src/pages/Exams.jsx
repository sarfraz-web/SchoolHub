import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { examApi, marksApi, studentApi } from '../services/mockApi';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';

const Exams = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMarksModalOpen, setIsMarksModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    date: '',
    maxMarks: '',
    description: ''
  });
  const [marksData, setMarksData] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setExams(examApi.getAll());
    setStudents(studentApi.getAll());
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingExam) {
      examApi.update(editingExam.id, formData);
    } else {
      examApi.create(formData);
    }
    
    loadData();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      subject: '',
      date: '',
      maxMarks: '',
      description: ''
    });
    setEditingExam(null);
    setIsModalOpen(false);
  };

  const handleEdit = (exam) => {
    setEditingExam(exam);
    setFormData(exam);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      examApi.delete(id);
      loadData();
    }
  };

  const handleEnterMarks = (exam) => {
    setSelectedExam(exam);
    const existingMarks = marksApi.getByExam(exam.id);
    const marksObj = {};
    existingMarks.forEach(mark => {
      marksObj[mark.studentId] = mark.marks;
    });
    setMarksData(marksObj);
    setIsMarksModalOpen(true);
  };

  const handleMarksChange = (studentId, value) => {
    setMarksData({
      ...marksData,
      [studentId]: value
    });
  };

  const handleMarksSubmit = (e) => {
    e.preventDefault();
    
    Object.entries(marksData).forEach(([studentId, marks]) => {
      if (marks && marks !== '') {
        marksApi.create({
          examId: selectedExam.id,
          studentId,
          marks: parseInt(marks),
          maxMarks: parseInt(selectedExam.maxMarks)
        });
      }
    });
    
    setIsMarksModalOpen(false);
    setMarksData({});
    setSelectedExam(null);
  };

  const getStudentMarks = (examId, studentId) => {
    const marks = marksApi.getByExam(examId);
    const studentMark = marks.find(m => m.studentId === studentId);
    return studentMark ? studentMark.marks : null;
  };

  const getAverageMarks = (examId) => {
    const marks = marksApi.getByExam(examId);
    if (marks.length === 0) return 0;
    const total = marks.reduce((sum, mark) => sum + mark.marks, 0);
    return Math.round(total / marks.length);
  };

  // For students - show their marks
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
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Exam Results</h1>
            
            <div className="bg-white p-6 rounded-lg shadow mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">{averageMarks}%</p>
                  <p className="text-sm text-gray-500">Average Marks</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">{studentMarks.length}</p>
                  <p className="text-sm text-gray-500">Exams Taken</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">
                    {studentMarks.filter(m => m.marks >= 80).length}
                  </p>
                  <p className="text-sm text-gray-500">A Grades</p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Exam Results</h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {studentMarks.map((mark) => {
                  const exam = exams.find(e => e.id === mark.examId);
                  if (!exam) return null;
                  
                  return (
                    <li key={mark.id} className="px-4 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {exam.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {exam.subject} • {new Date(exam.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">
                            {mark.marks}%
                          </p>
                          <p className="text-xs text-gray-500">
                            {mark.marks >= 80 ? 'A' : mark.marks >= 70 ? 'B' : mark.marks >= 60 ? 'C' : 'D'}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For teachers and admins - show exam management
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Exams Management</h1>
            <Button onClick={() => setIsModalOpen(true)}>
              Create New Exam
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <div key={exam.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{exam.name}</h3>
                    <p className="text-sm text-gray-500">{exam.subject}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Max Marks</p>
                    <p className="text-lg font-semibold text-gray-900">{exam.maxMarks}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    Date: {new Date(exam.date).toLocaleDateString()}
                  </p>
                  {exam.description && (
                    <p className="text-sm text-gray-500 mt-1">{exam.description}</p>
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500">
                    Average: {getAverageMarks(exam.id)}%
                  </p>
                </div>

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleEnterMarks(exam)}
                  >
                    Enter Marks
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(exam)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(exam.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {exams.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No exams found</p>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Exam Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={resetForm}
        title={editingExam ? 'Edit Exam' : 'Create New Exam'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Exam Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            label="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />
          <Input
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
          <Input
            label="Maximum Marks"
            name="maxMarks"
            type="number"
            value={formData.maxMarks}
            onChange={handleChange}
            required
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button type="submit">
              {editingExam ? 'Update' : 'Create'} Exam
            </Button>
          </div>
        </form>
      </Modal>

      {/* Enter Marks Modal */}
      <Modal
        isOpen={isMarksModalOpen}
        onClose={() => setIsMarksModalOpen(false)}
        title={`Enter Marks - ${selectedExam?.name}`}
        size="lg"
      >
        <form onSubmit={handleMarksSubmit} className="space-y-4">
          <div className="max-h-96 overflow-y-auto">
            {students.map((student) => (
              <div key={student.id} className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="text-sm font-medium text-gray-900">{student.name}</p>
                  <p className="text-xs text-gray-500">{student.studentId} • {student.class}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    max={selectedExam?.maxMarks}
                    value={marksData[student.id] || ''}
                    onChange={(e) => handleMarksChange(student.id, e.target.value)}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="Marks"
                  />
                  <span className="text-xs text-gray-500">/ {selectedExam?.maxMarks}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsMarksModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Marks
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Exams;
