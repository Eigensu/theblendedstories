export default function ShareSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px', padding: '0 32px 72px' }}>
      <span style={{ fontFamily: "'Public Sans', sans-serif", fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#7a7972' }}>
        Share This Story
      </span>
      <div style={{ display: 'flex', gap: '14px' }}>
        <span className="hover:border-[#f5f4f0] hover:bg-[rgba(245,244,240,0.06)] transition-all" style={{ width: '42px', height: '42px', borderRadius: '50%', border: '1px solid rgba(245,244,240,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f5f4f0', fontSize: '15px', cursor: 'pointer' }}>✕</span>
        <span className="hover:border-[#f5f4f0] hover:bg-[rgba(245,244,240,0.06)] transition-all" style={{ width: '42px', height: '42px', borderRadius: '50%', border: '1px solid rgba(245,244,240,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f5f4f0', fontSize: '15px', cursor: 'pointer' }}>in</span>
        <span className="hover:border-[#f5f4f0] hover:bg-[rgba(245,244,240,0.06)] transition-all" style={{ width: '42px', height: '42px', borderRadius: '50%', border: '1px solid rgba(245,244,240,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f5f4f0', fontSize: '15px', cursor: 'pointer' }}>⎘</span>
        <span className="hover:border-[#f5f4f0] hover:bg-[rgba(245,244,240,0.06)] transition-all" style={{ width: '42px', height: '42px', borderRadius: '50%', border: '1px solid rgba(245,244,240,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f5f4f0', fontSize: '15px', cursor: 'pointer' }}>♡</span>
      </div>
    </div>
  );
}
