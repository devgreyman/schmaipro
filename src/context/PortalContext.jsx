import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_CLASSES, INITIAL_NOTIFICATION_EMAILS, INITIAL_SUBMISSIONS, INITIAL_SCHOOLS } from '../mockData';

const PortalContext = createContext(null);

/**
 * Normalizes, deduplicates, and migrates stored schools:
 * - Purges obsolete cached "LAGOS" records and upgrades to official UNILAG
 * - Guarantees UNIBEN (@uniben.edu) and UNILAG (@unilag.edu.ng) always exist
 * - Preserves any custom user-uploaded logos (base64 Data URIs)
 * - Prevents duplicate domain registrations
 */
const normalizeSchools = (rawSchools) => {
  if (!Array.isArray(rawSchools) || rawSchools.length === 0) {
    return INITIAL_SCHOOLS;
  }

  const domainMap = new Map();

  // 1. Seed with INITIAL_SCHOOLS presets
  INITIAL_SCHOOLS.forEach((s) => {
    domainMap.set(s.domain.toLowerCase(), { ...s });
  });

  // 2. Overlay user data safely
  rawSchools.forEach((saved) => {
    if (!saved || !saved.domain) return;
    const dom = saved.domain.trim().toLowerCase();

    // Check if this is UNILAG
    const isUnilag = 
      dom.includes('unilag') || 
      saved.id === 'sch-unilag' || 
      saved.id === 'sch-11' || 
      saved.acronym === 'LAGOS' || 
      saved.name?.toLowerCase().includes('lagos');

    if (isUnilag) {
      const canonicalKey = '@unilag.edu.ng';
      const defaultUnilag = INITIAL_SCHOOLS.find(s => s.id === 'sch-unilag') || INITIAL_SCHOOLS[0];

      // Detect if user uploaded a custom logo (PNG / JPEG / WebP data URI or non-default SVG)
      const hasCustomUpload = typeof saved.logo === 'string' && (
        saved.logo.startsWith('data:image/png') ||
        saved.logo.startsWith('data:image/jpeg') ||
        saved.logo.startsWith('data:image/webp')
      );

      // Check if stored logo is the old default SVG with LAGOS
      const isOldLagosSvg = typeof saved.logo === 'string' && (
        saved.logo.includes('LAGOS') || saved.acronym === 'LAGOS'
      );

      domainMap.set(canonicalKey, {
        id: 'sch-unilag',
        name: 'University of Lagos (UNILAG)',
        domain: '@unilag.edu.ng',
        acronym: 'UNILAG',
        color: saved.color || '#047857',
        logo: hasCustomUpload ? saved.logo : (isOldLagosSvg ? defaultUnilag.logo : (saved.logo || defaultUnilag.logo)),
        tagline: saved.tagline || 'In Deed and in Truth • Akoka, Lagos',
        country: 'Nigeria',
        isDefault: false,
      });
      return;
    }

    // Check if this is UNIBEN
    const isUniben = 
      dom.includes('uniben') || 
      saved.id === 'sch-uniben' || 
      saved.name?.toLowerCase().includes('benin');

    if (isUniben) {
      const canonicalKey = '@uniben.edu';
      const defaultUniben = INITIAL_SCHOOLS.find(s => s.id === 'sch-uniben') || INITIAL_SCHOOLS[1];

      const hasCustomUpload = typeof saved.logo === 'string' && (
        saved.logo.startsWith('data:image/png') ||
        saved.logo.startsWith('data:image/jpeg') ||
        saved.logo.startsWith('data:image/webp')
      );

      domainMap.set(canonicalKey, {
        id: 'sch-uniben',
        name: 'University of Benin (UNIBEN)',
        domain: '@uniben.edu',
        acronym: 'UNIBEN',
        color: saved.color || '#6B21A8',
        logo: hasCustomUpload ? saved.logo : (saved.logo || defaultUniben?.logo || ''),
        tagline: saved.tagline || 'Knowledge and Excellence • Ugbowo, Benin City',
        country: 'Nigeria',
        isDefault: false,
      });
      return;
    }

    // Standard school merge
    const existing = domainMap.get(dom);
    if (existing) {
      domainMap.set(dom, {
        ...existing,
        ...saved,
        domain: dom,
      });
    } else {
      domainMap.set(dom, {
        ...saved,
        domain: dom,
      });
    }
  });

  return Array.from(domainMap.values());
};

