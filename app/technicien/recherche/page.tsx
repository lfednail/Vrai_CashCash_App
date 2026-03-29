import { searchClients } from "@/app/actions/client.actions";
import { Search, User, Building2, MapPin, Package, History } from "lucide-react";
import Link from "next/link";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function RechercheClientPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const clients = query.length >= 2 ? await searchClients(query) : [];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Rechercher un client</h1>
        <p className="text-slate-500 mt-1">Consultez l&apos;historique et les informations détaillées d&apos;un client.</p>
      </div>

      {/* Barre de recherche */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <form method="GET" action="/technicien/recherche">
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Nom de l'entreprise, numéro client, SIREN…"
              autoFocus
              className="block w-full pl-12 pr-36 py-3 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
            />
            <button
              type="submit"
              className="absolute inset-y-1 right-1 bg-primary hover:bg-primary-hover text-white px-5 py-1.5 rounded-md font-medium text-sm transition-colors"
            >
              Rechercher
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2 ml-1">Saisissez au moins 2 caractères.</p>
        </form>
      </div>

      {/* Résultats */}
      {query.length >= 2 && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500 font-medium">
            {clients.length === 0
              ? `Aucun client trouvé pour « ${query} »`
              : `${clients.length} client${clients.length > 1 ? "s" : ""} trouvé${clients.length > 1 ? "s" : ""} pour « ${query} »`}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {clients.map((client) => (
              <div
                key={client.numeroClient}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4 hover:shadow-md transition-shadow"
              >
                {/* En-tête client */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-900 text-base leading-tight">{client.raisonSociale}</h2>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">#CLI-{String(client.numeroClient).padStart(5, "0")}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-mono shrink-0">
                    {client.siren}
                  </span>
                </div>

                {/* Adresse */}
                <div className="flex items-start gap-2 text-sm text-slate-500">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-slate-400" />
                  <span>{client.adresse}</span>
                </div>

                {/* Matériels */}
                {client.materiels.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                      <Package className="h-3.5 w-3.5" />
                      Matériels ({client.materiels.length})
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {client.materiels.map((mat) => (
                        <span
                          key={mat.numeroSerie}
                          className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100"
                        >
                          {mat.typeMateriel.libelleTypeMateriel}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interventions récentes */}
                {client.interventions.length > 0 && (
                  <div className="border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                      <History className="h-3.5 w-3.5" />
                      {client.interventions.length} intervention{client.interventions.length > 1 ? "s" : ""} récente{client.interventions.length > 1 ? "s" : ""}
                    </div>
                    <p className="text-xs text-slate-500">
                      Dernière le {new Date(client.interventions[0].dateVisite).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                )}

                {/* Action */}
                <Link
                  href={`/technicien/interventions?client=${client.numeroClient}`}
                  className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
                >
                  <User className="h-4 w-4" />
                  Voir les interventions
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* État vide initial */}
      {query.length < 2 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
          <div className="mx-auto h-16 w-16 mb-6 rounded-full bg-blue-50 flex items-center justify-center">
            <Search className="h-8 w-8 text-blue-400" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 mb-2">Trouver un profil client</h2>
          <p className="text-slate-500 max-w-sm mx-auto text-sm">
            Utilisez la barre de recherche ci-dessus pour retrouver un client par nom, numéro ou SIREN.
          </p>
        </div>
      )}
    </div>
  );
}
