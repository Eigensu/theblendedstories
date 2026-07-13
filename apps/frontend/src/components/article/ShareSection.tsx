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
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
    setCanNativeShare(typeof navigator !== 'undefined' && 'share' in navigator);
  }, []);

  const shareTitle = useMemo(() => title || 'The Blended Stories', [title]);
  const encodedUrl = encodeURIComponent(url || (typeof window !== 'undefined' ? window.location.href : ''));
  const encodedTitle = encodeURIComponent(shareTitle);

  const handleCopy = async () => {
    const currentUrl = url || window.location.href;
    await navigator.clipboard.writeText(currentUrl);
  };

  return (
    <div className="flex flex-wrap items-center gap-3" style={{ padding: 0 }}>
      <span style={{ fontFamily: "'Public Sans', sans-serif", fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#7a7972', marginRight: '8px' }}>
        Share This Story
      </span>
      <IconButton label="Share on Facebook" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank', 'noopener,noreferrer')}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      </IconButton>
      <IconButton label="Share on X" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, '_blank', 'noopener,noreferrer')}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </IconButton>
      <IconButton label="Share on LinkedIn" onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank', 'noopener,noreferrer')}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M6.94 6.5A2.06 2.06 0 1 1 2.82 6.5a2.06 2.06 0 0 1 4.12 0ZM3.1 8.8h3.68V21H3.1V8.8Zm6.02 0h3.53v1.67h.05c.49-.93 1.69-1.91 3.48-1.91 3.72 0 4.4 2.45 4.4 5.64V21h-3.68v-5.31c0-1.27-.03-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.81V21H9.12V8.8Z" />
        </svg>
      </IconButton>
      <IconButton label="Copy link" onClick={handleCopy}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      </IconButton>
      {canNativeShare && (
        <IconButton label="Share" onClick={() => navigator.share({ title: shareTitle, url: url || window.location.href })}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 5v14" />
            <path d="m5 12 7-7 7 7" />
          </svg>
        </IconButton>
      )}
    </div>
  );
}
