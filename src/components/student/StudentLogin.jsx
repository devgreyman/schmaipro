import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { 
  Mail, 
  KeyRound, 
  ArrowRight, 
  Sparkles, 
  AlertCircle,
  GraduationCap,
  BookOpen,
  Check,
  CheckCircle2,
  Building2
} from 'lucide-react';

export default function StudentLogin() {
  const { classes, selectedClassCode, setSelectedClassCode, processStudentLogin, findSchoolByEmail, schools, setCurrentView, isAdminAuthenticated, showToast } = usePortal();

  const currentClass = classes.find(c => c.code === selectedClassCode) || classes[0];

  const [schoolEmail, setSchoolEmail] = useState('');
  const [regNo, setRegNo] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [validationError, setValidationError] = useState('');
  const [adminClicks, setAdminClicks] = useState(0);

  const handleSecretAdminAccess = () => {
    setAdminClicks(prev => {
      const next = prev + 1;
      if (next >= 3) {
        setCurrentView('admin');
        return 0;
      }
      return next;
    });
  };

  // Dynamic School Detection based on user input email
  const detectedSchool = findSchoolByEmail(schoolEmail);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!schoolEmail.trim()) {
      setValidationError('Please enter your School Email.');
      return;
    }

    if (!schoolEmail.includes('@') || !schoolEmail.includes('.')) {
      setValidationError('Please provide a valid school email address.');
      return;
    }

    // Student Reg No validation - Allows ANY random reg number entered by the student
    if (!regNo.trim()) {
      setValidationError('Please enter your Student Registration Number.');
      return;
    }

    processStudentLogin(schoolEmail.trim(), regNo.trim(), currentClass?.code || 'GEN');
  };

  // Quick demo student filler with different school domains
  // STRICT USER RULE: NEVER auto-fill Student Reg No! Reg No is always left blank for students to enter themselves!
  const handleQuickDemo = (domain) => {
    setSchoolEmail(`student${domain}`);
    setRegNo(''); // Strictly keep empty so students enter it themselves
    setValidationError('');
  };

  return (
    <div className="min-h-screen bg-[#F3F5F9] flex flex-col justify-center items-center p-4 selection:bg-blue-600 selection:text-white">
      
      {/* Top Class Switcher & Info Pill */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
        <div className="bg-white px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-xs flex items-center gap-2 text-xs text-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-slate-900">{currentClass?.name || 'Class Portal'}</span>
          <span className="bg-blue-50 text-blue-600 font-mono font-bold px-2 py-0.5 rounded-md text-[11px] border border-blue-200/60">
            {currentClass?.code}
          </span>
        </div>

        {classes.length > 1 && (
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-200/80 shadow-xs text-xs text-slate-600">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedClassCode}
              onChange={(e) => setSelectedClassCode(e.target.value)}
              className="bg-transparent text-slate-800 font-medium focus:outline-hidden cursor-pointer text-xs"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.code}>
                  Switch to {cls.code}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Student Login Card */}
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 sm:p-10 w-full max-w-[440px] transition-all">
        
        {/* Dynamic School Logo Pop-Up Area (User Requirement) */}
        <div className="flex justify-center mb-6">
          {detectedSchool ? (
            <div 
              key={detectedSchool.id + '-' + (detectedSchool.logo ? detectedSchool.logo.slice(0, 30) : '')}
              className="flex flex-col items-center animate-bounce-in"
            >
              <div 
                className="w-20 h-20 rounded-2xl border-2 shadow-xl flex items-center justify-center p-2 overflow-hidden transition-all duration-300 bg-white"
                style={{ borderColor: detectedSchool.color || '#2563EB' }}
              >
                {detectedSchool.logo ? (
                  <img 
                    src={detectedSchool.logo} 
                    alt={detectedSchool.name} 
                    className="w-full h-full object-contain" 
                  />
                ) : (
                  <div 
                    className="w-full h-full rounded-xl flex items-center justify-center font-mono font-bold text-white text-base tracking-wider"
                    style={{ backgroundColor: detectedSchool.color || '#2563EB' }}
                  >
                    {detectedSchool.acronym || 'SCH'}
                  </div>
                )}
              </div>

              {/* School Pop-up Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mt-3 animate-fade-in shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <span className="truncate max-w-[260px]">{detectedSchool.name}</span>
              </div>
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl border border-slate-200/90 bg-[#F8FAFC] flex items-center justify-center text-blue-600 shadow-2xs transition-all">
              <Mail className="w-7 h-7 stroke-[2.2]" />
            </div>
          )}
        </div>

        {/* Header Text */}
        <div className="text-center mb-7">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {detectedSchool ? detectedSchool.name : (currentClass?.formTitle || 'Welcome Back')}
          </h1>
          <p className="text-sm text-slate-500 mt-1.5">
            {detectedSchool ? detectedSchool.tagline : (currentClass?.formPrompt || 'Please sign in to your student account')}
          </p>
        </div>

        {/* Error notification */}
        {validationError && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* School Email */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                required
                value={schoolEmail}
                onChange={(e) => setSchoolEmail(e.target.value)}
                placeholder="student@school1.edu"
                className={`w-full pl-11 pr-4 py-3 bg-white text-slate-900 rounded-xl border text-sm transition-all outline-hidden placeholder:text-slate-400 ${
                  detectedSchool 
                    ? 'border-blue-500 ring-2 ring-blue-100 font-medium' 
                    : 'border-slate-200 focus:border-blue-500 focus:ring-3 focus:ring-blue-100'
                }`}
              />
            </div>
            {detectedSchool ? (
              <span className="text-[11px] text-emerald-600 font-medium ml-1 mt-1 block flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                Detected: {detectedSchool.domain}
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 ml-1 mt-1 block">
                Type your school email (e.g. <span className="font-mono text-blue-600">@unilag.edu.ng</span>, <span className="font-mono text-purple-600">@uniben.edu</span>, etc.)
              </span>
            )}
          </div>

          {/* Student Reg No (NOT AUTO-FILLED - STUDENT ENTERS BY THEMSELVES) */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <KeyRound className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                required
                value={regNo}
                onChange={(e) => setRegNo(e.target.value.toUpperCase())}
                placeholder="Enter your Student Reg No (e.g. REG/2026/042)"
                autoComplete="off"
                className="w-full pl-11 pr-4 py-3 bg-white text-slate-900 font-mono rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 text-sm transition-all placeholder:text-slate-400 placeholder:font-sans uppercase outline-hidden"
              />
            </div>
            <span className="text-[10px] text-slate-400 ml-1 mt-1 block">
              Enter your official student registration number
            </span>
          </div>

          {/* Remember me & Help */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span>Remember me</span>
            </label>
            <span className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
              Forgot details?
            </span>
          </div>

          {/* Sign In Primary Button */}
          <button
            type="submit"
            className="w-full mt-3 py-3.5 px-4 rounded-xl text-white font-semibold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 bg-[#3B66F5] hover:bg-[#2D55E6] active:bg-[#1E44D5] shadow-blue-500/25"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Multi-School Demo Fillers to test logo pop-ups (Reg No strictly left blank) */}
        <div className="mt-7 pt-5 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Test School Logo Pop-Up</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">(Reg No left blank)</span>
          </div>
          
          <div className="grid grid-cols-3 gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => handleQuickDemo('@unilag.edu.ng')}
              className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 text-left transition-colors truncate cursor-pointer"
              title="University of Lagos (UNILAG)"
            >
              <div className="font-bold text-slate-800 truncate">UNILAG</div>
              <div className="text-[10px] text-emerald-600 font-mono truncate">@unilag...</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('@uniben.edu')}
              className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-purple-50 hover:border-purple-300 text-left transition-colors truncate cursor-pointer"
              title="University of Benin (UNIBEN)"
            >
              <div className="font-bold text-slate-800 truncate">UNIBEN</div>
              <div className="text-[10px] text-purple-600 font-mono truncate">@uniben.edu</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('@school1.edu')}
              className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-300 text-left transition-colors truncate cursor-pointer"
              title="School 1 Academy"
            >
              <div className="font-bold text-slate-800 truncate">School 1</div>
              <div className="text-[10px] text-blue-600 font-mono truncate">@school1.edu</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('@school2.edu')}
              className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 text-left transition-colors truncate cursor-pointer"
              title="School 2 Polytech"
            >
              <div className="font-bold text-slate-800 truncate">School 2</div>
              <div className="text-[10px] text-emerald-600 font-mono truncate">@school2.edu</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('@stanford.edu')}
              className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-red-50 hover:border-red-300 text-left transition-colors truncate cursor-pointer"
              title="Stanford University"
            >
              <div className="font-bold text-slate-800 truncate">Stanford</div>
              <div className="text-[10px] text-red-600 font-mono truncate">@stanford.edu</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('@mit.edu')}
              className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-rose-50 hover:border-rose-300 text-left transition-colors truncate cursor-pointer"
              title="MIT Tech"
            >
              <div className="font-bold text-slate-800 truncate">MIT Tech</div>
              <div className="text-[10px] text-rose-600 font-mono truncate">@mit.edu</div>
            </button>
          </div>
        </div>

      </div>

      <div 
        onClick={handleSecretAdminAccess}
        className="mt-6 text-xs text-slate-400 text-center select-none cursor-default"
        title={isAdminAuthenticated ? "Click to return to Admin Console" : ""}
      >
        <span>EduPortal Educational Platform</span>
      </div>

      {/* Discreet Admin Return Button if already signed in as admin */}
      {isAdminAuthenticated && (
        <button
          onClick={() => setCurrentView('admin')}
          className="fixed bottom-4 right-4 bg-slate-900/80 hover:bg-slate-900 text-white text-[11px] font-mono px-3 py-1.5 rounded-xl border border-slate-700 shadow-lg flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <span>Admin Console</span>
        </button>
      )}

    </div>
  );
}
