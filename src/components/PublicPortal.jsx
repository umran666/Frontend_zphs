import React, { useState } from 'react';
import { Search, FileText, Download, Calendar, User, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import api from '../utils/api';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

const PublicPortal = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setSearched(true);
    try {
      const { data } = await api.get(`/students/search?q=${encodeURIComponent(query)}`);
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const handleDownload = async (url, studentName, originalUrl) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      const ext = originalUrl.split('.').pop() || 'pdf';
      link.href = blobUrl;
      link.download = `${studentName.replace(/\s+/g, '_')}_Certificate.${ext}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] sticky top-0 z-10 transition-shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-tr from-primary-600 to-primary-500 text-white p-2 rounded-xl shadow-md">
                <FileText className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">EduCertify</h1>
            </div>
            <a href="/admin/login" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
              Admin Login <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 fade-in">
        {/* Search Hero */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Verify & Download Certificates
          </h2>
          <p className="mt-5 text-xl text-gray-500 max-w-2xl mx-auto">
            Securely access academic records. Enter an Admission Number or Full Name below.
          </p>
          
          <form onSubmit={handleSearch} className="mt-10 max-w-2xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 to-primary-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-200"></div>
            <div className="relative flex shadow-xl rounded-xl overflow-hidden bg-white border border-gray-100 ring-1 ring-black/5">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full rounded-l-xl pl-14 pr-4 py-5 font-medium text-lg text-gray-900 border-0 focus:ring-0 placeholder-gray-400"
                  placeholder="Admission Number or Name..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="-ml-px relative inline-flex items-center space-x-2 px-10 py-5 font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none transition-all disabled:opacity-75 disabled:cursor-not-allowed text-lg"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100 px-8 fade-in">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-50 mb-5">
              <Search className="h-10 w-10 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">No records found</h3>
            <p className="mt-3 text-base text-gray-500 max-w-sm mx-auto">
              We couldn't find any student matching "{query}". Please check the spelling or format.
            </p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="space-y-10 fade-in">
            {results.map((student) => (
              <div key={student._id} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden transform transition-all hover:shadow-2xl hover:-translate-y-1">
                <div className="flex flex-col md:flex-row min-h-[400px]">
                  {/* Info Section */}
                  <div className="p-8 md:p-10 md:w-1/2 flex flex-col justify-between relative bg-white z-10">
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-green-100 text-green-800">
                          Verified Record
                        </span>
                        <span className="text-sm font-medium text-gray-400">ID: {student.admission_number}</span>
                      </div>
                      <h3 className="text-3xl font-black text-gray-900 mb-8">{student.student_name}</h3>
                      
                      <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-sm mb-8">
                        <div>
                          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Father's Name</p>
                          <p className="font-semibold text-gray-900 text-base">{student.father_name}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Mother's Name</p>
                          <p className="font-semibold text-gray-900 text-base">{student.mother_name}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Date of Birth</p>
                          <p className="font-semibold text-gray-900 text-base">{formatDate(student.date_of_birth)}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Caste / Sub-Caste</p>
                          <p className="font-semibold text-gray-900 text-base">{student.caste} <span className="text-gray-400">/</span> {student.sub_caste}</p>
                        </div>
                      </div>

                      <div className="bg-gray-50/80 rounded-2xl p-5 flex justify-between items-center mb-8 border border-gray-100">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Joined</span>
                          <span className="text-base font-semibold text-gray-900">{formatDate(student.joined_date)}</span>
                          <span className="text-xs font-bold text-primary-600 mt-1 whitespace-nowrap">Class {student.joined_class}</span>
                        </div>
                        <div className="h-10 w-px bg-gray-200 mx-4"></div>
                        <div className="flex flex-col text-right">
                          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Left</span>
                          <span className="text-base font-semibold text-gray-900">{student.left_date ? formatDate(student.left_date) : 'Present'}</span>
                          <span className="text-xs font-bold text-primary-600 mt-1 whitespace-nowrap">{student.left_class ? `Class ${student.left_class}` : '-'}</span>
                        </div>
                      </div>
                    </div>
                    
                    {student.certificate_url ? (
                      <button
                        onClick={() => handleDownload(`${API_BASE}${student.certificate_url}`, student.student_name, student.certificate_url)}
                        className="inline-flex items-center justify-center gap-2 w-full px-6 py-4 border border-transparent text-base font-bold rounded-xl text-primary-700 bg-primary-50 hover:bg-primary-100 transition-colors"
                      >
                        <Download className="w-5 h-5" />
                        Download Certificate
                      </button>
                    ) : (
                      <div className="w-full px-6 py-4 rounded-xl bg-gray-50 text-gray-500 text-sm font-medium text-center border border-dashed border-gray-200">
                         Certificate not yet available
                      </div>
                    )}
                  </div>
                  
                  {/* File Preview Section */}
                  <div className="md:w-1/2 bg-gray-100 border-t md:border-t-0 md:border-l border-gray-200 p-8 flex flex-col justify-center items-center relative isolation-auto">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-200 grid place-items-center -z-10 opacity-50">
                       <FileText className="w-32 h-32 text-gray-300" />
                    </div>
                    
                    <div className="w-full h-full min-h-[300px] shadow-2xl rounded-2xl overflow-hidden border border-gray-200/50 bg-white relative group">
                      {student.certificate_url ? (
                        student.certificate_url.toLowerCase().endsWith('.pdf') ? (
                           <iframe 
                           src={`${API_BASE}${student.certificate_url}`} 
                             title="Certificate PDF" 
                             className="absolute inset-0 w-full h-full rounded-2xl"
                           />
                        ) : (
                           <img 
                           src={`${API_BASE}${student.certificate_url}`} 
                             alt="Certificate" 
                             className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                           />
                        )
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                          <FileText className="w-16 h-16 text-gray-200 mb-4" />
                          <p className="text-gray-400 text-sm font-medium">Digital copy not available</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PublicPortal;
