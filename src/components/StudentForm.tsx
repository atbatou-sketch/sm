'use client';

import { useState } from 'react';
import axios from 'axios';
import { CreateStudentInput } from '@/lib/types';

interface StudentFormProps {
  onSuccess: () => void;
}

export default function StudentForm({ onSuccess }: StudentFormProps) {
  const [form, setForm] = useState<CreateStudentInput>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // Validate
      if (!form.first_name || !form.last_name || !form.email) {
        setError('First name, last name, and email are required');
        return;
      }

      await axios.post('/api/students', form);
      
      setSuccess(true);
      setForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
      });

      setTimeout(() => {
        setSuccess(false);
        onSuccess();
      }, 2000);

    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create student');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-bold mb-4">Add New Student</h2>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">Student added successfully!</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={form.first_name}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2"
            required
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={form.last_name}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone (Optional)"
            value={form.phone}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2"
          />
          <input
            type="date"
            name="date_of_birth"
            placeholder="Date of Birth (Optional)"
            value={form.date_of_birth}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Adding...' : 'Add Student'}
        </button>
      </form>
    </div>
  );
}
