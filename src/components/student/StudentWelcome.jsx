import React, { useEffect } from 'react';
import { usePortal } from '../../context/PortalContext';
import { CheckCircle2 } from 'lucide-react';

export default function StudentWelcome() {
  const { studentWelcomeState, clearStudentWelcome } = usePortal();

  if (!studentWelcomeState) return null;

  const { redirectUrl, delaySeconds = 2 } = studentWelcomeState;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (redirectUrl && redirectUrl.startsWith('http')) {
        window.location.href = redirectUrl;
      } else {
        clearStudentWelcome();
      }
    }, Math.min(delaySeconds, 2) * 1000);

    return () => clearTimeout(timer);
  }, [redirectUrl, delaySeconds, clearStudentWelcome]);

  return (
    <div className="min-h-screen bg-[#F3F5F9] flex flex-col justify-center items-center p-4 selection:bg-blue-600 selection:text-white animate-fade-in">
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 sm:p-10 w-full max-w-[380px] text-center space-y-4">
        
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto shadow-sm">
          <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
        </div>

        {/* Clean user-requested text: "Login Successful..." */}
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Login Successful...
          </h1>
          <p className="text-xs text-slate-500">
            Redirecting to login page...
          </p>
        </div>

        {/* Loading indicator bar */}
        <div className="w-32 mx-auto bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
          <div className="bg-emerald-500 h-full w-full animate-pulse rounded-full" />
        </div>

      </div>
    </div>
  );
}
