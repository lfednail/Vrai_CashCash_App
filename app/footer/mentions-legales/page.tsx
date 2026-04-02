import Link from "next/link";
import { ArrowLeft, Wrench, Scale, Building2, Globe, Server, FileText } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions Légales",
  description: "Mentions légales de la plateforme CashCash - Gestion des interventions de maintenance.",
};

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-800">
                <img
                  src="/images/cashcash-logov2.png"
                  alt="CashCash"
                  className="h-12 w-auto object-contain"
                />
              </Link>
            </div>
            <span className="font-bold text-xl tracking-tight text-primary">CashCash</span>
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
      <section className="pt-28 pb-12 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6">
            <Scale className="h-8 w-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
            Mentions <span className="text-primary italic">Légales</span>
          </h1>
          <p className="text-slate-500 text-lg">Dernière mise à jour : 30 mars 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Éditeur */}
          <LegalSection
            icon={Building2}
            title="1. Éditeur du site"
          >
            <p>
              Le site <strong>CashCash</strong> est édité par la société <strong>CashCash Maintenance SAS</strong>,
              société par actions simplifiée au capital de 50 000 €.
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 mt-3">
              <li><strong>Siège social :</strong> 12 Rue des Technologies, 75008 Paris, France</li>
              <li><strong>RCS :</strong> Paris B 123 456 789</li>
              <li><strong>SIRET :</strong> 123 456 789 00012</li>
              <li><strong>N° TVA :</strong> FR 12 345678901</li>
              <li><strong>Directeur de la publication :</strong> M. Jean Dupont, Directeur Général</li>
              <li><strong>Contact :</strong> contact@cashcash-maintenance.fr</li>
            </ul>
          </LegalSection>

          {/* Hébergeur */}
          <LegalSection
            icon={Server}
            title="2. Hébergement"
          >
            <p>
              Le site est hébergé par <strong>Vercel Inc.</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 mt-3">
              <li><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</li>
              <li><strong>Site web :</strong> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">vercel.com</a></li>
            </ul>
          </LegalSection>

          {/* Propriété intellectuelle */}
          <LegalSection
            icon={FileText}
            title="3. Propriété intellectuelle"
          >
            <p>
              L&apos;ensemble des contenus présents sur le site CashCash (textes, images, graphismes, logo, icônes, logiciels, base de données)
              sont protégés par le droit de la propriété intellectuelle et restent la propriété exclusive de CashCash Maintenance SAS.
            </p>
            <p className="mt-3">
              Toute reproduction, représentation, modification, publication, transmission ou dénaturation, totale ou partielle,
              du site ou de son contenu, par quelque procédé que ce soit, et sur quelque support que ce soit, est interdite sans
              l&apos;autorisation écrite préalable de CashCash Maintenance SAS.
            </p>
          </LegalSection>

          {/* Responsabilité */}
          <LegalSection
            icon={Globe}
            title="4. Limitation de responsabilité"
          >
            <p>
              CashCash Maintenance SAS s&apos;efforce de fournir des informations aussi précises que possible sur le site.
              Toutefois, elle ne pourra être tenue responsable des omissions, des inexactitudes et des carences dans la mise à jour,
              qu&apos;elles soient de son fait ou du fait des tiers partenaires qui lui fournissent ces informations.
            </p>
            <p className="mt-3">
              L&apos;utilisation du site se fait sous l&apos;entière responsabilité de l&apos;utilisateur. CashCash Maintenance SAS
              ne pourra être tenue pour responsable des dommages directs ou indirects résultant de l&apos;accès ou de l&apos;utilisation
              du site, y compris l&apos;inaccessibilité, les pertes de données, ou les virus.
            </p>
          </LegalSection>

          {/* Droit applicable */}
          <LegalSection
            icon={Scale}
            title="5. Droit applicable"
          >
            <p>
              Les présentes mentions légales sont soumises au droit français. En cas de litige, et après tentative de recherche
              d&apos;une solution amiable, compétence est attribuée aux tribunaux français compétents.
            </p>
          </LegalSection>
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
            <Link href="/footer/mentions-legales" className="text-primary font-semibold">Mentions Légales</Link>
            <Link href="/footer/confidentialite" className="hover:text-primary transition-colors">Confidentialité</Link>
            <Link href="/footer/support" className="hover:text-primary transition-colors">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LegalSection({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="group">
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
          <Icon className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold pt-2">{title}</h2>
      </div>
      <div className="pl-16 text-slate-600 leading-relaxed">
        {children}
      </div>
    </div>
  );
}
