import React from 'react';

type StatusBadgeProps = {
  status?: string;
};

export default function StatusBadge({ status = 'draft' }: StatusBadgeProps) {
  const normalized = status.toLowerCase();
  
  if (normalized === 'published') {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200/60 shadow-sm">
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
        Published
      </span>
    );
  }
  
  if (normalized === 'hidden') {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200/60 shadow-sm">
        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
        Hidden
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60 shadow-sm">
      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2 shadow-[0_0_8px_rgba(245,158,11,0.6)]"></span>
      Draft
    </span>
  );
}
