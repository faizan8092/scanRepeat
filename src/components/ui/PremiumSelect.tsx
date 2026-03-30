'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, Check } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ElementType;
}

interface PremiumSelectProps {
  options: SelectOption[] | string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  icon?: React.ElementType;
  className?: string;
  searchable?: boolean;
  variant?: 'default' | 'compact';
}

export function PremiumSelect({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select an option", 
  label, 
  icon: Icon,
  className,
  searchable = true,
  variant = 'default'
}: PremiumSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [menuPosition, setMenuPosition] = useState<'bottom' | 'top'>('bottom');
  const containerRef = useRef<HTMLDivElement>(null);

  const isCompact = variant === 'compact';

  // Normalize options to object array
  const normalizedOptions: SelectOption[] = options.map(opt => 
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  const filteredOptions = normalizedOptions.filter(opt => 
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectedOption = normalizedOptions.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Check positioning when opened
  const toggleOpen = () => {
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const menuHeight = 350; // Max height estimate
      if (spaceBelow < menuHeight) {
        setMenuPosition('top');
      } else {
        setMenuPosition('bottom');
      }
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className={cn("space-y-3 w-full", className)} ref={containerRef}>
      {label && (
        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none px-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={toggleOpen}
          className={cn(
            "w-full bg-secondary/20 border border-border rounded-2xl text-sm font-black transition-all outline-none text-left flex items-center justify-between group overflow-hidden shadow-sm shadow-primary/5",
            isCompact ? "py-2 px-3 pr-8 rounded-xl" : "py-4 pl-5 pr-14",
            isOpen && "bg-white border-primary/30 ring-4 ring-primary/5 shadow-md",
            !isOpen && "hover:border-primary/20 hover:bg-white"
          )}
        >
          <div className="flex items-center gap-3 truncate">
            {Icon && <Icon size={isCompact ? 14 : 16} className={cn("shrink-0 transition-colors", isOpen ? "text-primary" : "text-slate-300")} />}
            <span className={cn("truncate", !selectedOption && "text-slate-400 font-bold italic")}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <ChevronDown 
            size={isCompact ? 14 : 16} 
            className={cn("absolute transition-transform duration-300 text-slate-400", 
              isCompact ? "right-3" : "right-5",
              isOpen && "rotate-180 text-primary")
            } 
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: menuPosition === 'bottom' ? 10 : -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: menuPosition === 'bottom' ? 10 : -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={cn(
                "absolute z-[100] w-full bg-white border border-border shadow-2xl rounded-[1.5rem] overflow-hidden",
                menuPosition === 'bottom' ? "top-full mt-2" : "bottom-full mb-2"
              )}
            >
              {searchable && (
                <div className="p-3 border-b border-border/50">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      autoFocus
                      placeholder="Search..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full bg-secondary/30 border-none py-2.5 pl-9 pr-4 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all text-slate-900"
                    />
                  </div>
                </div>
              )}

              <div className="max-h-[250px] overflow-y-auto custom-scrollbar p-2">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((opt) => {
                    const isSelected = opt.value === value;
                    const OptIcon = opt.icon;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          onChange(opt.value);
                          setIsOpen(false);
                          setSearch('');
                        }}
                        className={cn(
                          "w-full flex items-center justify-between p-3.5 rounded-xl text-sm font-bold transition-all text-left group",
                          isSelected 
                            ? "bg-primary text-white shadow-lg shadow-primary/20" 
                            : "hover:bg-primary/5 text-slate-600 hover:text-primary"
                        )}
                      >
                        <div className="flex items-center gap-3 truncate">
                          {OptIcon && <OptIcon size={16} />}
                          <span className="truncate">{opt.label}</span>
                        </div>
                        {isSelected && <Check size={14} strokeWidth={3} />}
                      </button>
                    );
                  })
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-xs font-bold text-slate-400 italic">No results found</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
