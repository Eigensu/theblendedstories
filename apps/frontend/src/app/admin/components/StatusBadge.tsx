import React from 'react';

type StatusBadgeProps = {
  status?: string;
};

export default function StatusBadge({ status = 'draft' }: StatusBadgeProps) {
  const normalized = status.toLowerCase();
  
  if (normalized === 'published') {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-black text-white border border-white/20 shadow-sm">
        <span className="w-1.5 h-1.5 bg-white rounded-full mr-2"></span>
        Published
      </span>
    );
  }
  
  if (normalized === 'hidden') {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-900 text-zinc-400 border border-zinc-800 shadow-sm">
        <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full mr-2"></span>
        Hidden
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-900 text-zinc-400 border border-zinc-800 shadow-sm">
      <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full mr-2 shadow-[0_0_8px_rgba(255,255,255,0.2)]"></span>
      Draft
    </span>
  );
}
