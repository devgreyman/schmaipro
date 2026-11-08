import React, { useState, useEffect } from 'react';
import { usePortal } from '../../context/PortalContext';
import { 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  Mail, 
  KeyRound, 
  Building2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export default function StudentWelcome() {
  const { studentWelcomeState, clearStudentWelcome } = usePortal();

  if (!studentWelcomeState) return null;

  const {
    regNo,
    schoolEmail,
    schoolName,
    schoolLogo,
    classCode,
    className,
    redirectUrl,
    delaySeconds = 3,
    welcomeMessage = 'Welcome! Your student session has been authenticated successfully.'
  } = studentWelcomeState;

  const [countdown, setCountdown] = useState(delaySeconds);

  // Countdown timer for automatic redirect
  useEffect(() => {
    if (countdown <= 0) {
      handleRedirect();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const handleRedirect = () => {
    if (redirectUrl && redirectUrl.startsWith('http')) {
      window.location.href = redirectUrl;
    } else {
      // Default: redirect back to class login page
      clearStudentWelcome();
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F5F9] flex flex-col justify-center items-center p-4 selection:bg-blue-600 selection:text-white animate-fade-in">
      
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 sm:p-10 w-full max-w-[460px] text-center">
        
        {/* School Logo or Check Icon */}
        {schoolLogo ? (
          <div className="w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 shadow-md p-1.5 mx-auto mb-5 bg-white flex items-center justify-center">
            <img src={schoolLogo} alt={schoolName || 'School Logo'} className="w-full h-full object-contain" />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto mb-5 shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
        )}

        {/* Welcome Heading */}
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Welcome, {regNo}!
        </h1>
        {schoolName && (
          <div className="text-xs font-semibold text-blue-600 mt-1">
            {schoolName}
          </div>
        )}
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          {welcomeMessage}
        </p>

        {/* Verified Student Session Info */}
        <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-2.5 text-xs text-slate-700">
          {schoolName && (
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Institution:</span>
              <span className="font-semibold text-slate-900 truncate max-w-[220px]">{schoolName}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Class:</span>
            <span className="font-semibold text-slate-900">{className} ({classCode})</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">School Email:</span>
            <span className="font-semibold text-slate-900 truncate max-w-[200px] font-mono">{schoolEmail}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Student Reg No:</span>
            <span className="font-mono font-bold text-blue-600">{regNo}</span>
          </div>
        </div>

        {/* Redirect Notice & Countdown */}
        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-center space-y-3">
          <div className="text-xs font-semibold text-blue-900">
            {redirectUrl ? (
              <span>Redirecting to destination in <strong className="text-blue-700 text-sm">{countdown}s</strong>...</span>
            ) : (
              <span>Returning to login page in <strong className="text-blue-700 text-sm">{countdown}s</strong>...</span>
            )}
          </div>

          {/* Progress bar */}
          <div className="w-full bg-blue-200/60 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-full transition-all duration-1000 ease-linear rounded-full"
              style={{ width: `${((delaySeconds - countdown) / delaySeconds) * 100}%` }}
            />
          </div>

          {redirectUrl && (
            <div className="text-[11px] text-blue-700 truncate font-mono bg-white/70 py-1 px-2 rounded-lg border border-blue-200/60">
              Target: {redirectUrl}
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-6 space-y-2">
          <button
            onClick={handleRedirect}
            className="w-full py-3.5 px-4 rounded-xl bg-[#3B66F5] hover:bg-[#2D55E6] active:bg-[#1E44D5] text-white font-semibold text-sm shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Proceed Immediately</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={clearStudentWelcome}
            className="text-xs text-slate-400 hover:text-slate-600 pt-1 font-medium"
          >
            Sign in as different student
          </button>
        </div>

      </div>

      <div className="mt-6 text-xs text-slate-400 text-center">
        <span>EduPortal Educational Platform • Student Session Verified</span>
      </div>

    </div>
  );
}
