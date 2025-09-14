import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentApi } from '../services/mockApi';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';

const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    class: '',
    phone: '',
    address: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    dateOfBirth: '',
    admissionDate: ''
  });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
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
    
    if (editingStudent) {
      studentApi.update(editingStudent.id, formData);
    } else {
      studentApi.create(formData);
    }
    
    loadStudents();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      studentId: '',
      class: '',
      phone: '',
      address: '',
      parentName: '',
      parentEmail: '',
      parentPhone: '',
      dateOfBirth: '',
      admissionDate: ''
    });
    setEditingStudent(null);
    setIsModalOpen(false);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData(student);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      studentApi.delete(id);
      loadStudents();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Students</h1>
            <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
              Add New Student
            </Button>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {students.map((student) => (
                <li key={student.id}>
                  <div className="px-3 sm:px-4 py-3 sm:py-4">
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
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <Link
                              to={`/students/${student.id}`}
                              className="text-sm sm:text-base font-medium text-blue-600 hover:text-blue-500 truncate"
                            >
                              {student.name}
                            </Link>
                            <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 w-fit">
                              {student.studentId}
                            </span>
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500 mt-1">
                            <div className="truncate">{student.email}</div>
                            <div className="sm:hidden">{student.class}</div>
                          </div>
                          <div className="hidden sm:block text-sm text-gray-500">
                            {student.email} • {student.class}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 sm:ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(student)}
                          className="flex-1 sm:flex-none text-xs sm:text-sm"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(student.id)}
                          className="flex-1 sm:flex-none text-xs sm:text-sm"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {students.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-500 text-sm sm:text-base">No students found</p>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={resetForm}
        title={editingStudent ? 'Edit Student' : 'Add New Student'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              label="Student ID"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              required
            />
            <Input
              label="Class"
              name="class"
              value={formData.class}
              onChange={handleChange}
              required
            />
            <Input
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <Input
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
            <Input
              label="Admission Date"
              name="admissionDate"
              type="date"
              value={formData.admissionDate}
              onChange={handleChange}
            />
            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
            <Input
              label="Parent Name"
              name="parentName"
              value={formData.parentName}
              onChange={handleChange}
            />
            <Input
              label="Parent Email"
              name="parentEmail"
              type="email"
              value={formData.parentEmail}
              onChange={handleChange}
            />
            <Input
              label="Parent Phone"
              name="parentPhone"
              value={formData.parentPhone}
              onChange={handleChange}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={resetForm} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              {editingStudent ? 'Update' : 'Create'} Student
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentsList;
