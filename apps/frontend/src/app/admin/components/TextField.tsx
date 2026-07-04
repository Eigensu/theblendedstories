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
      <label className="block text-sm font-semibold text-white mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full px-4 py-2.5 text-sm",
          "bg-black text-white",
          "border border-zinc-800 rounded-lg shadow-sm",
          "placeholder:text-zinc-600",
          "focus:outline-none focus:ring-1 focus:ring-white focus:border-white",
          "transition-all duration-200 ease-in-out"
        )}
      />
    </div>
  );
}
