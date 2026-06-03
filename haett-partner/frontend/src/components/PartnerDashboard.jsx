import { useState } from 'react';
import { useToast } from './Toast';

function CodeCard({ code }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(code.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const discountLabel = code.discount_type === 'percentage'
    ? `${code.discount_value}% off`
    : `₹${code.discount_value} off`;

  const expiry = code.expires_at
    ? new Date(code.expires_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'No expiry';

  return (
    <div style={{
      background: '#111', border: `1px solid ${code.is_active ? '#1e2e0e' : '#1e1e1e'}`,
      borderRadius: '12px', padding: '1.25rem 1.5rem',
      display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
      opacity: code.is_active ? 1 : 0.6,
    }}>
      <div style={{ flex: '1 1 auto', minWidth: '140px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
          <code style={{
            fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 700,
            color: code.is_active ? '#d4f244' : '#666', letterSpacing: '0.1em',
          }}>{code.code}</code>
          <button
            onClick={copy}
            style={{
              background: copied ? '#1a2e0a' : '#1a1a1a', border: '1px solid #2a2a2a',
              borderRadius: '6px', padding: '0.25rem 0.6rem', color: copied ? '#d4f244' : '#888',
              fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'DM Sans', fontWeight: 500,
            }}
          >{copied ? '✓ Copied' : 'Copy'}</button>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: '#555', fontFamily: 'DM Sans' }}>
            {discountLabel} · Used {code.use_count}× · Expires {expiry}
          </span>
        </div>
      </div>
      <div style={{
        padding: '0.3rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem',
        fontFamily: 'Syne', fontWeight: 600, letterSpacing: '0.05em',
        background: code.is_active ? '#0e2200' : '#1a1a1a',
        color: code.is_active ? '#88dd44' : '#555',
        border: `1px solid ${code.is_active ? '#1e4400' : '#2a2a2a'}`,
      }}>
        {code.is_active ? 'Active' : 'Inactive'}
      </div>
    </div>
  );
}

export default function PartnerDashboard({ application, codes, user }) {
  const toast = useToast();

  const approvedDate = application.reviewed_at
    ? new Date(application.reviewed_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';

  const totalUses = codes.reduce((s, c) => s + c.use_count, 0);
  const totalDiscount = codes.reduce((s, c) => {
    if (c.discount_type === 'percentage') return s; // can't sum %
    return s + c.discount_value * c.use_count;
  }, 0);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: '3rem 2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-block', background: '#0e2200', border: '1px solid #1e4400',
            borderRadius: '100px', padding: '0.35rem 0.9rem', marginBottom: '1rem',
            color: '#88dd44', fontSize: '0.75rem', fontFamily: 'Syne', fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>✓ Approved Partner</div>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2rem', color: '#fff', marginBottom: '0.25rem' }}>
            Welcome back, {user.name.split(' ')[0]}
          </h1>
          <p style={{ fontFamily: 'DM Sans', color: '#555' }}>
            {application.partner_type} · Approved {approvedDate}
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
          {[
            { label: 'Total Codes', value: codes.length },
            { label: 'Total Uses', value: totalUses },
            { label: 'Fixed Discounts Given', value: totalDiscount > 0 ? `₹${totalDiscount.toLocaleString()}` : '—' },
          ].map(({ label, value }) => (
            <div key={label} style={{
              background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '1.25rem',
            }}>
              <div style={{ fontFamily: 'DM Sans', fontSize: '0.8rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>{label}</div>
              <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.75rem', color: '#fff' }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Codes */}
        <div>
          <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem', color: '#fff', marginBottom: '1rem' }}>
            Your Discount Codes
          </h2>
          {codes.length === 0 ? (
            <div style={{
              background: '#111', border: '1px dashed #222', borderRadius: '12px',
              padding: '3rem', textAlign: 'center',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🏷️</div>
              <p style={{ fontFamily: 'DM Sans', color: '#555' }}>No codes assigned yet. We'll notify you when your first code is ready.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {codes.map(c => <CodeCard key={c.id} code={c} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
