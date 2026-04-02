import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { 
  Wrench, 
  ShieldCheck, 
  Clock, 
  BarChart3, 
  ArrowRight,
  ChevronRight
} from "lucide-react";
import Image from "next/image";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    const role = (session.user as any).role;
    if (role === "GESTIONNAIRE") {
      redirect("/gestionnaire");
    } else if (role === "TECHNICIEN") {
      redirect("/technicien");
    }
  }

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
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#services" className="hover:text-primary transition-colors">Services</a>
            <a href="#solutions" className="hover:text-primary transition-colors">Solutions</a>
            <a href="#about" className="hover:text-primary transition-colors">À propos</a>
          </div>
          <Link 
            href="/login" 
            className="bg-primary text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-primary-hover transition-all flex items-center gap-2"
          >
            Se connecter
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-secondary/20 text-primary px-4 py-1.5 rounded-full text-xs font-bold mb-6 border border-secondary/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Solution de Maintenance de Nouvelle Génération
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-slate-900">
            Optimisez vos <span className="text-primary italic">Interventions</span> <br className="hidden md:block" /> en temps réel
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-500 mb-10 leading-relaxed">
            La plateforme SaaS leader pour la gestion des techniciens de maintenance. 
            Suivi des équipements, contrats PREMIUM et rapports automatisés pour une productivité maximale.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/login" 
              className="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-xl text-lg font-bold hover:scale-105 transition-transform shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
            >
              Démarrer maintenant
              <ArrowRight className="h-5 w-5" />
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 rounded-xl border border-slate-200 font-semibold hover:bg-slate-50 transition-colors">
              Voir la démo
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="services" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold mb-4">Une solution complète pour vos agences</h2>
            <div className="h-1.5 w-20 bg-primary mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Clock} 
              title="Réactivité Immédiate" 
              desc="Réduction du temps d'immobilisation grâce à une assignation intelligente des interventions par proximité géographique."
            />
            <FeatureCard 
              icon={ShieldCheck} 
              title="Garantie & Contrats" 
              desc="Vérification automatique de l'éligibilité des équipements sous contrats de maintenance PREMIUM."
            />
            <FeatureCard 
              icon={BarChart3} 
              title="Statistiques Avancées" 
              desc="Tableaux de bord détaillés pour les gestionnaires : kilomètres parcourus, temps passé et taux de résolution."
            />
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-dark text-white text-center">
        <h3 className="text-xl uppercase tracking-widest text-secondary font-bold mb-8">Ils nous font confiance</h3>
        <div className="max-w-4xl mx-auto opacity-50 flex flex-wrap justify-center gap-12 grayscale hover:grayscale-0 transition-all">
          <span className="text-3xl font-black">ENTREPRISE XYZ</span>
          <span className="text-3xl font-black">BOUTIQUE ABC</span>
          <span className="text-3xl font-black">GROUP MAINT</span>
          <span className="text-3xl font-black">TECH SOLUTIONS</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 bg-slate-50 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-50">
            <Wrench className="h-5 w-5" />
            <span className="font-bold">CashCash Maintenance © 2026</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-400">
            <Link href="/footer/mentions-legales" className="hover:text-primary transition-colors">Mentions Légales</Link>
            <Link href="/footer/confidentialite" className="hover:text-primary transition-colors">Confidentialité</Link>
            <Link href="/footer/support" className="hover:text-primary transition-colors">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="p-8 rounded-3xl border border-slate-100 bg-white hover:border-secondary hover:shadow-2xl hover:shadow-secondary/10 transition-all group">
      <div className="bg-slate-50 text-primary w-14 h-14 flex items-center justify-center rounded-2xl mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm">
        {desc}
      </p>
    </div>
  );
}


