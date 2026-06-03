import { useState, useEffect, createContext, useContext, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div style={{
        position: 'fixed', bottom: '2rem', right: '2rem',
        display: 'flex', flexDirection: 'column', gap: '0.75rem',
        zIndex: 9999, pointerEvents: 'none'
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            padding: '0.875rem 1.25rem',
            background: t.type === 'error' ? '#ff4444' : t.type === 'info' ? '#0077ff' : '#00c896',
            color: '#fff',
            borderRadius: '10px',
            fontSize: '0.875rem',
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 500,
            boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
            animation: 'slideIn 0.3s ease',
            pointerEvents: 'auto',
            maxWidth: '360px',
          }}>
            {t.message}
          </div>
        ))}
      </div>
      <style>{`@keyframes slideIn { from { transform: translateX(120%); opacity: 0; } to { transform: none; opacity: 1; } }`}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
