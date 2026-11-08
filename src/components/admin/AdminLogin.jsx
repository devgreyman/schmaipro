import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';

export default function AdminLogin() {
  const { adminLogin, adminCredentials, setCurrentView } = usePortal();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    const success = adminLogin(username, password);
    if (!success) {
      setError('Invalid admin credentials. Please try again.');
    }
  };

  const handleQuickDemo = () => {
    setUsername(adminCredentials.username);
    setPassword(adminCredentials.password);
  };

  return (
    <div className="min-h-screen bg-[#070A11] flex flex-col justify-center items-center p-4 selection:bg-indigo-600 selection:text-white">
      
      {/* Back to Student Portal Link */}
      <div className="mb-6">
        <button
          onClick={() => setCurrentView('student')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Student Portal</span>
        </button>
      </div>

      {/* Main Admin Login Card */}
      <div className="bg-[#111726] border border-[#1E293B] rounded-3xl p-8 sm:p-10 w-full max-w-md shadow-2xl relative overflow-hidden">
        
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Icon Badge */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Admin Console Access
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
            Enter administrative credentials to manage class portals and captured data
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Username */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Admin Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin"
                className="w-full pl-10 pr-4 py-3 bg-[#0B0F19] text-white rounded-xl border border-[#1E293B] focus:border-indigo-500 text-xs sm:text-sm outline-hidden transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 bg-[#0B0F19] text-white rounded-xl border border-[#1E293B] focus:border-indigo-500 text-xs sm:text-sm outline-hidden transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full mt-2 py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Sign In to Admin Panel</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Credentials Info & Quick Fill */}
        <div className="mt-8 pt-5 border-t border-[#1E293B] flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            Default: <span className="text-indigo-300 font-mono">admin</span> / <span className="text-indigo-300 font-mono">password123</span>
          </div>
          <button
            type="button"
            onClick={handleQuickDemo}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20 transition-colors"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Autofill Demo</span>
          </button>
        </div>

      </div>

      <div className="mt-6 text-xs text-slate-500 text-center">
        <span>EduPortal Educational Platform • Protected Administration</span>
      </div>

    </div>
  );
}

