import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { 
  Send, 
  CheckCircle2, 
  FileText, 
  Mail, 
  KeyRound, 
  User, 
  Phone, 
  Upload, 
  AlertTriangle, 
  RotateCcw, 
  ExternalLink,
  ShieldCheck,
  Building,
  Paperclip
} from 'lucide-react';

export default function StudentForm() {
  const { 
    studentSession, 
    classes, 
    submitStudentForm, 
    logoutStudent, 
    notificationEmails 
  } = usePortal();

  const currentClass = classes.find(c => c.code === studentSession?.classCode) || {
    code: studentSession?.classCode || 'CLASS',
    name: 'Class ' + (studentSession?.classCode || ''),
    formTitle: 'Student Data Submission Form',
    formPrompt: 'Please enter all required information accurately for administrative review.',
    department: 'Academic Department'
  };

  // Form fields
  const [fullName, setFullName] = useState(studentSession?.fullName || '');
  const [phone, setPhone] = useState('');
  const [submissionType, setSubmissionType] = useState('Continuous Assessment');
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [linkOrAttachment, setLinkOrAttachment] = useState('');
  const [urgency, setUrgency] = useState('Normal');
  const [attachedFileName, setAttachedFileName] = useState('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReceipt, setSubmittedReceipt] = useState(null);

  // File upload simulation
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFileName(`${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
      setLinkOrAttachment(`${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !details.trim()) {
      alert('Please fill out the title and details fields.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const result = submitStudentForm({
        classCode: currentClass.code,
        schoolEmail: studentSession.schoolEmail,
        regNo: studentSession.regNo,
        fullName: fullName || studentSession.fullName,
        phone: phone,
        submissionType: submissionType,
        title: title,
        details: details,
        linkOrAttachment: linkOrAttachment || attachedFileName,
        urgency: urgency,
      });

      setIsSubmitting(false);
      setSubmittedReceipt(result);
    }, 500);
  };

  const handleResetForAnother = () => {
    setTitle('');
    setDetails('');
    setLinkOrAttachment('');
    setAttachedFileName('');
    setSubmittedReceipt(null);
  };

  // If already submitted, display receipt
  if (submittedReceipt) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 animate-fade-in">
        <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-8 text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center mb-4 border border-white/30 shadow-inner">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Submission Confirmed!</h2>
            <p className="text-emerald-100 text-sm mt-1">
              Your response has been securely transmitted to the school administration.
            </p>
          </div>

          {/* Receipt Body */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Tracking ID Badge */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                  Submission Tracking Reference
                </span>
                <div className="text-lg font-mono font-bold text-slate-900">
                  {submittedReceipt.id}
                </div>
              </div>
              <div className="text-right mt-2 sm:mt-0">
                <span className="text-xs text-slate-500 block">Submitted At</span>
                <span className="text-xs font-medium text-slate-700">
                  {new Date(submittedReceipt.submittedAt).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Key Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                <span className="text-xs text-slate-500 block">Student Reg No</span>
                <span className="font-semibold text-slate-900 font-mono">{submittedReceipt.regNo}</span>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                <span className="text-xs text-slate-500 block">School Email</span>
                <span className="font-semibold text-slate-900 truncate block">{submittedReceipt.schoolEmail}</span>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                <span className="text-xs text-slate-500 block">Target Class</span>
                <span className="font-semibold text-slate-900">{submittedReceipt.className} ({submittedReceipt.classCode})</span>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                <span className="text-xs text-slate-500 block">Submission Category</span>
                <span className="font-semibold text-slate-900">{submittedReceipt.submissionType}</span>
              </div>
            </div>

            {/* Email Dispatch Notice */}
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                  Admin Email Dispatch Confirmation
                </span>
              </div>
              <p className="text-xs text-indigo-800 leading-relaxed mb-2">
                An instant copy of this form submission was delivered to the designated admin email recipients:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {submittedReceipt.sentToEmails && submittedReceipt.sentToEmails.length > 0 ? (
                  submittedReceipt.sentToEmails.map((email, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 text-[11px] font-mono bg-white text-indigo-800 px-2.5 py-1 rounded-md border border-indigo-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {email}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-indigo-600 italic">Central Admin Queue</span>
                )}
              </div>
            </div>

            {/* Title & Details Preview */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider mb-1">Subject</span>
              <div className="font-bold text-slate-900 mb-2">{submittedReceipt.title}</div>
              <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider mb-1">Details</span>
              <p className="text-xs text-slate-700 whitespace-pre-line bg-slate-50 p-3 rounded-lg border border-slate-100">
                {submittedReceipt.details}
              </p>
              {submittedReceipt.linkOrAttachment && (
                <div className="mt-2 text-xs flex items-center gap-1.5 text-brand-700">
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>Attachment: {submittedReceipt.linkOrAttachment}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={handleResetForAnother}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Submit Another Response</span>
              </button>
              <button
                onClick={logoutStudent}
                className="w-full sm:w-auto py-3 px-5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-sm transition-colors"
              >
                Sign Out
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // Active Data Input Form
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      
      {/* Form Header Info Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-brand-100 text-brand-700">
                {currentClass.code}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {currentClass.department}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              {currentClass.formTitle || 'Student Submission Form'}
            </h1>
          </div>
          <button
            onClick={logoutStudent}
            className="text-xs text-slate-500 hover:text-slate-800 self-start sm:self-auto underline"
          >
            Change Student / Logout
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
          {currentClass.formPrompt || 'Complete the following fields. When submitted, the administrator will receive your entry immediately.'}
        </p>

        {/* Verified Student Session Info Pill */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-2.5 text-xs text-slate-700">
            <Mail className="w-4 h-4 text-brand-600 flex-shrink-0" />
            <div className="truncate">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Verified School Email</span>
              <span className="font-semibold text-slate-900">{studentSession.schoolEmail}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-700">
            <KeyRound className="w-4 h-4 text-brand-600 flex-shrink-0" />
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Student Reg No</span>
              <span className="font-semibold text-slate-900 font-mono">{studentSession.regNo}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Input Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Row 1: Student Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Phone Number / WhatsApp
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Category & Urgency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Submission Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={submissionType}
                onChange={(e) => setSubmissionType(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-colors bg-white cursor-pointer"
              >
                <option value="Continuous Assessment">Continuous Assessment / Assignment</option>
                <option value="Lab Report">Laboratory Report</option>
                <option value="Fieldwork Observations">Fieldwork Observations & Research</option>
                <option value="Term Project">Final Term Project Submission</option>
                <option value="Biodata Form">Student Biodata Update</option>
                <option value="Course Feedback">Course Feedback & Evaluation</option>
                <option value="Academic Inquiry">Academic Inquiry / Request</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Priority / Urgency
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-colors bg-white cursor-pointer"
              >
                <option value="Normal">Normal Priority</option>
                <option value="Important">Important (Review soon)</option>
                <option value="Urgent">Urgent (Needs immediate attention)</option>
              </select>
            </div>
          </div>

          {/* Form Subject / Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Subject / Topic Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chapter 4 Analysis: Thermodynamic Cycles Calculation"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-colors placeholder:text-slate-400"
            />
          </div>

          {/* Form Content / Detailed Remarks */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Detailed Response / Student Data <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={5}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Provide complete submission notes, answers, experiment details, or information requested by your course instructor..."
              className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-colors placeholder:text-slate-400 resize-y"
            />
          </div>

          {/* File Upload / Link Attachment */}
          <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/70">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Attachment or External Repository / Drive URL
            </label>
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs">
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>Choose Local File</span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <span className="text-xs text-slate-400 font-medium">or link:</span>
              <input
                type="text"
                value={linkOrAttachment}
                onChange={(e) => setLinkOrAttachment(e.target.value)}
                placeholder="https://drive.google.com/... or https://github.com/..."
                className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:border-brand-500 focus:ring-1 focus:ring-brand-200"
              />
            </div>
            {attachedFileName && (
              <div className="mt-2 text-xs text-emerald-700 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Selected: {attachedFileName}</span>
              </div>
            )}
          </div>

          {/* Admin Notification Notice */}
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-100 text-slate-600 text-xs">
            <Mail className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
            <div>
              <span>Submissions are routed directly to the administrator's review console and active notification address: </span>
              <span className="font-semibold text-slate-800">
                {notificationEmails.filter(e => e.active).map(e => e.email).join(', ') || 'School Records'}
              </span>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 disabled:opacity-50 text-white font-semibold text-sm shadow-md shadow-brand-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting Form & Dispatching Notifications...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Form to Administration</span>
              </>
            )}
          </button>
        </form>
      </div>

    </div>
  );
}

