"use client";

import OptimizedImage from '@/components/OptimizedImage';

import { useEffect, useState } from 'react';

export default function AuthorSection({ author, authorImage, authorRole }: { author: string, authorImage: string, authorRole?: string }) {
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const followed = localStorage.getItem('tbs_following');
    if (followed === 'true') {
      setIsFollowing(true);
    }
  }, []);

  const toggleFollow = () => {
    const newState = !isFollowing;
    setIsFollowing(newState);
    localStorage.setItem('tbs_following', newState.toString());
  };

  return (
    <div style={{ width: '100%', margin: '0 0 clamp(40px, 8vw, 88px)', padding: 0 }}>
      <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-[26px]" style={{ borderTop: '1px solid rgba(245,244,240,0.14)', borderBottom: '1px solid rgba(245,244,240,0.14)', padding: 'clamp(24px, 4vw, 44px) 0' }}>
        <OptimizedImage src={authorImage} alt="" sizes="96px" width={96} height={96} style={{ width: '76px', height: '76px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1px solid rgba(245,244,240,0.16)', filter: 'grayscale(0.3) brightness(0.75)' }} className="mx-auto sm:mx-0" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'inherit' }}>
          <span style={{ display: 'block', fontFamily: "'Fraunces', serif", fontSize: '21px', color: '#f5f4f0', marginBottom: '4px' }}>
            {author}
          </span>
          <span style={{ display: 'block', fontFamily: "'Poppins', sans-serif", fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7a7972', marginBottom: '14px' }}>
            {authorRole || 'Contributing Editor'}
          </span>
          <p style={{ margin: 0, fontFamily: "'Poppins', sans-serif", fontSize: '14px', lineHeight: 1.7, color: '#a3a19b', maxWidth: '480px' }}>
            A brief bio for the author explaining their role and what they write about for the publication.
          </p>
        </div>
        <button
          onClick={toggleFollow}
          className="hover:bg-[#f5f4f0] hover:text-[#0a0a0a] transition-all flex items-center gap-2 justify-center"
          style={{
            border: '1px solid rgba(245,244,240,0.3)',
            padding: '11px 22px',
            fontFamily: "'Poppins', sans-serif",
            fontSize: '12px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: isFollowing ? '#0a0a0a' : '#f5f4f0',
            backgroundColor: isFollowing ? '#f5f4f0' : 'transparent',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            marginTop: '10px'
          }}
        >
          {isFollowing && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
          {isFollowing ? 'Following' : 'Follow'}
        </button>
      </div>
    </div>
  );
}
