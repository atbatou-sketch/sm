'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Student } from '@/lib/types';

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Student> | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/students');
      setStudents(response.data);
    } catch (err) {
      setError('Failed to fetch students');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    
    try {
      await axios.delete(`/api/students?id=${id}`);
      setStudents(students.filter(s => s.id !== id));
    } catch (err) {
      setError('Failed to delete student');
      console.error(err);
    }
  };

  const handleEdit = (student: Student) => {
    setEditingId(student.id);
    setEditForm({ ...student });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleSaveEdit = async () => {
    if (!editForm || editingId === null) return;

    try {
      const { id, created_at, updated_at, enrollment_date, ...updateData } = editForm;
      await axios.put(`/api/students?id=${editingId}`, updateData);
      fetchStudents();
      setEditingId(null);
      setEditForm(null);
    } catch (err) {
      setError('Failed to update student');
      console.error(err);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditForm(prev => prev ? { ...prev, [field]: value } : null);
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Students List</h2>
      
      {students.length === 0 ? (
        <p className="text-gray-500">No students found. Add one to get started!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">ID</th>
                <th className="border border-gray-300 p-2">First Name</th>
                <th className="border border-gray-300 p-2">Last Name</th>
                <th className="border border-gray-300 p-2">Email</th>
                <th className="border border-gray-300 p-2">Phone</th>
                <th className="border border-gray-300 p-2">Status</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id} className="hover:bg-gray-100">
                  {editingId === student.id && editForm ? (
                    <>
                      <td className="border border-gray-300 p-2">{student.id}</td>
                      <td className="border border-gray-300 p-2">
                        <input
                          type="text"
                          value={editForm.first_name}
                          onChange={(e) => handleInputChange('first_name', e.target.value)}
                          className="w-full border rounded p-1"
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <input
                          type="text"
                          value={editForm.last_name}
                          onChange={(e) => handleInputChange('last_name', e.target.value)}
                          className="w-full border rounded p-1"
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full border rounded p-1"
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <input
                          type="text"
                          value={editForm.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full border rounded p-1"
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <select
                          value={editForm.status}
                          onChange={(e) => handleInputChange('status', e.target.value)}
                          className="w-full border rounded p-1"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="graduated">Graduated</option>
                        </select>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <button
                          onClick={handleSaveEdit}
                          className="bg-green-500 text-white px-2 py-1 rounded mr-2 hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="border border-gray-300 p-2">{student.id}</td>
                      <td className="border border-gray-300 p-2">{student.first_name}</td>
                      <td className="border border-gray-300 p-2">{student.last_name}</td>
                      <td className="border border-gray-300 p-2">{student.email}</td>
                      <td className="border border-gray-300 p-2">{student.phone || '-'}</td>
                      <td className="border border-gray-300 p-2">
                        <span className={`px-2 py-1 rounded text-white ${
                          student.status === 'active' ? 'bg-green-500' :
                          student.status === 'inactive' ? 'bg-yellow-500' :
                          'bg-blue-500'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <button
                          onClick={() => handleEdit(student)}
                          className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
