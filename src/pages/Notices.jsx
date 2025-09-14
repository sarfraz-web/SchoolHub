import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { noticeApi } from '../services/mockApi';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';

const Notices = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'medium',
    targetRoles: ['all']
  });

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = () => {
    setNotices(noticeApi.getAll());
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTargetRolesChange = (e) => {
    const value = e.target.value;
    if (value === 'all') {
      setFormData({
        ...formData,
        targetRoles: ['all']
      });
    } else {
      const currentRoles = formData.targetRoles.includes('all') ? [] : formData.targetRoles;
      if (currentRoles.includes(value)) {
        setFormData({
          ...formData,
          targetRoles: currentRoles.filter(role => role !== value)
        });
      } else {
        setFormData({
          ...formData,
          targetRoles: [...currentRoles, value]
        });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const noticeData = {
      ...formData,
      createdBy: user.id,
      createdByName: user.name
    };
    
    if (editingNotice) {
      noticeApi.update(editingNotice.id, noticeData);
    } else {
      noticeApi.create(noticeData);
    }
    
    loadNotices();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      priority: 'medium',
      targetRoles: ['all']
    });
    setEditingNotice(null);
    setIsModalOpen(false);
  };

  const handleEdit = (notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      priority: notice.priority,
      targetRoles: notice.targetRoles
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      noticeApi.delete(id);
      loadNotices();
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const canCreateEdit = user.role === 'admin' || user.role === 'teacher';
  const canDelete = user.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Notices & Announcements</h1>
            {canCreateEdit && (
              <Button onClick={() => setIsModalOpen(true)}>
                Create New Notice
              </Button>
            )}
          </div>

          <div className="space-y-6">
            {notices.map((notice) => (
              <div key={notice.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{notice.title}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(notice.priority)}`}>
                        {notice.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{notice.content}</p>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <span>By: {notice.createdByName || 'Unknown'}</span>
                      <span>•</span>
                      <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>Target: {notice.targetRoles.join(', ')}</span>
                    </div>
                  </div>
                  
                  {canCreateEdit && (
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(notice)}
                      >
                        Edit
                      </Button>
                      {canDelete && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(notice.id)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {notices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No notices found</p>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Notice Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={resetForm}
        title={editingNotice ? 'Edit Notice' : 'Create New Notice'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter notice title"
            required
          />
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter notice content"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Audience
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value="all"
                  checked={formData.targetRoles.includes('all')}
                  onChange={handleTargetRolesChange}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">All Users</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value="admin"
                  checked={formData.targetRoles.includes('admin')}
                  onChange={handleTargetRolesChange}
                  disabled={formData.targetRoles.includes('all')}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 disabled:opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">Admins</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value="teacher"
                  checked={formData.targetRoles.includes('teacher')}
                  onChange={handleTargetRolesChange}
                  disabled={formData.targetRoles.includes('all')}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 disabled:opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">Teachers</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value="student"
                  checked={formData.targetRoles.includes('student')}
                  onChange={handleTargetRolesChange}
                  disabled={formData.targetRoles.includes('all')}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 disabled:opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">Students</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value="parent"
                  checked={formData.targetRoles.includes('parent')}
                  onChange={handleTargetRolesChange}
                  disabled={formData.targetRoles.includes('all')}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 disabled:opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">Parents</span>
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button type="submit">
              {editingNotice ? 'Update' : 'Create'} Notice
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Notices;
