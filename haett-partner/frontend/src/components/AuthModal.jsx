import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from './Toast';

const s = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, backdropFilter: 'blur(6px)',
  },
  modal: {
    background: '#0d0d0d', border: '1px solid #222',
    borderRadius: '16px', padding: '2.5rem',
    width: '100%', maxWidth: '420px',
    boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
  },
  title: {
    fontFamily: 'Syne, sans-serif', fontSize: '1.5rem',
    fontWeight: 700, color: '#fff', marginBottom: '0.5rem',
  },
  sub: { color: '#666', fontSize: '0.875rem', marginBottom: '2rem', fontFamily: 'DM Sans' },
  tabs: { display: 'flex', gap: '0.5rem', marginBottom: '1.75rem' },
  tab: (active) => ({
    flex: 1, padding: '0.625rem', borderRadius: '8px', border: 'none',
    cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 600,
    fontSize: '0.875rem', transition: 'all 0.2s',
    background: active ? '#d4f244' : '#1a1a1a', color: active ? '#0d0d0d' : '#666',
  }),
  input: {
    width: '100%', padding: '0.75rem 1rem', borderRadius: '8px',
    background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#fff',
    fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem',
    outline: 'none', boxSizing: 'border-box', marginBottom: '1rem',
    transition: 'border-color 0.2s',
  },
  btn: (disabled) => ({
    width: '100%', padding: '0.875rem', borderRadius: '8px', border: 'none',
    background: disabled ? '#333' : '#d4f244', color: disabled ? '#555' : '#0d0d0d',
    fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.9rem',
    cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
    marginTop: '0.5rem',
  }),
  close: {
    position: 'absolute', top: '1.25rem', right: '1.25rem',
    background: 'none', border: 'none', color: '#555', cursor: 'pointer',
    fontSize: '1.25rem', lineHeight: 1,
  },
  error: {
    background: '#2a1010', border: '1px solid #5a1010', borderRadius: '8px',
    padding: '0.75rem 1rem', color: '#ff7070', fontSize: '0.85rem',
    fontFamily: 'DM Sans', marginBottom: '1rem',
  },
};

export default function AuthModal({ onClose }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const toast = useToast();

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
        toast('Welcome back!');
      } else {
        await register(form.email, form.password, form.name);
        toast('Account created! Welcome to Haett.');
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const valid = mode === 'login'
    ? form.email && form.password
    : form.email && form.password && form.name;

  return (
    <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ ...s.modal, position: 'relative' }}>
        <button style={s.close} onClick={onClose}>✕</button>
        <div style={s.title}>Partner Portal</div>
        <div style={s.sub}>
          {mode === 'login' ? 'Sign in to access your dashboard.' : 'Create your account to get started.'}
        </div>
        <div style={s.tabs}>
          <button style={s.tab(mode === 'login')} onClick={() => { setMode('login'); setError(''); }}>Sign In</button>
          <button style={s.tab(mode === 'register')} onClick={() => { setMode('register'); setError(''); }}>Register</button>
        </div>
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <input style={s.input} placeholder="Full name" value={form.name} onChange={set('name')} />
          )}
          <input style={s.input} type="email" placeholder="Email address" value={form.email} onChange={set('email')} />
          <input style={s.input} type="password" placeholder="Password" value={form.password} onChange={set('password')} />
          {error && <div style={s.error}>{error}</div>}
          <button type="submit" style={s.btn(!valid || loading)} disabled={!valid || loading}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
