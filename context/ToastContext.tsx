'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => removeToast(id), 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

function ToastContainer() {
  const { toasts, removeToast } = useContext(ToastContext)!;

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const config = {
    success: { bg: 'bg-green-600', icon: 'ri-check-line', label: 'Успешно' },
    error:   { bg: 'bg-red-600',   icon: 'ri-close-line', label: 'Ошибка' },
    info:    { bg: 'bg-blue-600',  icon: 'ri-information-line', label: 'Инфо' },
    warning: { bg: 'bg-yellow-500', icon: 'ri-alert-line', label: 'Внимание' },
  }[toast.type];

  return (
    <div
      className={`${config.bg} text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-72 max-w-sm pointer-events-auto`}
      style={{ animation: 'slideInRight 0.25s ease' }}
    >
      <i className={`${config.icon} text-lg flex-shrink-0`}></i>
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <button onClick={onClose} className="text-white/70 hover:text-white cursor-pointer flex-shrink-0">
        <i className="ri-close-line"></i>
      </button>
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
