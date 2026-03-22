import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const StudentForm = ({ student, onBack, onSaved }) => {
  const isEditing = !!student;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    student_name: '',
    admission_number: '',
    father_name: '',
    mother_name: '',
    joined_date: '',
    joined_class: '',
    left_date: '',
    left_class: '',
    date_of_birth: '',
    caste: '',
    sub_caste: '',
    conduct: 'Good',
  });

  useEffect(() => {
    if (isEditing && student) {
      setFormData({
        student_name: student.student_name,
        admission_number: student.admission_number,
        father_name: student.father_name,
        mother_name: student.mother_name,
        joined_date: student.joined_date ? student.joined_date.split('T')[0] : '',
        joined_class: student.joined_class,
        left_date: student.left_date ? student.left_date.split('T')[0] : '',
        left_class: student.left_class || '',
        date_of_birth: student.date_of_birth ? student.date_of_birth.split('T')[0] : '',
        caste: student.caste,
        sub_caste: student.sub_caste,
        conduct: student.conduct || 'Good',
      });
    }
  }, [student, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        await api.put(`/students/${student._id}`, formData);
        toast.success('Student updated successfully');
      } else {
        await api.post('/students', formData);
        toast.success('Student added successfully');
      }
      onSaved();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm ring-1 ring-black ring-opacity-5 fade-in relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-400 to-primary-600"></div>
      <div className="px-6 py-6 border-b border-gray-100 flex items-center justify-between sm:px-10">
        <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
          {isEditing ? 'Edit Student Record' : 'Create New Record'}
        </h3>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> List
        </button>
      </div>

      <div className="px-6 py-8 sm:px-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-y-7 gap-x-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Student Name</label>
              <input type="text" name="student_name" required autoFocus className="block w-full rounded-xl border-gray-300 bg-gray-50 shadow-sm p-3.5 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm" value={formData.student_name} onChange={handleChange} placeholder="e.g. John Doe" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Admission Number</label>
              <input type="text" name="admission_number" required className="block w-full rounded-xl border-gray-300 bg-gray-50 shadow-sm p-3.5 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm" value={formData.admission_number} onChange={handleChange} placeholder="e.g. 104523" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Father's Name</label>
              <input type="text" name="father_name" required className="block w-full rounded-xl border-gray-300 bg-gray-50 shadow-sm p-3.5 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm" value={formData.father_name} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Mother's Name</label>
              <input type="text" name="mother_name" required className="block w-full rounded-xl border-gray-300 bg-gray-50 shadow-sm p-3.5 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm" value={formData.mother_name} onChange={handleChange} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Date of Birth</label>
              <input type="date" name="date_of_birth" required className="block w-full rounded-xl border-gray-300 bg-gray-50 shadow-sm p-3.5 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm" value={formData.date_of_birth} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Caste</label>
                <input type="text" name="caste" required className="block w-full rounded-xl border-gray-300 bg-gray-50 shadow-sm p-3.5 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm" value={formData.caste} onChange={handleChange} placeholder="e.g. General" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Sub Caste</label>
                <input type="text" name="sub_caste" required className="block w-full rounded-xl border-gray-300 bg-gray-50 shadow-sm p-3.5 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm" value={formData.sub_caste} onChange={handleChange} placeholder="..." />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Character and Conduct</label>
              <input type="text" name="conduct" required className="block w-full rounded-xl border-gray-300 bg-gray-50 shadow-sm p-3.5 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm" value={formData.conduct} onChange={handleChange} placeholder="e.g. Good" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Joined Date</label>
              <input type="date" name="joined_date" required className="block w-full rounded-xl border-gray-300 bg-gray-50 shadow-sm p-3.5 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm" value={formData.joined_date} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Joined Class</label>
              <input type="text" name="joined_class" required className="block w-full rounded-xl border-gray-300 bg-gray-50 shadow-sm p-3.5 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm" value={formData.joined_class} onChange={handleChange} placeholder="e.g. 5th Standard" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Left Date</label>
              <input type="date" name="left_date" className="block w-full rounded-xl border-gray-300 bg-gray-50 shadow-sm p-3.5 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm" value={formData.left_date} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Left Class</label>
              <input type="text" name="left_class" className="block w-full rounded-xl border-gray-300 bg-gray-50 shadow-sm p-3.5 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm" value={formData.left_class} onChange={handleChange} placeholder="e.g. 10th Standard" />
            </div>

          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end gap-4 mt-10">
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center px-8 py-3.5 border border-transparent shadow-lg text-sm font-bold rounded-xl text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all transform hover:-translate-y-0.5 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <Save className="w-5 h-5 mr-2" />
              {loading ? 'Saving Record...' : 'Save Student Information'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
