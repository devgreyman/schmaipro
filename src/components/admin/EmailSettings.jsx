import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { 
  Mail, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Send, 
  Clock, 
  Tag, 
  AlertCircle,
  ShieldCheck,
  Bell,
  Compass,
  ExternalLink,
  KeyRound,
  Lock,
  Save,
  Check
} from 'lucide-react';

export default function EmailSettings() {
  const { 
    notificationEmails, 
    addNotificationEmail, 
    removeNotificationEmail, 
    toggleNotificationEmail, 
    deliveryLogs,
    sendTestEmail,
    redirectConfig,
    updateRedirectConfig,
    adminCredentials,
    updateAdminCredentials,
    showToast
  } = usePortal();

  // Redirect Settings state
  const [defaultRedirectUrl, setDefaultRedirectUrl] = useState(redirectConfig.defaultRedirectUrl || '');
  const [redirectDelaySeconds, setRedirectDelaySeconds] = useState(redirectConfig.redirectDelaySeconds || 3);
  const [welcomeMessage, setWelcomeMessage] = useState(redirectConfig.welcomeMessage || 'Welcome! Your student session has been authenticated successfully.');
  const [savedRedirect, setSavedRedirect] = useState(false);

  // Email form state
  const [newEmail, setNewEmail] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [testEmailTarget, setTestEmailTarget] = useState('');

  // Admin Credentials update state
  const [newAdminUser, setNewAdminUser] = useState(adminCredentials.username);
  const [newAdminPass, setNewAdminPass] = useState(adminCredentials.password);
  const [savedAdminCreds, setSavedAdminCreds] = useState(false);

  const handleSaveRedirectConfig = (e) => {
    e.preventDefault();
    updateRedirectConfig({
      defaultRedirectUrl: defaultRedirectUrl.trim(),
      redirectDelaySeconds: Number(redirectDelaySeconds) || 3,
      welcomeMessage: welcomeMessage.trim(),
    });
    setSavedRedirect(true);
    setTimeout(() => setSavedRedirect(false), 2500);
  };

  const handleSaveCreds = (e) => {
    e.preventDefault();
    if (updateAdminCredentials(newAdminUser, newAdminPass)) {
      setSavedAdminCreds(true);
      setTimeout(() => setSavedAdminCreds(false), 2500);
    }
  };

  const handleAddEmail = (e) => {
    e.preventDefault();
    if (addNotificationEmail(newEmail, newLabel, isPrimary)) {
      setNewEmail('');
      setNewLabel('');
      setIsPrimary(false);
    }
  };

  const handleTestDispatch = (e) => {
    e.preventDefault();
    if (!testEmailTarget) return;
    sendTestEmail(testEmailTarget);
    setTestEmailTarget('');
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-200">
      
      {/* SECTION 1: STUDENT LOGIN REDIRECT CONFIGURATION (User Request 2) */}
      <div className="bg-[#111726] border border-[#1E293B] rounded-2xl p-6 sm:p-7 shadow-xl">
        <div className="flex items-center gap-3 pb-4 mb-6 border-b border-[#1E293B]">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">Student Login Redirect Configuration</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Control where students are automatically sent after verifying their School Email and Reg No.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveRedirectConfig} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center justify-between">
                <span>Default Redirect URL</span>
                <span className="text-[11px] text-indigo-400">Where student is redirected</span>
              </label>
              <div className="relative">
                <ExternalLink className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={defaultRedirectUrl}
                  onChange={(e) => setDefaultRedirectUrl(e.target.value)}
                  placeholder="e.g. https://school.edu/dashboard (leave empty to redirect back to login page)"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-[#0B0F19] border border-[#1E293B] focus:border-indigo-500 text-white placeholder:text-slate-600 outline-hidden transition-all font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Leave empty to automatically redirect back to the class login page after the welcome countdown.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Countdown Delay (Seconds)
              </label>
              <input
                type="number"
                min="1"
                max="15"
                value={redirectDelaySeconds}
                onChange={(e) => setRedirectDelaySeconds(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-[#0B0F19] border border-[#1E293B] focus:border-indigo-500 text-white outline-hidden transition-all font-mono"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Time students see the welcome message before redirect.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Welcome Screen Message
            </label>
            <input
              type="text"
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              placeholder="e.g. Welcome! Your student session has been authenticated successfully."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-[#0B0F19] border border-[#1E293B] focus:border-indigo-500 text-white placeholder:text-slate-600 outline-hidden transition-all"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
          >
            {savedRedirect ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Redirect Settings Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Redirect Settings</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* SECTION 2: NOTIFICATION EMAIL INBOXES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Add Notification Email Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#111726] border border-[#1E293B] rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#1E293B]">
              <Plus className="w-4 h-4 text-indigo-400" />
              <h4 className="font-bold text-white text-sm">
                Add Notification Email
              </h4>
            </div>

            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              When a student logs in, an instant notification with their School Email and Reg No is delivered to these inboxes.
            </p>

            <form onSubmit={handleAddEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Recipient Email Address <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="e.g. admin@school.edu"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-[#0B0F19] border border-[#1E293B] focus:border-indigo-500 text-white placeholder:text-slate-600 outline-hidden transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Office / Role Label
                </label>
                <div className="relative">
                  <Tag className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="e.g. Dean of Students or Examination Records"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-[#0B0F19] border border-[#1E293B] focus:border-indigo-500 text-white placeholder:text-slate-600 outline-hidden transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="primaryCheck"
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <label htmlFor="primaryCheck" className="text-xs text-slate-300 font-medium cursor-pointer">
                  Mark as Primary Recipient
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Save Notification Email</span>
              </button>
            </form>
          </div>

          {/* Test Email Dispatch */}
          <div className="bg-[#111726] border border-[#1E293B] rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#1E293B]">
              <Send className="w-4 h-4 text-emerald-400" />
              <h5 className="font-bold text-white text-xs uppercase tracking-wider">
                Send Channel Test Verification
              </h5>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Verify notification routing by dispatching a test event.
            </p>
            <form onSubmit={handleTestDispatch} className="flex gap-2">
              <input
                type="email"
                required
                value={testEmailTarget}
                onChange={(e) => setTestEmailTarget(e.target.value)}
                placeholder="Enter email to test"
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-[#0B0F19] border border-[#1E293B] text-white focus:border-indigo-500 outline-hidden"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Test
              </button>
            </form>
          </div>
        </div>

        {/* Right: Active Inboxes & Audit Logs */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-[#111726] border border-[#1E293B] rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-400" />
                <h4 className="font-bold text-white text-sm">
                  Active Recipient Inboxes ({notificationEmails.length})
                </h4>
              </div>
            </div>

            {notificationEmails.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No notification emails configured yet. Add one on the left.
              </div>
            ) : (
              <div className="space-y-3">
                {notificationEmails.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border transition-all ${
                      item.active
                        ? 'bg-[#0B0F19] border-[#1E293B]'
                        : 'bg-[#0B0F19]/50 border-[#1E293B] opacity-50'
                    } flex items-center justify-between gap-3`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        item.active ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-800 text-slate-500'
                      }`}>
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white truncate">
                            {item.email}
                          </span>
                          {item.isPrimary && (
                            <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                              Primary
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{item.label}</span>
                          <span>•</span>
                          <span className="text-[11px]">
                            Added: {new Date(item.addedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => toggleNotificationEmail(item.id)}
                        className={`text-xs px-2.5 py-1 rounded-lg font-medium border transition-colors ${
                          item.active 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {item.active ? 'Active' : 'Disabled'}
                      </button>

                      <button
                        onClick={() => removeNotificationEmail(item.id)}
                        className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-950/30 transition-colors"
                        title="Remove email"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Email Activity History */}
          <div className="bg-[#111726] border border-[#1E293B] rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <h5 className="font-bold text-white text-xs uppercase tracking-wider">
                  Recent Email Dispatch Activity Log
                </h5>
              </div>
              <span className="text-xs text-slate-500">
                {deliveryLogs.length} events
              </span>
            </div>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {deliveryLogs.length === 0 ? (
                <div className="text-xs text-slate-500 py-4 text-center">
                  No activity logged yet. Student login events will appear here automatically.
                </div>
              ) : (
                deliveryLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-[#0B0F19] border border-[#1E293B] text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200 truncate pr-2">
                        {log.subject}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        <CheckCircle className="w-3 h-3" />
                        {log.status}
                      </span>
                    </div>
                    <div className="text-slate-400 text-[11px] flex flex-wrap gap-x-3">
                      <span>Recipients: <strong className="text-slate-200 font-mono">{log.recipients.join(', ')}</strong></span>
                      <span>•</span>
                      <span>{new Date(log.sentAt).toLocaleTimeString()} ({new Date(log.sentAt).toLocaleDateString()})</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* SECTION 3: ADMIN CREDENTIALS CONFIGURATION (User Request 1) */}
      <div className="bg-[#111726] border border-[#1E293B] rounded-2xl p-6 sm:p-7 shadow-xl">
        <div className="flex items-center gap-3 pb-4 mb-6 border-b border-[#1E293B]">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">Admin Security & Credentials</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Update the username and password required to sign in to this admin management console.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveCreds} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Admin Username
              </label>
              <input
                type="text"
                required
                value={newAdminUser}
                onChange={(e) => setNewAdminUser(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-[#0B0F19] border border-[#1E293B] focus:border-indigo-500 text-white outline-hidden transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Admin Password
              </label>
              <input
                type="text"
                required
                value={newAdminPass}
                onChange={(e) => setNewAdminPass(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-[#0B0F19] border border-[#1E293B] focus:border-indigo-500 text-white outline-hidden transition-all font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1E2238] hover:bg-[#252C48] border border-indigo-500/40 text-indigo-300 font-semibold text-xs shadow-xs transition-all cursor-pointer"
          >
            {savedAdminCreds ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Admin Credentials Updated!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Update Credentials</span>
              </>
            )}
          </button>
        </form>
      </div>

    </div>
  );
}
