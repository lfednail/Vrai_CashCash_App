


import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

/**
 * Composant DatePicker moderne
 * Conforme aux exigences VDEV : facilitateurs de saisie et contrôles graphiques modernes.
 */
export function DatePicker({ 
  date, 
  onChange,
  label = "Sélectionner une date"
}: { 
  date?: Date, 
  onChange: (date?: Date) => void,
  label?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-xs font-semibold text-slate-500 uppercase">{label}</label>}
      <div className="relative">
        <input
          type="date"
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all pr-10 appearance-none"
          value={date ? format(date, "yyyy-MM-dd") : ""}
          onChange={(e) => onChange(e.target.value ? new Date(e.target.value) : undefined)}
        />
        <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}
