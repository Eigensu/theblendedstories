'use client';
import { useEffect, useState } from 'react';

export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (scrolled / max) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial call
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ position: 'sticky', top: 0, left: 0, width: '100%', height: '2px', background: 'rgba(245,244,240,0.14)', zIndex: 60 }}>
      <div style={{ width: `${progress}%`, height: '100%', background: '#f5f4f0', transition: 'width 0.05s linear' }}></div>
    </div>
  );
}
