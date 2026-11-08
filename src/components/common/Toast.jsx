import React, { useEffect } from 'react';
import { usePortal } from '../../context/PortalContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toastMessage, closeToast } = usePortal();

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      closeToast();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toastMessage, closeToast]);

  if (!toastMessage) return null;

  const bgStyles = {
    success: 'bg-emerald-900/90 border-emerald-500 text-emerald-100',
    error: 'bg-rose-900/90 border-rose-500 text-rose-100',
    info: 'bg-indigo-900/90 border-indigo-500 text-indigo-100',
  }[toastMessage.type || 'info'];

  const Icon = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  }[toastMessage.type || 'info'];

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce-in">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-md ${bgStyles}`}
      >
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1 text-sm font-medium leading-relaxed">
          {toastMessage.text}
        </div>
        <button
          onClick={closeToast}
          className="text-white/60 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

