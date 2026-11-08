import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  Mail, 
  Trash2, 
  Save,
  KeyRound,
  School
} from 'lucide-react';

export default function SubmissionModal({ submission, onClose }) {
  const { deleteSubmission, showToast } = usePortal();

  const [status, setStatus] = useState(submission.status || 'Captured');
  const [adminNotes, setAdminNotes] = useState(submission.adminNotes || '');
  const [isSaved, setIsSaved] = useState(false);

  if (!submission) return null;

  const handleSave = () => {
    setIsSaved(true);
    showToast(`Updated record for ${submission.regNo}`, 'info');
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete record #${submission.id}?`)) {
      deleteSubmission(submission.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-[#111726] rounded-3xl shadow-2xl border border-[#1E293B] max-w-xl w-full my-8 overflow-hidden flex flex-col max-h-[90vh] text-slate-200">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-[#0B0F19] border-b border-[#1E293B] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-[#161F33] px-2.5 py-0.5 rounded-md text-indigo-400 border border-[#243048]">
                {submission.id}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {submission.classCode}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              Captured Student Record
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs sm:text-sm">
          
          {/* Student Profile Card */}
          <div className="p-4 rounded-2xl bg-[#0B0F19] border border-[#1E293B] grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">Student Reg No</span>
              <span className="font-mono font-bold text-indigo-400 text-base">
                {submission.regNo || submission.studentRegNo || submission.fullName || '—'}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">Official School Email</span>
              <span className="font-mono font-medium text-slate-200 truncate block text-sm">
                {submission.schoolEmail || submission.email || submission.studentEmail || '—'}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">Detected School</span>
              <span className="font-medium text-white truncate block">{submission.schoolName || 'General School'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">Target Class</span>
              <span className="font-medium text-slate-300">{submission.className} ({submission.classCode})</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">Capture Timestamp</span>
              <span className="font-medium text-slate-300">{new Date(submission.submittedAt).toLocaleString()}</span>
            </div>
          </div>

          {/* Dispatched Notification Inboxes */}
          <div className="p-3.5 rounded-xl bg-[#0B0F19] border border-[#1E293B]">
            <span className="text-xs font-bold text-indigo-300 block mb-1">
              Admin Notification Delivered To:
            </span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {submission.sentToEmails && submission.sentToEmails.length > 0 ? (
                submission.sentToEmails.map((email, idx) => (
                  <span key={idx} className="text-[11px] font-mono bg-[#161F33] text-slate-200 px-2 py-0.5 rounded border border-[#243048]">
                    {email}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">Central Admin Console</span>
              )}
            </div>
          </div>

          {/* Admin Workflow: Evaluation & Actions */}
          <div className="p-4 rounded-2xl border border-[#1E293B] bg-[#0B0F19] space-y-4">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Verification Status
            </h4>
            
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full text-xs font-medium rounded-xl border border-[#1E293B] p-2.5 bg-[#161F33] text-white outline-hidden"
              >
                <option value="Captured">Captured</option>
                <option value="Verified">Verified</option>
                <option value="Flagged">Flagged</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaved ? 'Saved!' : 'Save Status'}</span>
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Record</span>
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#0B0F19] border-t border-[#1E293B] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#161F33] hover:bg-[#1C2740] border border-[#243048] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
}