export function PortalProvider({ children }) {
  // 1. Schools & Logos State (User Request: 10-15 schools + admin logo upload)
  const [schools, setSchools] = useState(() => {
    try {
      const saved = localStorage.getItem('portal_schools');
      if (saved) {
        const parsed = JSON.parse(saved);
        return normalizeSchools(parsed);
      }
      return INITIAL_SCHOOLS;
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
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(s => ({
            ...s,
            regNo: s.regNo || s.studentRegNo || s.fullName || '—',
            schoolEmail: s.schoolEmail || s.email || s.studentEmail || '—',
            schoolName: s.schoolName || 'Verified School',
          }));
        }
      }
      return INITIAL_SUBMISSIONS;
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
    try {
      localStorage.setItem('portal_schools', JSON.stringify(schools));
    } catch (e) {
      console.warn('LocalStorage error saving schools:', e);
    }
  }, [schools]);

  useEffect(() => {
    try {
      localStorage.setItem('portal_classes', JSON.stringify(classes));
    } catch (e) {}
  }, [classes]);

  useEffect(() => {
    try {
      localStorage.setItem('portal_notification_emails', JSON.stringify(notificationEmails));
    } catch (e) {}
  }, [notificationEmails]);

  useEffect(() => {
    try {
      localStorage.setItem('portal_submissions', JSON.stringify(submissions));
    } catch (e) {}
  }, [submissions]);

  useEffect(() => {
    try {
      localStorage.setItem('portal_delivery_logs', JSON.stringify(deliveryLogs));
    } catch (e) {}
  }, [deliveryLogs]);

  useEffect(() => {
    try {
      localStorage.setItem('portal_admin_credentials', JSON.stringify(adminCredentials));
    } catch (e) {}
  }, [adminCredentials]);

  useEffect(() => {
    try {
      localStorage.setItem('portal_admin_auth', String(isAdminAuthenticated));
    } catch (e) {}
  }, [isAdminAuthenticated]);

  useEffect(() => {
    try {
      localStorage.setItem('portal_redirect_config', JSON.stringify(redirectConfig));
    } catch (e) {}
  }, [redirectConfig]);

  // URL query parameter support for direct class links (e.g. ?class=BIO-201) & admin access (?admin=true or #admin)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const classParam = params.get('class');
    const adminParam = params.get('admin');

    if (adminParam === 'true' || window.location.hash === '#admin') {
      setCurrentView('admin');
    } else if (classParam) {
      const exists = classes.find(c => c.code.toLowerCase() === classParam.toLowerCase());
      if (exists) {
        setSelectedClassCode(exists.code);
        setCurrentView('student');
      }
    }
  }, [classes]);

  // Keyboard shortcut for administrator: Ctrl+Shift+A or Alt+A to open Admin Console
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) || (e.altKey && (e.key === 'a' || e.key === 'A'))) {
        e.preventDefault();
        setCurrentView(prev => (prev === 'admin' ? 'student' : 'admin'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toast Notification helper
  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type, id: Date.now() });
  };

  const closeToast = () => setToastMessage(null);

  // Dynamic School Detection Helper: looks up matching school by email domain
  const findSchoolByEmail = (email) => {
    if (!email) return null;

    const lower = email.toLowerCase().trim();
    if (!lower.includes('@')) return null;

    const parts = lower.split('@');
    if (parts.length < 2) return null;

    const rawDomain = parts[1].trim(); // e.g. "unilag.edu.ng" or "uniben.edu"
    if (!rawDomain) return null;

    const domainWithAt = '@' + rawDomain;

    // 1. Direct exact match on domain (e.g. "@unilag.edu.ng" or "@uniben.edu")
    let match = schools.find(s => s.domain?.toLowerCase() === domainWithAt);
    if (match) return match;

    // 2. Full email endsWith school domain
    match = schools.find(s => lower.endsWith(s.domain?.toLowerCase()));
    if (match) return match;

    // 3. Institution Keyword Aliases (Handles Nigerian domains & subdomains)
    // UNILAG: student@unilag.edu.ng, @unilag.edu, @unilag
    if (rawDomain.includes('unilag')) {
      match = schools.find(s => 
        s.domain?.toLowerCase().includes('unilag') || 
        s.acronym?.toLowerCase() === 'unilag' ||
        s.name?.toLowerCase().includes('lagos')
      );
      if (match) return match;
    }

    // UNIBEN: student@uniben.edu, student@uniben.edu.ng, @uniben
    if (rawDomain.includes('uniben')) {
      match = schools.find(s => 
        s.domain?.toLowerCase().includes('uniben') || 
        s.acronym?.toLowerCase() === 'uniben' ||
        s.name?.toLowerCase().includes('benin')
      );
      if (match) return match;
    }

    // 4. Keyword / Root Domain Match (e.g. "school1" in "school1.edu", "mit" in "mit.edu")
    const domainRoot = rawDomain.split('.')[0]; // e.g. "unilag", "uniben", "school1"
    if (domainRoot && domainRoot.length >= 3) {
      match = schools.find(s => {
        const sRoot = s.domain?.replace('@', '').split('.')[0]?.toLowerCase();
        return (
          sRoot === domainRoot ||
          s.acronym?.toLowerCase() === domainRoot ||
          s.name?.toLowerCase().includes(domainRoot)
        );
      });
      if (match) return match;
    }

    // 5. Partial typing match (e.g. user typed "@school1" or "@unil")
    match = schools.find(s => s.domain?.toLowerCase().startsWith(domainWithAt));
    if (match) return match;

    // 6. Inverted contains check
    match = schools.find(s => {
      const cleanSchoolDomain = s.domain?.replace('@', '').toLowerCase();
      return cleanSchoolDomain && (rawDomain.includes(cleanSchoolDomain) || cleanSchoolDomain.includes(rawDomain));
    });
    if (match) return match;

    return null;
  };

  // Admin School Management: Add New School with custom logo (or update existing if domain matches)
  const addSchool = (schoolData) => {
    const name = schoolData.name.trim();
    let domain = schoolData.domain.trim().toLowerCase();
    if (!domain.startsWith('@')) {
      domain = '@' + domain;
    }

    // Check if school already exists by domain or acronym
    const existingIndex = schools.findIndex(
      s => s.domain.toLowerCase() === domain || 
           (schoolData.acronym && s.acronym?.toLowerCase() === schoolData.acronym.trim().toLowerCase())
    );

    if (existingIndex !== -1) {
      // Update existing school with the new logo and details
      const existing = schools[existingIndex];
      const updatedSchool = {
        ...existing,
        name: name || existing.name,
        domain: domain,
        acronym: (schoolData.acronym || existing.acronym || name.slice(0, 4)).toUpperCase().trim(),
        color: schoolData.color || existing.color,
        logo: schoolData.logo || existing.logo,
        tagline: schoolData.tagline?.trim() || existing.tagline,
      };

      setSchools(prev => {
        const next = [...prev];
        next[existingIndex] = updatedSchool;
        try { localStorage.setItem('portal_schools', JSON.stringify(next)); } catch (e) {}
        return next;
      });
      showToast(`Updated "${updatedSchool.name}" with new logo & profile!`, 'success');
      return updatedSchool;
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

    setSchools(prev => {
      const next = [newSchool, ...prev];
      try { localStorage.setItem('portal_schools', JSON.stringify(next)); } catch (e) {}
      return next;
    });
    showToast(`Added school "${newSchool.name}" (${newSchool.domain})!`, 'success');
    return newSchool;
  };

  // Admin School Management: Update School & immediately persist
  const updateSchool = (id, updatedData) => {
    setSchools(prev => {
      const next = prev.map(s => {
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
      });
      try {
        localStorage.setItem('portal_schools', JSON.stringify(next));
      } catch (err) {
        console.warn('LocalStorage error saving updated school:', err);
      }
      return next;
    });
    showToast('School profile and logo updated successfully!', 'success');
    return true;
  };

  // Admin School Management: Delete School
  const deleteSchool = (id) => {
    if (schools.length <= 1) {
      showToast('You must have at least one school profile registered.', 'error');
      return false;
    }
    setSchools(prev => {
      const next = prev.filter(s => s.id !== id);
      try { localStorage.setItem('portal_schools', JSON.stringify(next)); } catch (e) {}
      return next;
    });
    showToast('School profile removed.', 'info');
    return true;
  };

  // Admin School Management: Reset to Clean Default Schools & Official Logos
  const resetSchoolsToDefault = () => {
    setSchools(INITIAL_SCHOOLS);
    try {
      localStorage.setItem('portal_schools', JSON.stringify(INITIAL_SCHOOLS));
    } catch (e) {}
    showToast('Reset all schools and logos to official defaults!', 'success');
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
    const cleanEmail = (schoolEmail || '').trim();
    const cleanRegNo = (regNo || '').trim().toUpperCase();

    const targetClass = classes.find(c => c.code === classCode) || classes[0] || {
      code: 'CS-101',
      name: 'Class CS-101',
      redirectUrl: '',
    };

    const matchedSchool = findSchoolByEmail(cleanEmail);

    const newCapId = `CAP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const activeEmails = notificationEmails.filter(e => e.active).map(e => e.email);

    const newRecord = {
      id: newCapId,
      classCode: targetClass.code || 'CS-101',
      className: targetClass.name || 'General Class',
      schoolEmail: cleanEmail,
      email: cleanEmail,
      studentEmail: cleanEmail,
      regNo: cleanRegNo,
      studentRegNo: cleanRegNo,
      fullName: cleanRegNo,
      schoolName: matchedSchool?.name || 'Verified Institution',
      status: 'Captured',
      submittedAt: new Date().toISOString(),
      sentToEmails: activeEmails,
    };

    // Save record to submissions (Captured Data) and synchronously persist to localStorage
    setSubmissions(prev => {
      const next = [newRecord, ...(Array.isArray(prev) ? prev : [])];
      try {
        localStorage.setItem('portal_submissions', JSON.stringify(next));
      } catch (err) {
        console.warn('LocalStorage save error:', err);
      }
      return next;
    });

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

    // Determine redirect destination
    const destinationUrl = targetClass.redirectUrl?.trim() || redirectConfig.defaultRedirectUrl?.trim() || '';

    // Trigger Student Welcome Screen with School Logo & Countdown Redirect
    setStudentWelcomeState({
      active: true,
      regNo: newRecord.regNo,
      schoolEmail: newRecord.schoolEmail,
      schoolName: newRecord.schoolName,
      schoolLogo: newRecord.schoolLogo,
      classCode: targetClass.code,
      className: targetClass.name,
      redirectUrl: destinationUrl,
      delaySeconds: redirectConfig.redirectDelaySeconds || 3,
      welcomeMessage: redirectConfig.welcomeMessage || 'Welcome! Your student session has been authenticated successfully.',
    });
  };

  const clearStudentWelcome = () => {
    setStudentWelcomeState(null);
  };

  // Admin Notification Email Management
  const addNotificationEmail = (email) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      showToast('Please enter a valid email address.', 'error');
      return false;
    }

    if (notificationEmails.some(e => e.email.toLowerCase() === cleanEmail)) {
      showToast('This email is already in the recipient list.', 'error');
      return false;
    }

    const newEntry = {
      id: `ntf-${Date.now()}`,
      email: cleanEmail,
      active: true,
      addedAt: new Date().toISOString(),
    };

    setNotificationEmails(prev => [newEntry, ...prev]);
    showToast(`Added ${cleanEmail} to notification recipients!`, 'success');
    return true;
  };

  const removeNotificationEmail = (id) => {
    setNotificationEmails(prev => prev.filter(e => e.id !== id));
    showToast('Email removed from notification list.', 'info');
  };

  const toggleNotificationEmail = (id) => {
    setNotificationEmails(prev =>
      prev.map(e => (e.id === id ? { ...e, active: !e.active } : e))
    );
  };

  // Admin: Delete Submission record
  const deleteSubmission = (id) => {
    setSubmissions(prev => prev.filter(s => s.id !== id));
    showToast('Record deleted.', 'info');
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
        resetSchoolsToDefault,
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
