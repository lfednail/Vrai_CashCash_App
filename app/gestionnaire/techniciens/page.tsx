import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Users, Search, Phone, Mail, Award, Calendar } from "lucide-react";

export default async function TechniciensPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "GESTIONNAIRE") {
    return <div>Non autorisé</div>;
  }

  // Récupérer l'agence du gestionnaire
  const user = await prisma.employe.findUnique({
    where: { matricule: session.user.id },
    select: { numeroAgence: true },
  });

  if (!user) return <div>Utilisateur non trouvé</div>;

  // Récupérer tous les techniciens de l'agence avec leurs interventions validées
  const technicians = await prisma.technicien.findMany({
    where: {
      employe: { numeroAgence: user.numeroAgence },
    },
    include: {
      employe: true,
      interventions: {
        include: {
          controles: true,
        },
      },
    },
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Nos Techniciens</h1>
        <p className="text-slate-500 mt-1">Liste des experts techniques de votre agence et leurs performances.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {technicians.map((tech) => {
          const validatedInterv = tech.interventions.filter(i => 
            i.controles.length > 0 && i.controles.every(c => c.tempsPasse !== null)
          ).length;

          return (
            <div key={tech.matricule} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                  {tech.employe.prenomEmploye[0]}{tech.employe.nomEmploye[0]}
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">{tech.employe.prenomEmploye} {tech.employe.nomEmploye}</h2>
                  <p className="text-xs font-mono text-slate-400">{tech.matricule}</p>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Award className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-slate-800">{tech.qualification}</span>
                </div>
                
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span>{tech.telephoneMobile}</span>
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span className="truncate">{tech.employe.email}</span>
                </div>

                <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Validées</p>
                    <p className="text-lg font-bold text-emerald-600">{validatedInterv}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Total missions</p>
                    <p className="text-lg font-bold text-slate-700">{tech.interventions.length}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
