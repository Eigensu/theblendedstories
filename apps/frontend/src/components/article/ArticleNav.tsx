import Link from 'next/link';

export default function ArticleNav() {
  return (
    <header
      className="absolute top-0 left-0 right-0 z-50 w-full"
      style={{
        padding: 'clamp(32px, 4vw, 40px) clamp(20px, 5vw, 64px)',
        boxSizing: 'border-box',
        background: 'transparent',
      }}
    >
      <div className="relative flex items-center justify-between w-full">
        <div className="w-[88px] flex justify-start">
          <Link
            href="/#top-picks"
            className="inline-flex items-center gap-3 text-[#f5f4f0] hover:text-white transition-colors"
            style={{
              fontFamily: "'Public Sans', sans-serif",
              fontSize: '12px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            <span style={{ fontSize: '18px', lineHeight: 1 }}>←</span>
            <span>Back</span>
          </Link>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
          <img
            src="/TBS LOGO-02 white.png"
            alt="The Blended Stories"
            className="no-grayscale"
            style={{ height: '34px', width: 'auto', mixBlendMode: 'screen', display: 'block' }}
          />
        </div>

        <div className="flex flex-1 items-center gap-4 md:gap-8 justify-end overflow-x-auto whitespace-nowrap" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <Link href="/#fashion" className="text-[11px] md:text-[12px] uppercase tracking-[0.18em] font-semibold text-[#f5f4f0] hover:text-white transition-colors" style={{ fontFamily: "'Public Sans', sans-serif", textDecoration: 'none' }}>Fashion</Link>
          <Link href="/#interiors" className="text-[11px] md:text-[12px] uppercase tracking-[0.18em] font-semibold text-[#f5f4f0] hover:text-white transition-colors" style={{ fontFamily: "'Public Sans', sans-serif", textDecoration: 'none' }}>Interiors</Link>
          <Link href="/#culture" className="text-[11px] md:text-[12px] uppercase tracking-[0.18em] font-semibold text-[#f5f4f0] hover:text-white transition-colors" style={{ fontFamily: "'Public Sans', sans-serif", textDecoration: 'none' }}>Culture</Link>
        </div>
      </div>
    </header>
  );
}
