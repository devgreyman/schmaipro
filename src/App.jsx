import React, { Component } from 'react';
import { PortalProvider, usePortal } from './context/PortalContext';
import StudentView from './components/student/StudentView';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLogin from './components/admin/AdminLogin';
import Toast from './components/common/Toast';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#111726] border border-rose-500/30 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              ⚠️
            </div>
            <h2 className="text-xl font-bold text-white">Something went wrong</h2>
            <p className="text-xs text-slate-400 font-mono bg-[#0B0F19] p-3 rounded-xl border border-[#1E293B] text-left overflow-auto max-h-32">
              {this.state.error?.message || 'Unknown error occurred'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors cursor-pointer"
            >
              Reload Portal
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainApp() {
  const { currentView, isAdminAuthenticated } = usePortal();

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === 'student' ? (
          <StudentView />
        ) : !isAdminAuthenticated ? (
          <AdminLogin />
        ) : (
          <AdminDashboard />
        )}
      </main>

      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <PortalProvider>
        <MainApp />
      </PortalProvider>
    </ErrorBoundary>
  );
}
