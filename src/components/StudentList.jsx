import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import api from '../utils/api';

const StudentList = ({ onEdit, onCreateNew }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, studentId: null, studentName: '' });

  const fetchStudents = async () => {
    try {
      const { data } = await api.get('/students');
      setStudents(data);
    } catch (error) {
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const confirmDelete = async () => {
    try {
      await api.delete(`/students/${deleteModal.studentId}`);
      toast.success('Student deleted successfully');
      setStudents(students.filter(s => s._id !== deleteModal.studentId));
    } catch (error) {
      toast.error('Failed to delete student');
    } finally {
      setDeleteModal({ show: false, studentId: null, studentName: '' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Students</h2>
          <p className="mt-1 text-sm text-gray-500">Manage all certificate records and student details.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={onCreateNew}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors gap-2"
          >
            <Plus className="w-4 h-4" /> Add Student
          </button>
        </div>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <FileText className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No students</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new student record.</p>
          <div className="mt-6">
            <button
              onClick={onCreateNew}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" /> New Student
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-sm ring-1 ring-black ring-opacity-5 rounded-2xl overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {students.map((student) => (
              <li key={student._id} className="p-4 sm:px-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-base font-bold text-primary-600 truncate">{student.student_name}</p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-green-100 text-green-800 uppercase tracking-wider">
                        {student.admission_number}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex sm:gap-6 text-sm text-gray-500">
                      <p className="flex items-center font-medium">
                        Class: {student.joined_class}
                      </p>
                      <p className="mt-2 sm:mt-0 flex items-center font-medium">
                        Joined: {format(new Date(student.joined_date), 'MMM yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onEdit(student)}
                    className="inline-flex items-center p-2 border border-gray-200 rounded-lg text-gray-500 bg-white hover:bg-gray-50 hover:text-primary-600 focus:outline-none transition-colors shadow-sm"
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteModal({ show: true, studentId: student._id, studentName: student.student_name })}
                    className="inline-flex items-center p-2 border border-gray-200 rounded-lg text-gray-500 bg-white hover:bg-red-50 hover:text-red-600 focus:outline-none transition-colors shadow-sm"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {deleteModal.show && (
        <div className="fixed z-50 inset-0 overflow-y-auto w-screen fade-in">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setDeleteModal({ show: false, studentId: null, studentName: '' })}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-100">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-bold text-gray-900">Delete Student Record</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 leading-relaxed">
                        Are you sure you want to delete <span className="font-bold text-gray-900">{deleteModal.studentName}</span>'s record? All of their data and certificates will be permanently removed. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-100 gap-3">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-6 py-2.5 bg-red-600 text-sm font-medium text-white hover:bg-red-700 focus:outline-none transition-colors sm:w-auto"
                  onClick={confirmDelete}
                >
                  Confirm Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-6 py-2.5 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none transition-colors sm:mt-0 sm:w-auto"
                  onClick={() => setDeleteModal({ show: false, studentId: null, studentName: '' })}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
