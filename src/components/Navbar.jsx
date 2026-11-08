import React from 'react';
import { usePortal } from '../context/PortalContext';
import { 
  GraduationCap, 
  ShieldCheck, 
  LogOut,
  UserCheck,
  ExternalLink
} from 'lucide-react';

export default function Navbar() {
  const { 
    currentView, 
    setCurrentView, 
    submissions, 
    classes, 
    studentSession, 
    logoutStudent,
    selectedClassCode 
  } = usePortal();

  const pendingCount = submissions.filter(s => s.status === 'Pending').length;
  const currentClass = classes.find(c => c.code === selectedClassCode);

  // When in admin view, the left sidebar handles the admin navigation, but we provide a subtle top switcher if needed
  if (currentView === 'admin') {
    return null;
  }

  // When in student view, show a clean, light top header
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#3B66F5] flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 tracking-tight text-base">EduPortal</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200/50">
                Student
              </span>
            </div>
            {currentClass && (
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Class: {currentClass.name} ({currentClass.code})
              </p>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {studentSession ? (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <div className="text-xs text-left hidden sm:block">
                <span className="font-semibold text-emerald-950 block truncate max-w-[120px]">
                  {studentSession.fullName || studentSession.regNo}
                </span>
                <span className="text-emerald-700 text-[10px] font-mono block">
                  {studentSession.regNo}
                </span>
              </div>
              <button
                onClick={logoutStudent}
                title="Log out of student session"
                className="text-emerald-700 hover:text-emerald-900 ml-1 p-1 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : null}

          {/* Switch to Admin Mode Button */}
          <button
            onClick={() => setCurrentView('admin')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Admin Console</span>
            {pendingCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
