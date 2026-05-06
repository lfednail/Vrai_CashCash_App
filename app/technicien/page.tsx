import { getTechnicianInterventions } from "@/app/actions/intervention.actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { 
  CalendarDays, 
  MapPin, 
  Clock, 
  Activity, 
  Search, 
  Filter, 
  Calendar as CalendarIcon,
  Eye,
  Edit
} from "lucide-react";
import Link from "next/link";
import DashboardInterventionsList from "@/components/ui/dashboard-interventions-list";
import DashboardClientSearch from "@/components/ui/dashboard-client-search";

export default async function TechnicienDashboard() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  const interventions = await getTechnicianInterventions();

  const today = new Date().toDateString();

  // Dynamic calculations based on real DB data
  const interventionsToday = interventions.filter(i => new Date(i.dateVisite).toDateString() === today);
  
  // Pending if any of the controls lack 'tempsPasse' (meaning not validated)
  const isPending = (i: any) => i.controles.length === 0 || i.controles.some((c: any) => c.tempsPasse === null);
  const pendingInterventions = interventions.filter(isPending);

  // Sum of kilometers
  const totalKm = interventionsToday.reduce((sum, i) => sum + (i.client.distanceKM || 0), 0);
  
  // Sum of all tempsPasse (in minutes) across all validated interventions
  const validInterventions = interventions.filter(i => !isPending(i));
  const totalMinutes = validInterventions.reduce((sum, i) => {
    const iSum = i.controles.reduce((s: number, c: any) => s + (c.tempsPasse || 0), 0);
    return sum + iSum;
  }, 0);
  
  const timeHours = Math.floor(totalMinutes / 60);
  const timeMins = totalMinutes % 60;
  const timeSpentString = totalMinutes > 0 ? `${timeHours}h ${timeMins}min` : "0h 0min";

  const stats = {
    today: interventionsToday.length,
    pending: pendingInterventions.length,
    km: totalKm,
    timeSpent: timeSpentString
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header section */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Tableau de bord technicien</h1>
        <p className="text-slate-500 mt-1">
          Bienvenue {user?.name || "Jean Dupont"}, vous avez {stats.today} interventions prévues aujourd'hui
        </p>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex justify-between items-center transition-all hover:shadow-md">
          <div>
            <p className="text-sm text-slate-500 font-medium">Interventions aujourd'hui</p>
            <p className="text-2xl font-bold text-slate-800 mt-2">{stats.today}</p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary">
            <CalendarDays className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex justify-between items-center transition-all hover:shadow-md">
          <div>
            <p className="text-sm text-slate-500 font-medium">En attente validation</p>
            <p className="text-2xl font-bold text-slate-800 mt-2">{stats.pending}</p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-600">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex justify-between items-center transition-all hover:shadow-md">
          <div>
            <p className="text-sm text-slate-500 font-medium">Kilomètres (du jour)</p>
            <p className="text-2xl font-bold text-slate-800 mt-2">{stats.km}</p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
            <MapPin className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex justify-between items-center transition-all hover:shadow-md">
          <div>
            <p className="text-sm text-slate-500 font-medium">Temps total passé</p>
            <p className="text-2xl font-bold text-slate-800 mt-2">{stats.timeSpent}</p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
            <Activity className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Rechercher un client */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Rechercher un client</h2>
        <div className="space-y-1">
          <label className="text-sm text-slate-500 font-medium">Numéro de client, Nom ou SIREN</label>
          <DashboardClientSearch />
        </div>
      </div>

      {/* Mes interventions à venir */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden space-y-4 pt-6">
        <div className="px-6 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">Mes interventions récentes</h2>
        </div>

        <DashboardInterventionsList initialInterventions={interventions} />
        
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <div>
            Affichage de {Math.min(interventions.length, 5)} sur {interventions.length} résultats
          </div>
          <div className="flex gap-4">
            <Link href="/technicien/interventions" className="px-4 py-2 bg-secondary text-white rounded-lg font-medium hover:bg-secondary/80 transition-colors">
              Voir tout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
