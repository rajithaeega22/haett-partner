import { useState } from 'react';
import { api } from '../lib/api';
import { useToast } from './Toast';

const TYPES = ['Affiliate', 'Influencer', 'Gym', 'Corporate', 'Partner Associate'];

const inp = {
  width: '100%', padding: '0.75rem 1rem', borderRadius: '8px',
  background: '#111', border: '1px solid #222', color: '#fff',
  fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem',
  outline: 'none', boxSizing: 'border-box',
};

export default function ApplicationForm({ prefill = {}, onSuccess }) {
  const [form, setForm] = useState({
    partner_type: prefill.partner_type || '',
    business_name: prefill.business_name || '',
    contact_phone: prefill.contact_phone || '',
    website: prefill.website || '',
    audience_size: prefill.audience_size || '',
    description: prefill.description || '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const valid = form.partner_type && form.business_name.trim();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { application } = await api.submitApplication(form);
      toast('Application submitted! We\'ll review it shortly.');
      onSuccess(application);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: '4rem 2rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{
          display: 'inline-block', background: '#d4f24420', border: '1px solid #d4f24440',
          borderRadius: '100px', padding: '0.35rem 0.9rem', marginBottom: '1.5rem',
          color: '#d4f244', fontSize: '0.75rem', fontFamily: 'Syne', fontWeight: 600,
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>Partner Application</div>

        <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2rem', color: '#fff', marginBottom: '0.5rem' }}>
          Apply to Join
        </h1>
        <p style={{ color: '#666', fontFamily: 'DM Sans', marginBottom: '2.5rem', lineHeight: 1.6 }}>
          Tell us about yourself and your audience. We review every application within a few business days.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', color: '#aaa', fontSize: '0.8rem', fontFamily: 'Syne', fontWeight: 600, marginBottom: '0.5rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Partner Type <span style={{ color: '#ff5555' }}>*</span>
            </label>
            <select value={form.partner_type} onChange={set('partner_type')} style={{ ...inp, appearance: 'none' }}>
              <option value="">Select a type…</option>
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', color: '#aaa', fontSize: '0.8rem', fontFamily: 'Syne', fontWeight: 600, marginBottom: '0.5rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Business / Brand Name <span style={{ color: '#ff5555' }}>*</span>
            </label>
            <input style={inp} value={form.business_name} onChange={set('business_name')} placeholder="e.g. FitLife by Sarah" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.8rem', fontFamily: 'Syne', fontWeight: 600, marginBottom: '0.5rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Contact Phone</label>
              <input style={inp} value={form.contact_phone} onChange={set('contact_phone')} placeholder="+91 98765 43210" />
            </div>
            <div>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.8rem', fontFamily: 'Syne', fontWeight: 600, marginBottom: '0.5rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Est. Audience Size</label>
              <input style={inp} type="number" value={form.audience_size} onChange={set('audience_size')} placeholder="e.g. 50000" />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', color: '#aaa', fontSize: '0.8rem', fontFamily: 'Syne', fontWeight: 600, marginBottom: '0.5rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Website / Social Link</label>
            <input style={inp} value={form.website} onChange={set('website')} placeholder="https://instagram.com/yourhandle" />
          </div>

          <div>
            <label style={{ display: 'block', color: '#aaa', fontSize: '0.8rem', fontFamily: 'Syne', fontWeight: 600, marginBottom: '0.5rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              About You <span style={{ color: '#444' }}>({form.description.length}/500)</span>
            </label>
            <textarea
              style={{ ...inp, minHeight: '100px', resize: 'vertical' }}
              value={form.description} onChange={set('description')}
              maxLength={500}
              placeholder="Briefly describe what you do and your audience…"
            />
          </div>

          {error && (
            <div style={{
              background: '#2a1010', border: '1px solid #5a1010', borderRadius: '8px',
              padding: '0.75rem 1rem', color: '#ff7070', fontFamily: 'DM Sans', fontSize: '0.875rem',
            }}>{error}</div>
          )}

          <button
            type="submit"
            disabled={!valid || submitting}
            style={{
              padding: '1rem', borderRadius: '10px', border: 'none',
              background: valid && !submitting ? '#d4f244' : '#1e1e1e',
              color: valid && !submitting ? '#0a0a0a' : '#444',
              fontFamily: 'Syne', fontWeight: 700, fontSize: '0.95rem',
              cursor: valid && !submitting ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
            }}
          >
            {submitting ? 'Submitting…' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}
