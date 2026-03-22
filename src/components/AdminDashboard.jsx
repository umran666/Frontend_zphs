import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard } from 'lucide-react';
import StudentList from './StudentList';
import StudentForm from './StudentForm';

const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState('list');
  const [editingStudent, setEditingStudent] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  const showForm = (student = null) => {
    setEditingStudent(student);
    setCurrentView('form');
  };

  const showList = () => {
    setEditingStudent(null);
    setCurrentView('list');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col fade-in">
      <nav className="bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] border-b border-gray-100 z-10 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-primary-600 to-primary-500 p-2.5 rounded-xl text-white shadow-md">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-transparent text-sm font-bold rounded-xl text-red-700 bg-red-50 hover:bg-red-100 hover:shadow-sm focus:outline-none transition-all transform hover:-translate-y-0.5"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {currentView === 'list' ? (
            <StudentList 
              onEdit={showForm} 
              onCreateNew={() => showForm(null)} 
            />
          ) : (
            <StudentForm 
              student={editingStudent} 
              onBack={showList} 
              onSaved={showList} 
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
