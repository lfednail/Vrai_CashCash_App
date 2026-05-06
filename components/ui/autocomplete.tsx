"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";

interface Option {
  id: string | number;
  label: string;
}

/**
 * Composant Autocomplete
 * Conforme aux exigences VDEV : facilitation des saisies avec champs auto-complétés.
 */
export function Autocomplete({ 
  options, 
  onSelect, 
  placeholder = "Rechercher...",
  label
}: { 
  options: Option[], 
  onSelect: (option: Option) => void,
  placeholder?: string,
  label?: string
}) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = query === "" 
    ? [] 
    : options.filter((option) => 
        option.label.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-2 relative" ref={containerRef}>
      {label && <label className="text-xs font-semibold text-slate-500 uppercase">{label}</label>}
      <div className="relative">
        <input
          type="text"
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 pl-10 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <ul className="absolute z-50 top-full mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden py-1">
          {filteredOptions.map((option) => (
            <li
              key={option.id}
              className="px-4 py-2 text-sm hover:bg-blue-50 cursor-pointer text-slate-700 transition-colors"
              onClick={() => {
                onSelect(option);
                setQuery(option.label);
                setIsOpen(false);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
