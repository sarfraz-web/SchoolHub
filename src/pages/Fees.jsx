import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { feesApi, studentApi } from '../services/mockApi';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';

const Fees = () => {
  const { user } = useAuth();
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    description: '',
    amount: '',
    dueDate: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setStudents(studentApi.getAll());
    
    if (user.role === 'admin') {
      setFees(feesApi.getAll());
    } else if (user.role === 'student') {
      const student = students.find(s => s.email === user.email);
      if (student) {
        setFees(feesApi.getByStudent(student.id));
      }
    } else if (user.role === 'parent') {
      const parentStudent = students.find(s => s.parentEmail === user.email);
      if (parentStudent) {
        setFees(feesApi.getByStudent(parentStudent.id));
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const student = students.find(s => s.id === formData.studentId);
    const feeData = {
      ...formData,
      studentName: student?.name || 'Unknown Student',
      amount: parseFloat(formData.amount),
      isPaid: false
    };
    
    feesApi.create(feeData);
    loadData();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      studentId: '',
      description: '',
      amount: '',
      dueDate: ''
    });
    setIsModalOpen(false);
  };

  const handleMarkAsPaid = (feeId) => {
    if (window.confirm('Mark this fee as paid?')) {
      feesApi.markAsPaid(feeId);
      loadData();
    }
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown Student';
  };

  const getTotalPending = () => {
    return fees.filter(f => !f.isPaid).reduce((sum, f) => sum + f.amount, 0);
  };

  const getTotalPaid = () => {
    return fees.filter(f => f.isPaid).reduce((sum, f) => sum + f.amount, 0);
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() && !fees.find(f => f.dueDate === dueDate)?.isPaid;
  };

  const canCreateFees = user.role === 'admin';
  const canMarkPaid = user.role === 'admin' || user.role === 'parent' || user.role === 'student';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {user.role === 'admin' ? 'Fees Management' : 'My Fees'}
            </h1>
            {canCreateFees && (
              <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
                Add New Fee
              </Button>
            )}
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <h3 className="text-sm sm:text-lg font-semibold text-gray-900">Total Fees</h3>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                ${(getTotalPending() + getTotalPaid()).toFixed(2)}
              </p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <h3 className="text-sm sm:text-lg font-semibold text-gray-900">Pending</h3>
              <p className="text-2xl sm:text-3xl font-bold text-red-600">
                ${getTotalPending().toFixed(2)}
              </p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <h3 className="text-sm sm:text-lg font-semibold text-gray-900">Paid</h3>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">
                ${getTotalPaid().toFixed(2)}
              </p>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 sm:px-6 py-4 sm:py-5">
              <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900">
                {user.role === 'admin' ? 'All Fees' : 'My Fee Records'}
              </h3>
            </div>
            <ul className="divide-y divide-gray-200">
              {fees.map((fee) => (
                <li key={fee.id} className="px-3 sm:px-4 py-3 sm:py-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                        <h4 className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                          {fee.description}
                        </h4>
                        {fee.isPaid ? (
                          <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 w-fit">
                            Paid
                          </span>
                        ) : isOverdue(fee.dueDate) ? (
                          <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 w-fit">
                            Overdue
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 w-fit">
                            Pending
                          </span>
                        )}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500">
                        {user.role === 'admin' && (
                          <span>Student: {fee.studentName} • </span>
                        )}
                        Amount: ${fee.amount.toFixed(2)} • 
                        Due: {new Date(fee.dueDate).toLocaleDateString()}
                        {fee.isPaid && fee.paidAt && (
                          <span> • Paid: {new Date(fee.paidAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end space-x-2">
                      <span className="text-base sm:text-lg font-semibold text-gray-900">
                        ${fee.amount.toFixed(2)}
                      </span>
                      {!fee.isPaid && canMarkPaid && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleMarkAsPaid(fee.id)}
                          className="text-xs sm:text-sm px-2 sm:px-3"
                        >
                          Mark as Paid
                        </Button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {fees.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-500 text-sm sm:text-base">No fees found</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Fee Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={resetForm}
        title="Add New Fee"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student
            </label>
            <select
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              required
            >
              <option value="">Select a student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} ({student.studentId}) - {student.class}
                </option>
              ))}
            </select>
          </div>
          
          <Input
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="e.g., Monthly Tuition Fee"
            required
          />
          
          <Input
            label="Amount"
            name="amount"
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            required
          />
          
          <Input
            label="Due Date"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />
          
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={resetForm} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              Create Fee
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Fees;
