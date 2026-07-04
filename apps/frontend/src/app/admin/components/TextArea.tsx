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
      <label className="block text-sm font-semibold text-white mb-2">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={cn(
          "w-full px-4 py-3 text-sm",
          "bg-black text-white",
          "border border-zinc-800 rounded-lg shadow-sm resize-y",
          "placeholder:text-zinc-600",
          "focus:outline-none focus:ring-1 focus:ring-white focus:border-white",
          "transition-all duration-200 ease-in-out resize-y min-h-[100px]"
        )}
      />
    </div>
  );
}
