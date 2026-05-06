"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, CalendarDays, ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function MonthSelector({ initialMonth, initialYear }: { initialMonth: number, initialYear: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  const currentMonth = initialMonth;
  const currentYear = initialYear;

  const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  const years = [currentYear - 1, currentYear, currentYear + 1];

  const handleSelect = (m: number, y: number) => {
    setIsOpen(false);
    router.push(`/gestionnaire?month=${m + 1}&year=${y}`);
  };

  const handlePrev = () => {
    const m = currentMonth === 1 ? 12 : currentMonth - 1;
    const y = currentMonth === 1 ? currentYear - 1 : currentYear;
    router.push(`/gestionnaire?month=${m}&year=${y}`);
  };

  const handleNext = () => {
    const m = currentMonth === 12 ? 1 : currentMonth + 1;
    const y = currentMonth === 12 ? currentYear + 1 : currentYear;
    router.push(`/gestionnaire?month=${m}&year=${y}`);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-3" ref={dropdownRef}>
      <button 
        onClick={handlePrev}
        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm active:scale-95"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div className="relative">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-3 rounded-xl bg-white px-5 py-2.5 text-sm font-bold shadow-sm border transition-all ${isOpen ? 'border-blue-500 ring-2 ring-blue-50/50' : 'border-slate-200 hover:border-slate-300'} text-slate-700 min-w-[180px] justify-between`}
        >
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-blue-500" />
            <span className="capitalize">{months[currentMonth - 1]} {currentYear}</span>
          </div>
          <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 z-50 w-[280px] bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-3 gap-2 mb-4 p-1 bg-slate-50 rounded-xl">
              {years.map(y => (
                <button
                  key={y}
                  onClick={() => handleSelect(currentMonth - 1, y)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${y === currentYear ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  {y}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {months.map((m, idx) => (
                <button
                  key={m}
                  onClick={() => handleSelect(idx, currentYear)}
                  className={`px-2 py-2.5 rounded-xl text-[11px] font-semibold transition-all ${idx === currentMonth - 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'}`}
                >
                  {m.substring(0, 4)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <button 
        onClick={handleNext}
        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm active:scale-95"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
