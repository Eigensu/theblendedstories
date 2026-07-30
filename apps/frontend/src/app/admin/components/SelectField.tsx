import React from 'react';
import { cn } from './TextField';

export type SelectOption = {
  value: string;
  label: string;
};

type SelectFieldProps = {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: SelectOption[];
  /** Shown as the empty choice — selecting it clears the field. */
  placeholder?: string;
  disabled?: boolean;
  hint?: string;
  className?: string;
};

export default function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = '— None —',
  disabled = false,
  hint,
  className,
}: SelectFieldProps) {
  return (
    <div className={cn('mb-6', className)}>
      <label className="block text-sm font-semibold text-white mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          'w-full px-4 py-2.5 text-sm',
          'bg-black text-white',
          'border border-zinc-800 rounded-lg shadow-sm',
          'focus:outline-none focus:ring-1 focus:ring-white focus:border-white',
          'transition-all duration-200 ease-in-out',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint && <p className="mt-2 text-xs text-zinc-500">{hint}</p>}
    </div>
  );
}
