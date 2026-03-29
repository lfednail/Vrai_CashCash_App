"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Search, 
  CalendarDays, 
  CheckCircle, 
  FileText, 
  MapPin,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: Home, label: "Tableau de bord", href: "/technicien" },
  { icon: Search, label: "Rechercher client", href: "/technicien/recherche" },
  { icon: CalendarDays, label: "Mes interventions", href: "/technicien/interventions" },
  { icon: CheckCircle, label: "Valider intervention", href: "/technicien/valider" },
  { icon: FileText, label: "Générer PDF", href: "/technicien/reports" },
  
];

export default function TechnicianSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[280px] bg-white border-r border-slate-200 flex flex-col h-full min-h-[calc(100vh-64px)]">
      <div className="pt-6 pb-2 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors group",
                isActive 
                  ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5",
                isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
              )} />
              <span className="flex-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
      <div className="border-t border-slate-100 p-4">
        <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
          <p className="text-xs font-medium text-slate-500">Connecté en tant que</p>
          <p className="mt-1 text-sm font-bold text-slate-900">Technicien</p>
        </div>
      </div>
    </aside>
    
  );
}
