export default function LandingView({ onCTA }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Hero */}
      <section style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', textAlign: 'center', padding: '6rem 2rem',
        background: 'radial-gradient(ellipse 80% 50% at 50% 0%, #1a2e0a 0%, #0a0a0a 70%)',
      }}>
        <div style={{
          display: 'inline-block', background: '#d4f24420', border: '1px solid #d4f24440',
          borderRadius: '100px', padding: '0.4rem 1rem', marginBottom: '2rem',
          color: '#d4f244', fontSize: '0.8rem', fontFamily: 'Syne', fontWeight: 600,
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          Partner Programme
        </div>

        <h1 style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 800,
          fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 1.05,
          color: '#fff', marginBottom: '1.5rem', maxWidth: '780px',
        }}>
          Grow together.<br />
          <span style={{ color: '#d4f244' }}>Eat well. Earn more.</span>
        </h1>

        <p style={{
          fontFamily: 'DM Sans, sans-serif', fontSize: '1.15rem', color: '#888',
          maxWidth: '560px', lineHeight: 1.7, marginBottom: '3rem',
        }}>
          Join the Haett Affiliate Programme and share exclusive discount codes with your audience.
          Influencers, gyms, businesses — all welcome.
        </p>

        <button
          onClick={onCTA}
          style={{
            background: '#d4f244', color: '#0a0a0a', border: 'none',
            borderRadius: '10px', padding: '1rem 2.5rem',
            fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem',
            cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s',
            boxShadow: '0 0 40px #d4f24440',
          }}
          onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 40px #d4f24460'; }}
          onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = '0 0 40px #d4f24440'; }}
        >
          Apply to Become a Partner
        </button>
      </section>

      {/* Benefits */}
      <section style={{
        background: '#0d0d0d', padding: '5rem 2rem',
        borderTop: '1px solid #1a1a1a',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'Syne', fontWeight: 700, fontSize: '1.75rem',
            color: '#fff', textAlign: 'center', marginBottom: '3rem',
          }}>What you get as a partner</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: '🎟️', title: 'Unique Discount Codes', desc: 'Personal codes to share with your community — trackable and always yours.' },
              { icon: '📊', title: 'Usage Analytics', desc: 'See exactly how many times your codes have been used and the total savings delivered.' },
              { icon: '🤝', title: 'Direct Partnership', desc: 'Dedicated support and the ability to manage multiple codes as your audience grows.' },
              { icon: '🚀', title: 'Early Access', desc: 'Partners get early access to new Haett products, collections, and meal plans.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{
                background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px',
                padding: '1.75rem',
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{icon}</div>
                <div style={{ fontFamily: 'Syne', fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>{title}</div>
                <div style={{ fontFamily: 'DM Sans', fontSize: '0.9rem', color: '#666', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
