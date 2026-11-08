import React from 'react';
import { PortalProvider, usePortal } from './context/PortalContext';
import Navbar from './components/Navbar';
import StudentView from './components/student/StudentView';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLogin from './components/admin/AdminLogin';
import Toast from './components/common/Toast';

function MainApp() {
  const { currentView, isAdminAuthenticated } = usePortal();

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar />

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
    <PortalProvider>
      <MainApp />
    </PortalProvider>
  );
}
