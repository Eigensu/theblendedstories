import Link from 'next/link';

export default function ArticleNav() {
  return (
    <div className="flex items-center justify-between w-full z-50 sticky top-0" style={{ padding: 'clamp(16px, 3vw, 26px) clamp(20px, 4vw, 56px)', boxSizing: 'border-box', background: 'transparent', borderBottom: '1px solid transparent', transition: 'background 0.3s ease, border-color 0.3s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f5f4f0', fontFamily: "'Playfair Display', serif", fontSize: '20px', letterSpacing: '0.02em' }}>
        <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>The Blended Stories</Link>
      </div>
      <div className="hidden md:flex items-center gap-10">
        <Link href="#" className="hover:text-white transition-colors" style={{ color: '#e7e6e1', fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 600 }}>Fashion</Link>
        <Link href="#" className="hover:text-white transition-colors" style={{ color: '#e7e6e1', fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 600 }}>Interiors</Link>
        <Link href="#" className="hover:text-white transition-colors" style={{ color: '#e7e6e1', fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 600 }}>Culture</Link>
      </div>
    </div>
  );
}
