import { getGestionnaireStats, getTechniciansByAgency, getMonthlyActivity } from "@/app/actions/gestionnaire.actions";
import WeeklyStatsChart from "@/components/ui/weekly-stats-chart";
import { 
  Users, 
  ClipboardCheck, 
  TrendingUp, 
  MapPin, 
  Clock, 
  CalendarDays,
  Activity
} from "lucide-react";
import MonthSelector from "@/components/ui/month-selector";

export default async function GestionnaireDashboard({ searchParams }: { searchParams: { month?: string; year?: string } }) {
  const params = await searchParams;
  const currentMonth = params.month ? parseInt(params.month) : new Date().getMonth() + 1;
  const currentYear = params.year ? parseInt(params.year) : new Date().getFullYear();

  const stats = await getGestionnaireStats(currentMonth, currentYear);
  const technicians = await getTechniciansByAgency();
  const monthlyActivity = await getMonthlyActivity(currentMonth, currentYear);

  const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
  const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
  const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;

  const cards = [
    {
      title: `Interventions en ${new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(new Date(currentYear, currentMonth - 1))}`,
      value: stats.total_interventions,
      icon: ClipboardCheck,
      color: "text-slate-600",
      bg: "bg-secondary/20"
    },
    {
      title: "Distance totale (Aller/Retour)",
      value: `${stats.distance_parcourue_km} km`,
      icon: MapPin,
      color: "text-emerald-600",
      bg: "bg-emerald-100"
    },
    {
      title: "Temps total d'intervention",
      value: `${Math.floor(stats.temps_total_minutes / 60)}h ${stats.temps_total_minutes % 60}m`,
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-100"
    },
    {
      title: "Techniciens actifs",
      value: technicians.length,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-100"
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight text-left">Tableau de bord Gestionnaire</h1>
          <p className="text-slate-500 mt-1 text-left">Aperçu de l'activité de votre agence</p>
        </div>
        
        <div className="flex items-center gap-4">
          <MonthSelector initialMonth={currentMonth} initialYear={currentYear} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.title} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex justify-between items-center transition-all hover:shadow-md hover:border-blue-100">
            <div className="text-left">
              <p className="text-sm font-medium text-slate-500">{card.title}</p>
              <p className="text-2xl font-bold text-slate-800 mt-2">{card.value}</p>
            </div>
            <div className={`h-12 w-12 rounded-lg ${card.bg} flex items-center justify-center`}>
              <card.icon className={`h-6 w-6 ${card.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Sections */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Active Technicians List */}
        <div className="lg:col-span-1 border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col rounded-3xl">
          <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex justify-between items-center">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                  <Users className="h-5 w-5 text-emerald-600" />
                  Techniciens de l'agence
              </h2>
          </div>
          <div className="divide-y divide-slate-100 flex-1 overflow-y-auto">
            {technicians.length === 0 ? (
              <p className="p-8 text-sm text-center text-slate-500">Aucun technicien enregistré</p>
            ) : (
              technicians.map((tech: any) => (
                <div key={tech.matricule} className="flex items-center justify-between p-4 px-6 hover:bg-slate-50/50 transition-colors group">
                  <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center text-sm font-bold text-slate-700 group-hover:bg-secondary/20 transition-colors">
                          {tech.employe.prenomEmploye[0]}{tech.employe.nomEmploye[0]}
                      </div>
                      <div className="text-sm text-left">
                          <p className="font-bold text-slate-900">{tech.employe.prenomEmploye} {tech.employe.nomEmploye}</p>
                          <p className="text-xs text-slate-500 font-medium">{tech.qualification}</p>
                      </div>
                  </div>
                  <div className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                      {tech.matricule}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Charts Integration */}
        <div className="lg:col-span-2 border border-slate-200 bg-white shadow-sm p-6 flex flex-col rounded-3xl">
          <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-emerald-600" />
                  Performance mensuelle (Nb d'interventions)
              </h3>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span className="h-2 w-2 rounded-full bg-secondary"></span>
                  Interventions Validées
              </div>
          </div>
          <div className="h-[350px] w-full flex flex-col justify-end">
            <WeeklyStatsChart data={monthlyActivity} />
          </div>
        </div>
      </div>
    </div>
  );
}
