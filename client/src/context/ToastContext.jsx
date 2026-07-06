import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(current => [...current, { message, type, id }]);

    setTimeout(() => {
      remove(id);
    }, 3000);
  };

  const remove = (id) => {
    setToasts(current => current.filter(t => t.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-500/10 text-rose-500 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
        );
      case 'info':
      default:
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-sky-500/10 text-sky-500 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.083.984l-.04.02v3.75m-.75-6h.008v.008H11.25v-.008zM12 3a9 9 0 100 18 9 9 0 000-18z" />
            </svg>
          </div>
        );
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/30 hover:border-emerald-500/50';
      case 'error':
        return 'border-rose-500/30 hover:border-rose-500/50';
      case 'info':
      default:
        return 'border-sky-500/30 hover:border-sky-500/50';
    }
  };

  const getProgressColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-emerald-500 to-teal-400';
      case 'error':
        return 'bg-gradient-to-r from-rose-500 to-red-400';
      case 'info':
      default:
        return 'bg-gradient-to-r from-sky-500 to-indigo-400';
    }
  };

  return (
    <ToastContext.Provider value={{ toasts, show, remove }}>
      {children}
      {/* Toast container overlay fixed to top-right viewport */}
      <div className="fixed top-25 right-4 z-50 p-2 space-y-3 w-full max-w-sm overflow-hidden pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto relative flex items-center justify-between p-4 bg-gray-900/90 backdrop-blur-md border ${getBorderColor(t.type)} rounded-xl shadow-2xl transition-all duration-300 animate-toastSlideIn overflow-hidden group`}
          >
            <div className="flex items-center flex-1 pr-4">
              {getIcon(t.type)}
              <span className="text-gray-100 text-sm font-semibold tracking-wide leading-relaxed">{t.message}</span>
            </div>
            <button
              onClick={() => remove(t.id)}
              className="text-gray-400 hover:text-white transition-colors duration-200 bg-transparent border-0 cursor-pointer p-1 font-bold text-xs"
            >
              ✕
            </button>
            {/* Animated countdown progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
              <div className={`h-full animate-toastProgress ${getProgressColor(t.type)}`} />
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
