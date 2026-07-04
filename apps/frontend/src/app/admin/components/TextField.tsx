import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
};

export default function TextField({ label, value, onChange, placeholder, type = "text", className }: TextFieldProps) {
  return (
    <div className={cn("mb-6", className)}>
      <label className="block text-sm font-semibold text-slate-800 mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full px-4 py-2.5 text-sm",
          "bg-white text-slate-900",
          "border border-slate-200 rounded-lg shadow-sm",
          "placeholder:text-slate-400",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
          "transition-all duration-200 ease-in-out"
        )}
      />
    </div>
  );
}
