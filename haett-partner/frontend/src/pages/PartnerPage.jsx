import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../lib/api';
import LandingView from '../components/LandingView';
import ApplicationForm from '../components/ApplicationForm';
import { PendingView, RejectedView } from '../components/StatusViews';
import PartnerDashboard from '../components/PartnerDashboard';
import AdminPanel from '../components/AdminPanel';
import AuthModal from '../components/AuthModal';

export default function PartnerPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [appData, setAppData] = useState(null);
  const [appLoading, setAppLoading] = useState(false);
  const [reapply, setReapply] = useState(false);

  // Load user's application when logged in
  useEffect(() => {
    if (!user || user.role === 'admin') return;
    setAppLoading(true);
    api.getMyApplication()
      .then(res => setAppData(res))
      .catch(() => setAppData(null))
      .finally(() => setAppLoading(false));
  }, [user]);

  if (authLoading || appLoading) {
    return (
      <div style={{
        minHeight: '100vh', background: '#0a0a0a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ fontFamily: 'Syne', color: '#444', fontSize: '1rem' }}>Loading…</div>
      </div>
    );
  }

  function renderView() {
    // 1. Not logged in
    if (!user) return <LandingView onCTA={() => setShowAuth(true)} />;

    // 2. Admin
    if (user.role === 'admin') return <AdminPanel />;

    const { application, codes } = appData || {};

    // 3. No application yet OR reapplying
    if (!application || reapply) {
      return (
        <ApplicationForm
          prefill={reapply ? application : {}}
          onSuccess={(app) => {
            setReapply(false);
            setAppData({ application: app, codes: [] });
          }}
        />
      );
    }

    // 4. Pending
    if (application.status === 'pending') return <PendingView application={application} />;

    // 5. Rejected
    if (application.status === 'rejected') {
      return <RejectedView application={application} onReapply={() => setReapply(true)} />;
    }

    // 6. Approved
    if (application.status === 'approved') {
      return <PartnerDashboard application={application} codes={codes || []} user={user} />;
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      {/* Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1a1a1a',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.875rem 2rem',
      }}>
        <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.25rem', color: '#fff' }}>
          haett<span style={{ color: '#d4f244' }}>.</span>
        </div>
        <div>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontFamily: 'DM Sans', fontSize: '0.875rem', color: '#555' }}>
                {user.name}
              </span>
              <button
                onClick={logout}
                style={{
                  padding: '0.4rem 0.875rem', borderRadius: '6px',
                  background: 'transparent', border: '1px solid #2a2a2a',
                  color: '#666', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '0.85rem',
                }}
              >Sign Out</button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              style={{
                padding: '0.5rem 1.25rem', borderRadius: '8px', border: 'none',
                background: '#d4f244', color: '#0a0a0a',
                fontFamily: 'Syne', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
              }}
            >Sign In</button>
          )}
        </div>
      </nav>

      {renderView()}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
}
