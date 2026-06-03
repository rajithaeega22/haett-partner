import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useToast } from './Toast';

const TABS = ['pending', 'approved', 'rejected', 'all'];

function RejectInline({ appId, onDone }) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  async function submit() {
    setLoading(true);
    try {
      await api.rejectApplication(appId, reason);
      toast('Application rejected.');
      onDone();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginTop: '1rem', background: '#160e0e', border: '1px solid #3a1a1a', borderRadius: '10px', padding: '1rem' }}>
      <textarea
        style={{
          width: '100%', padding: '0.65rem 0.875rem', background: '#1a1010', border: '1px solid #3a1a1a',
          borderRadius: '6px', color: '#fff', fontFamily: 'DM Sans', fontSize: '0.875rem',
          resize: 'vertical', minHeight: '70px', outline: 'none', boxSizing: 'border-box',
        }}
        placeholder="Reason for rejection (required)…"
        value={reason}
        onChange={e => setReason(e.target.value)}
      />
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
        <button
          onClick={submit}
          disabled={!reason.trim() || loading}
          style={{
            padding: '0.5rem 1.25rem', borderRadius: '6px', border: 'none',
            background: reason.trim() && !loading ? '#cc3333' : '#2a1010',
            color: reason.trim() && !loading ? '#fff' : '#553333',
            fontFamily: 'Syne', fontWeight: 600, fontSize: '0.85rem',
            cursor: reason.trim() && !loading ? 'pointer' : 'not-allowed',
          }}
        >
          {loading ? 'Rejecting…' : 'Confirm Reject'}
        </button>
        <button
          onClick={onDone}
          style={{
            padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #2a2a2a',
            background: 'transparent', color: '#666',
            fontFamily: 'DM Sans', fontSize: '0.85rem', cursor: 'pointer',
          }}
        >Cancel</button>
      </div>
    </div>
  );
}

