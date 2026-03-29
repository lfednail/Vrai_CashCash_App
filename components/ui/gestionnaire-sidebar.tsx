"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Building2, 
  MapPin, 
  Users, 
  Settings, 
  BarChart3,
  CalendarCheck
} from "lucide-react";

export default function GestionnaireSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      title: "Tableau de bord",
      href: "/gestionnaire",
      icon: BarChart3,
    },
    {
      title: "Assigner missions",
      href: "/gestionnaire/assigner",
      icon: CalendarCheck,
    },
    {
      title: "Techniciens",
      href: "/gestionnaire/techniciens",
      icon: Users,
    },
    {
      title: "Clients",
      href: "/gestionnaire/clients",
      icon: Users,
    },
    {
      title: "Mon Agence",
      href: "/gestionnaire/agence",
      icon: Building2,
    },
  ];

  return (
    <div className="flex h-full w-64 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center border-b border-slate-100 px-6">
        
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4">
        <div className="space-y-1">
          <p className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
            Espace Gestionnaire
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <item.icon
                  className={`h-5 w-5 shrink-0 transition-colors ${
                    isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                {item.title}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="border-t border-slate-100 p-4">
        <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
          <p className="text-xs font-medium text-slate-500">Connecté en tant que</p>
          <p className="mt-1 text-sm font-bold text-slate-900">Gestionnaire</p>
        </div>
      </div>
    </div>
  );
}
