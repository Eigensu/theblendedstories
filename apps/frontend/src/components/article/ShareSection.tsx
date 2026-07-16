"use client";

import { useEffect, useMemo, useState } from 'react';

type ShareSectionProps = {
  title?: string;
};

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="hover:border-[#f5f4f0] hover:bg-[rgba(245,244,240,0.06)] transition-all"
      style={{ width: '42px', height: '42px', borderRadius: '50%', border: '1px solid rgba(245,244,240,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f5f4f0', cursor: 'pointer' }}
    >
      {children}
    </button>
  );
}

export default function ShareSection({ title = '' }: ShareSectionProps) {
  const [url, setUrl] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const shareTitle = useMemo(() => title || 'The Blended Stories', [title]);
  const encodedUrl = encodeURIComponent(url || (typeof window !== 'undefined' ? window.location.href : ''));
  const encodedTitle = encodeURIComponent(shareTitle);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleCopy = async () => {
    const currentUrl = url || window.location.href;
    await navigator.clipboard.writeText(currentUrl);
    showToast("Link copied successfully.");
  };

  const handleInstagram = async () => {
    const currentUrl = url || window.location.href;
    await navigator.clipboard.writeText(currentUrl);
    showToast("Article link copied. Open Instagram to share.");
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 relative" style={{ padding: 0 }}>
      {toastMessage && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translate(-50%, -10px)',
          background: '#f5f4f0',
          color: '#0a0a0a',
          padding: '8px 16px',
          borderRadius: '4px',
          fontFamily: "'Public Sans', sans-serif",
          fontSize: '12px',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          zIndex: 100,
          animation: 'fadeIn 0.2s ease'
        }}>
          {toastMessage}
        </div>
      )}
      <span style={{ fontFamily: "'Public Sans', sans-serif", fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#7a7972', marginRight: '4px' }}>
        Share This Story
      </span>
      <div className="flex flex-wrap items-center gap-3">
        <IconButton label="Facebook" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank', 'noopener,noreferrer')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
        </IconButton>
        <IconButton label="Instagram" onClick={handleInstagram}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" /></svg>
        </IconButton>
        <IconButton label="X" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, '_blank', 'noopener,noreferrer')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
        </IconButton>
        <IconButton label="Pinterest" onClick={() => window.open(`https://pinterest.com/pin/create/button/?url=${encodedUrl}`, '_blank', 'noopener,noreferrer')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0a12 12 0 0 0-4.37 23.17c-.09-.85-.17-2.16.04-3.09.19-.84 1.25-5.32 1.25-5.32s-.32-.64-.32-1.59c0-1.49.86-2.6 1.93-2.6.91 0 1.35.69 1.35 1.51 0 .92-.58 2.3-.89 3.58-.25 1.07.54 1.94 1.58 1.94 1.9 0 3.37-2.01 3.37-4.91 0-2.56-1.84-4.36-4.48-4.36-3.06 0-4.85 2.29-4.85 4.65 0 .92.35 1.92.8 2.45.09.11.1.2.07.31-.08.34-.26 1.07-.3 1.22-.05.2-.15.24-.36.15-1.34-.62-2.18-2.57-2.18-4.16 0-3.38 2.46-6.49 7.1-6.49 3.73 0 6.62 2.66 6.62 6.2 0 3.7-2.33 6.68-5.57 6.68-1.09 0-2.11-.56-2.46-1.23l-.67 2.55c-.24.94-.9 2.11-1.34 2.82A12 12 0 1 0 12 0z" /></svg>
        </IconButton>
        <IconButton label="LinkedIn" onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank', 'noopener,noreferrer')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6.94 6.5A2.06 2.06 0 1 1 2.82 6.5a2.06 2.06 0 0 1 4.12 0ZM3.1 8.8h3.68V21H3.1V8.8Zm6.02 0h3.53v1.67h.05c.49-.93 1.69-1.91 3.48-1.91 3.72 0 4.4 2.45 4.4 5.64V21h-3.68v-5.31c0-1.27-.03-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.81V21H9.12V8.8Z" /></svg>
        </IconButton>
        <IconButton label="Copy link" onClick={handleCopy}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
        </IconButton>
      </div>
    </div>
  );
}
