import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';

interface SearchableDropdownProps {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
}

export default function SearchableDropdown({ options, value, onChange, placeholder = "Select an option", required = false }: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {/* Hidden input for HTML5 required validation */}
      <input 
        type="text" 
        value={value} 
        onChange={() => {}} 
        required={required} 
        className="absolute opacity-0 pointer-events-none w-0 h-0" 
        tabIndex={-1}
      />
      
      <div 
        className="flex items-center justify-between w-full cursor-pointer"
        style={{
          background: 'transparent',
          border: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.15)',
          padding: '12px 0',
          fontFamily: "'Poppins', sans-serif",
          fontSize: '13px',
          color: value ? 'white' : 'rgba(255,255,255,0.3)',
          transition: 'border-color 0.2s',
          outline: 'none',
        }}
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown 
          size={16} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          color="rgba(255,255,255,0.5)" 
        />
      </div>

      {isOpen && (
        <div 
          className="absolute z-50 w-full mt-2 rounded-lg border border-zinc-800 shadow-xl overflow-hidden"
          style={{
            background: '#111',
            maxHeight: '280px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div className="flex items-center px-3 py-2 border-b border-zinc-800 bg-[#1a1a1a]">
            <Search size={14} color="rgba(255,255,255,0.4)" className="mr-2 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              className="w-full bg-transparent border-none outline-none text-white text-xs placeholder:text-zinc-500 font-['Poppins']"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          <div className="overflow-y-auto flex-1 p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, idx) => (
                <div
                  key={idx}
                  className="px-3 py-2.5 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 rounded cursor-pointer transition-colors font-['Poppins']"
                  onClick={() => handleSelect(opt)}
                >
                  {opt}
                </div>
              ))
            ) : (
              <div className="px-3 py-4 text-xs text-zinc-500 text-center font-['Poppins']">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
