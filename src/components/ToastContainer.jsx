import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-viewport">
      {toasts.map((t) => (
        <div key={t.id} className={`toast-card toast-${t.type}`}>
          <div className="toast-icon">
            {t.type === 'success' && <CheckCircle2 size={18} className="text-emerald-400" />}
            {t.type === 'info' && <Info size={18} className="text-cyan-400" />}
            {t.type === 'warning' && <AlertTriangle size={18} className="text-amber-400" />}
          </div>
          <div className="toast-body">
            <div className="toast-title">{t.title}</div>
            <div className="toast-message">{t.message}</div>
          </div>
          <button onClick={() => removeToast(t.id)} className="toast-close-btn" title="Dismiss">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
