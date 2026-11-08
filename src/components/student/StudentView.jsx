import React from 'react';
import { usePortal } from '../../context/PortalContext';
import StudentLogin from './StudentLogin';
import StudentWelcome from './StudentWelcome';

export default function StudentView() {
  const { studentWelcomeState } = usePortal();

  return (
    <div className="min-h-screen">
      {studentWelcomeState ? (
        <StudentWelcome />
      ) : (
        <StudentLogin />
      )}
    </div>
  );
}