function AppCard({ app, onRefresh }) {
  const [showReject, setShowReject] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  async function approve() {
    setLoading(true);
    try {
      await api.approveApplication(app.id);
      toast('Application approved! Discount code created.');
      onRefresh();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  async function toggleCode(codeId) {
    try {
      await api.toggleCode(codeId);
      toast('Code status updated.');
      onRefresh();
    } catch (err) {
      toast(err.message, 'error');
    }
  }

  const statusColor = { pending: '#ffcc00', approved: '#88dd44', rejected: '#ff7070' }[app.status];

  return (
    <div style={{
      background: '#111', border: '1px solid #1e1e1e', borderRadius: '14px',
      padding: '1.5rem', marginBottom: '1rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem', color: '#fff', marginBottom: '0.2rem' }}>
            {app.applicant_name}
          </div>
          <div style={{ fontFamily: 'DM Sans', fontSize: '0.85rem', color: '#666' }}>{app.applicant_email}</div>
        </div>
        <div style={{
          padding: '0.3rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem',
          fontFamily: 'Syne', fontWeight: 600, color: statusColor,
          background: `${statusColor}18`, border: `1px solid ${statusColor}40`,
        }}>
          {app.status}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
        {[
          ['Partner Type', app.partner_type],
          ['Business Name', app.business_name],
          ['Audience Size', app.audience_size ? app.audience_size.toLocaleString() : '—'],
          ['Website', app.website || '—'],
        ].map(([k, v]) => (
          <div key={k}>
            <div style={{ fontFamily: 'DM Sans', fontSize: '0.7rem', color: '#444', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>{k}</div>
            <div style={{ fontFamily: 'DM Sans', fontSize: '0.875rem', color: '#bbb', wordBreak: 'break-word' }}>
              {k === 'Website' && v !== '—'
                ? <a href={v} target="_blank" rel="noreferrer" style={{ color: '#d4f244' }}>{v}</a>
                : v}
            </div>
          </div>
        ))}
      </div>

      {app.description && (
        <div style={{ background: '#0d0d0d', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem' }}>
          <p style={{ fontFamily: 'DM Sans', fontSize: '0.875rem', color: '#666', margin: 0, lineHeight: 1.6 }}>{app.description}</p>
        </div>
      )}

      {app.status === 'rejected' && app.rejection_reason && (
        <div style={{ background: '#160e0e', border: '1px solid #3a1a1a', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem' }}>
          <div style={{ fontFamily: 'Syne', fontSize: '0.7rem', color: '#884444', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>Rejection Reason</div>
          <p style={{ fontFamily: 'DM Sans', fontSize: '0.875rem', color: '#cc8888', margin: 0 }}>{app.rejection_reason}</p>
        </div>
      )}

      {app.status === 'approved' && app.codes?.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontFamily: 'Syne', fontSize: '0.75rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>Discount Codes</div>
          {app.codes.map(code => (
            <div key={code.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.6rem 0.875rem', background: '#0d0d0d', borderRadius: '8px', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <code style={{ fontFamily: 'monospace', fontWeight: 700, color: code.is_active ? '#d4f244' : '#555', flex: 1 }}>{code.code}</code>
              <span style={{ fontFamily: 'DM Sans', fontSize: '0.8rem', color: '#555' }}>Used {code.use_count}×</span>
              <button
                onClick={() => toggleCode(code.id)}
                style={{
                  padding: '0.3rem 0.75rem', borderRadius: '6px', border: '1px solid #2a2a2a',
                  background: code.is_active ? '#1a2e0a' : '#1a1a1a',
                  color: code.is_active ? '#88dd44' : '#666',
                  fontFamily: 'Syne', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer',
                }}
              >
                {code.is_active ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          ))}
        </div>
      )}

      {app.status === 'pending' && (
        <div>
          {!showReject ? (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={approve}
                disabled={loading}
                style={{
                  padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none',
                  background: '#0e2200', color: '#88dd44',
                  fontFamily: 'Syne', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
                  border: '1px solid #1e4400',
                }}
              >
                {loading ? '…' : '✓ Approve'}
              </button>
              <button
                onClick={() => setShowReject(true)}
                style={{
                  padding: '0.6rem 1.25rem', borderRadius: '8px',
                  background: '#1a0a0a', color: '#cc6666',
                  fontFamily: 'Syne', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
                  border: '1px solid #3a1a1a',
                }}
              >
                ✕ Reject
              </button>
            </div>
          ) : (
            <RejectInline appId={app.id} onDone={() => { setShowReject(false); onRefresh(); }} />
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminPanel() {
  const [tab, setTab] = useState('pending');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await api.getApplications(tab);
      setData(res);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [tab]);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: '3rem 2rem' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-block', background: '#1a1400', border: '1px solid #3a3000',
            borderRadius: '100px', padding: '0.35rem 0.9rem', marginBottom: '1rem',
            color: '#ffcc00', fontSize: '0.75rem', fontFamily: 'Syne', fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>Admin</div>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2rem', color: '#fff' }}>Review Panel</h1>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
                fontFamily: 'Syne', fontWeight: 600, fontSize: '0.85rem',
                background: tab === t ? '#d4f244' : '#1a1a1a',
                color: tab === t ? '#0a0a0a' : '#666',
                transition: 'all 0.15s',
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {data?.counts && (
                <span style={{ marginLeft: '0.4rem', opacity: 0.7 }}>({data.counts[t] ?? 0})</span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', fontFamily: 'DM Sans', color: '#555' }}>Loading…</div>
        ) : data?.applications?.length === 0 ? (
          <div style={{
            background: '#111', border: '1px dashed #222', borderRadius: '14px',
            padding: '4rem', textAlign: 'center',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📭</div>
            <p style={{ fontFamily: 'DM Sans', color: '#555' }}>No {tab === 'all' ? '' : tab} applications yet.</p>
          </div>
        ) : (
          data?.applications.map(app => <AppCard key={app.id} app={app} onRefresh={load} />)
        )}
      </div>
    </div>
  );
}
