import Link from "next/link";
import {
  ArrowLeft,
  Wrench,
  Shield,
  Cookie,
  Eye,
  Lock,
  UserCheck,
  Database,
  Bell,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialité",
  description:
    "Politique de confidentialité de la plateforme CashCash - Protection de vos données personnelles.",
};

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <Link
                href="/"
                className="flex items-center gap-2 font-bold text-xl text-slate-800"
              >
                <img
                  src="/images/cashcash-logov2.png"
                  alt="CashCash"
                  className="h-12 w-auto object-contain"
                />
              </Link>
            </div>
            <span className="font-bold text-xl tracking-tight text-primary">
              CashCash
            </span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l&apos;accueil
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-12 px-4 bg-linear-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
            Politique de{" "}
            <span className="text-primary italic">Confidentialité</span>
          </h1>
          <p className="text-slate-500 text-lg">
            Dernière mise à jour : 30 mars 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Introduction */}
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
            <p className="text-slate-700 leading-relaxed">
              Chez <strong>CashCash Maintenance</strong>, la protection de vos
              données personnelles est une priorité. Cette politique de
              confidentialité décrit comment nous collectons, utilisons et
              protégeons vos informations lorsque vous utilisez notre plateforme
              de gestion des interventions de maintenance.
            </p>
          </div>

          {/* Données collectées */}
          <PrivacySection icon={Database} title="1. Données collectées">
            <p>
              Nous collectons les données suivantes dans le cadre de
              l&apos;utilisation de la plateforme :
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <DataCard
                title="Données d'identification"
                items={[
                  "Nom et prénom",
                  "Adresse e-mail professionnelle",
                  "Numéro de téléphone",
                  "Rôle (gestionnaire, technicien)",
                ]}
              />
              <DataCard
                title="Données d'utilisation"
                items={[
                  "Historique des connexions",
                  "Interventions réalisées",
                  "Rapports générés",
                  "Préférences d'interface",
                ]}
              />
            </div>
          </PrivacySection>

          {/* Finalités */}
          <PrivacySection icon={Eye} title="2. Finalités du traitement">
            <p>Vos données sont traitées pour les finalités suivantes :</p>
            <ul className="mt-3 space-y-2">
              <li className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold mt-0.5">
                  1
                </span>
                <span>
                  <strong>Gestion des comptes utilisateurs</strong> — Création,
                  authentification et gestion de votre espace personnel.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold mt-0.5">
                  2
                </span>
                <span>
                  <strong>Suivi des interventions</strong> — Assignation,
                  planification et suivi des opérations de maintenance.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold mt-0.5">
                  3
                </span>
                <span>
                  <strong>Analyses et statistiques</strong> — Génération de
                  rapports pour optimiser les performances.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold mt-0.5">
                  4
                </span>
                <span>
                  <strong>Communication</strong> — Notifications liées à vos
                  interventions et mises à jour de la plateforme.
                </span>
              </li>
            </ul>
          </PrivacySection>

          {/* Sécurité */}
          <PrivacySection icon={Lock} title="3. Sécurité des données">
            <p>
              Nous mettons en œuvre des mesures techniques et organisationnelles
              appropriées pour protéger vos données personnelles contre tout
              accès non autorisé, modification, divulgation ou destruction :
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 mt-3">
              <li>Chiffrement des données en transit (TLS/SSL) et au repos</li>
              <li>
                Authentification sécurisée avec hachage des mots de passe
                (bcrypt)
              </li>
              <li>Contrôle d&apos;accès basé sur les rôles (RBAC)</li>
              <li>Sauvegardes régulières et plan de reprise d&apos;activité</li>
              <li>Audits de sécurité périodiques</li>
            </ul>
          </PrivacySection>

          {/* Droits */}
          <PrivacySection icon={UserCheck} title="4. Vos droits">
            <p>
              Conformément au Règlement Général sur la Protection des Données
              (RGPD), vous disposez des droits suivants :
            </p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  label: "Droit d'accès",
                  desc: "Consulter vos données personnelles",
                },
                {
                  label: "Droit de rectification",
                  desc: "Corriger des données inexactes",
                },
                {
                  label: "Droit à l'effacement",
                  desc: "Demander la suppression de vos données",
                },
                {
                  label: "Droit à la portabilité",
                  desc: "Récupérer vos données dans un format standard",
                },
                {
                  label: "Droit d'opposition",
                  desc: "Vous opposer au traitement de vos données",
                },
                {
                  label: "Droit de limitation",
                  desc: "Limiter le traitement de vos données",
                },
              ].map((right) => (
                <div
                  key={right.label}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50 hover:border-secondary transition-colors"
                >
                  <p className="font-semibold text-sm text-slate-900">
                    {right.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{right.desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm">
              Pour exercer vos droits, contactez-nous à :{" "}
              <a
                href="mailto:dpo@cashcash-maintenance.fr"
                className="text-primary hover:underline font-semibold"
              >
                dpo@cashcash-maintenance.fr
              </a>
            </p>
          </PrivacySection>

          {/* Cookies */}
          <PrivacySection icon={Cookie} title="5. Cookies">
            <p>
              Notre plateforme utilise des cookies strictement nécessaires au
              fonctionnement du service :
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-left">
                    <th className="p-3 font-semibold rounded-tl-xl">Cookie</th>
                    <th className="p-3 font-semibold">Finalité</th>
                    <th className="p-3 font-semibold rounded-tr-xl">Durée</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-mono text-xs text-primary">
                      next-auth.session
                    </td>
                    <td className="p-3 text-slate-600">Session utilisateur</td>
                    <td className="p-3 text-slate-600">Session</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-xs text-primary">
                      next-auth.csrf
                    </td>
                    <td className="p-3 text-slate-600">Protection CSRF</td>
                    <td className="p-3 text-slate-600">Session</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-xs text-primary">
                      next-auth.callback
                    </td>
                    <td className="p-3 text-slate-600">URL de redirection</td>
                    <td className="p-3 text-slate-600">Session</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </PrivacySection>

          {/* Contact */}
          <PrivacySection icon={Bell} title="6. Contact">
            <p>
              Pour toute question relative à la protection de vos données
              personnelles, vous pouvez nous contacter :
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 mt-3">
              <li>
                <strong>Email :</strong>{" "}
                <a
                  href="mailto:dpo@cashcash-maintenance.fr"
                  className="text-primary hover:underline"
                >
                  dpo@cashcash-maintenance.fr
                </a>
              </li>
              <li>
                <strong>Courrier :</strong> CashCash Maintenance SAS — DPO, 12
                Rue des Technologies, 75008 Paris
              </li>
              <li>
                <strong>CNIL :</strong> Vous pouvez également introduire une
                réclamation auprès de la{" "}
                <a
                  href="https://www.cnil.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  CNIL
                </a>
              </li>
            </ul>
          </PrivacySection>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 bg-slate-50 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-50">
            <Wrench className="h-5 w-5" />
            <span className="font-bold">CashCash Maintenance © 2026</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-400">
            <Link
              href="/footer/mentions-legales"
              className="hover:text-primary transition-colors"
            >
              Mentions Légales
            </Link>
            <Link
              href="/footer/confidentialite"
              className="text-primary font-semibold"
            >
              Confidentialité
            </Link>
            <Link
              href="/footer/support"
              className="hover:text-primary transition-colors"
            >
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PrivacySection({
  icon: Icon,
  title,
  children,
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group">
      <div className="flex items-start gap-4 mb-4">
        <div className="shrink-0 w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
          <Icon className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold pt-2">{title}</h2>
      </div>
      <div className="pl-16 text-slate-600 leading-relaxed">{children}</div>
    </div>
  );
}

function DataCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50">
      <h4 className="font-semibold text-sm mb-2 text-slate-900">{title}</h4>
      <ul className="space-y-1">
        {items.map((item) => (
          <li
            key={item}
            className="text-sm text-slate-600 flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
