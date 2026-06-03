export function PendingView({ application }) {
  const date = new Date(application.applied_at).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: '480px', textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>⏳</div>
        <div style={{
          display: 'inline-block', background: '#2a2200', border: '1px solid #554400',
          borderRadius: '100px', padding: '0.35rem 0.9rem', marginBottom: '1.5rem',
          color: '#ffcc00', fontSize: '0.75rem', fontFamily: 'Syne', fontWeight: 600,
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>Under Review</div>

        <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.75rem', color: '#fff', marginBottom: '1rem' }}>
          Application Received
        </h2>
        <p style={{ fontFamily: 'DM Sans', color: '#666', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          We've received your application for <strong style={{ color: '#aaa' }}>{application.business_name}</strong>.
          Our team will review it and get back to you within a few business days.
        </p>

        <div style={{
          background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px',
          padding: '1.25rem', display: 'inline-block',
        }}>
          <div style={{ fontFamily: 'DM Sans', fontSize: '0.8rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>Applied On</div>
          <div style={{ fontFamily: 'Syne', fontWeight: 600, color: '#fff' }}>{date}</div>
        </div>
      </div>
    </div>
  );
}

export function RejectedView({ application, onReapply }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: '520px', textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>❌</div>
        <div style={{
          display: 'inline-block', background: '#2a1010', border: '1px solid #5a2020',
          borderRadius: '100px', padding: '0.35rem 0.9rem', marginBottom: '1.5rem',
          color: '#ff7070', fontSize: '0.75rem', fontFamily: 'Syne', fontWeight: 600,
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>Application Rejected</div>

        <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.75rem', color: '#fff', marginBottom: '1rem' }}>
          Not Approved This Time
        </h2>
        <p style={{ fontFamily: 'DM Sans', color: '#666', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          Unfortunately your application for <strong style={{ color: '#aaa' }}>{application.business_name}</strong> was not approved.
        </p>

        {application.rejection_reason && (
          <div style={{
            background: '#160e0e', border: '1px solid #3a1a1a', borderRadius: '12px',
            padding: '1.5rem', marginBottom: '2rem', textAlign: 'left',
          }}>
            <div style={{ fontFamily: 'Syne', fontSize: '0.75rem', fontWeight: 600, color: '#884444', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>Reason</div>
            <p style={{ fontFamily: 'DM Sans', color: '#cc8888', lineHeight: 1.7, margin: 0 }}>
              {application.rejection_reason}
            </p>
          </div>
        )}

        <button
          onClick={onReapply}
          style={{
            background: '#d4f244', color: '#0a0a0a', border: 'none',
            borderRadius: '10px', padding: '0.875rem 2rem',
            fontFamily: 'Syne', fontWeight: 700, fontSize: '0.95rem',
            cursor: 'pointer', transition: 'transform 0.15s',
          }}
          onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.target.style.transform = 'none'}
        >
          Reapply Now
        </button>
      </div>
    </div>
  );
}
