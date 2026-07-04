import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type TextAreaProps = {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
};

export default function TextArea({ label, value, onChange, placeholder, rows = 4, className }: TextAreaProps) {
  return (
    <div className={cn("mb-6", className)}>
      <label className="block text-sm font-semibold text-slate-800 mb-2">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={cn(
          "w-full px-4 py-3 text-sm",
          "bg-white text-slate-900",
          "border border-slate-200 rounded-lg shadow-sm",
          "placeholder:text-slate-400",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
          "transition-all duration-200 ease-in-out resize-y min-h-[100px]"
        )}
      />
    </div>
  );
}
