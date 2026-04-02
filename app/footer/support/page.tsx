import Link from "next/link";
import { 
  ArrowLeft, 
  Wrench, 
  LifeBuoy, 
  Mail, 
  Phone, 
  Clock, 
  MessageCircle, 
  FileQuestion, 
  BookOpen, 
  ChevronDown,
  MapPin,
  Send
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support",
  description: "Centre d'aide et support technique CashCash - Contactez notre équipe pour toute assistance.",
};

export default function SupportPage() {
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
            <LifeBuoy className="h-8 w-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
            Centre de <span className="text-primary italic">Support</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Notre équipe est à votre disposition pour répondre à toutes vos questions 
            et vous accompagner dans l&apos;utilisation de la plateforme CashCash.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Nous contacter</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ContactCard
              icon={Mail}
              title="Email"
              value="support@cashcash-maintenance.fr"
              subtitle="Réponse sous 24h ouvrées"
              color="bg-blue-50 text-blue-600"
            />
            <ContactCard
              icon={Phone}
              title="Téléphone"
              value="01 23 45 67 89"
              subtitle="Lun - Ven, 9h - 18h"
              color="bg-emerald-50 text-emerald-600"
            />
            <ContactCard
              icon={MessageCircle}
              title="Chat en ligne"
              value="Assistance instantanée"
              subtitle="Disponible en heures ouvrées"
              color="bg-purple-50 text-purple-600"
            />
          </div>
        </div>
      </section>

      {/* Horaires & Infos */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Horaires */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold">Horaires d&apos;ouverture</h3>
            </div>
            <div className="space-y-3">
              {[
                { day: "Lundi - Vendredi", hours: "9h00 - 18h00", active: true },
                { day: "Samedi", hours: "10h00 - 14h00", active: true },
                { day: "Dimanche", hours: "Fermé", active: false },
                { day: "Jours fériés", hours: "Fermé", active: false },
              ].map((schedule) => (
                <div key={schedule.day} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <span className="text-sm font-medium text-slate-700">{schedule.day}</span>
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    schedule.active 
                      ? "bg-emerald-50 text-emerald-600" 
                      : "bg-red-50 text-red-500"
                  }`}>
                    {schedule.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Adresse */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold">Notre adresse</h3>
            </div>
            <div className="space-y-4">
              <p className="text-slate-600 leading-relaxed">
                <strong>CashCash Maintenance SAS</strong><br />
                12 Rue des Technologies<br />
                75008 Paris, France
              </p>
              <div className="w-full h-40 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 text-sm">
                <MapPin className="h-5 w-5 mr-2" />
                Carte interactive — Paris 8e
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-secondary/20 text-primary mb-4">
              <FileQuestion className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Questions fréquentes</h2>
            <div className="h-1.5 w-20 bg-primary mx-auto rounded-full"></div>
          </div>

          <div className="space-y-4">
            <FaqItem
              question="Comment créer un compte sur CashCash ?"
              answer="Les comptes sont créés par les gestionnaires d'agence. Contactez votre responsable ou notre support pour obtenir vos identifiants de connexion."
            />
            <FaqItem
              question="J'ai oublié mon mot de passe, que faire ?"
              answer="Sur la page de connexion, cliquez sur 'Mot de passe oublié'. Un email de réinitialisation vous sera envoyé. Si le problème persiste, contactez notre support technique."
            />
            <FaqItem
              question="Comment signaler un bug ou un problème technique ?"
              answer="Envoyez un email à support@cashcash-maintenance.fr en décrivant le problème de manière détaillée (captures d'écran, étapes pour reproduire le bug). Notre équipe technique vous répondra dans les 24h ouvrées."
            />
            <FaqItem
              question="Quels navigateurs sont compatibles avec CashCash ?"
              answer="CashCash est compatible avec les dernières versions de Google Chrome, Mozilla Firefox, Microsoft Edge et Safari. Nous recommandons l'utilisation de Google Chrome pour une expérience optimale."
            />
            <FaqItem
              question="Comment exporter mes rapports d'intervention ?"
              answer="En tant que gestionnaire, rendez-vous dans la section 'Rapports' de votre tableau de bord. Vous pouvez générer et exporter des rapports au format XML. Les exports PDF seront disponibles prochainement."
            />
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Envoyez-nous un message</h2>
            <p className="text-slate-500">Nous vous répondrons dans les plus brefs délais.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg shadow-slate-100/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">Nom complet</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Jean Dupont"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="jean@exemple.fr"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 mb-1.5">Sujet</label>
              <select
                id="subject"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all bg-white"
              >
                <option value="">Sélectionnez un sujet</option>
                <option value="technique">Problème technique</option>
                <option value="compte">Gestion de compte</option>
                <option value="facturation">Facturation</option>
                <option value="fonctionnalite">Demande de fonctionnalité</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-1.5">Message</label>
              <textarea
                id="message"
                rows={5}
                placeholder="Décrivez votre demande en détail..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all resize-none"
              ></textarea>
            </div>
            <button className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
              <Send className="h-4 w-4" />
              Envoyer le message
            </button>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-2">Ressources utiles</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ResourceCard
              icon={BookOpen}
              title="Documentation"
              desc="Guides d'utilisation complets pour gestionnaires et techniciens."
            />
            <ResourceCard
              icon={FileQuestion}
              title="Base de connaissances"
              desc="Articles et tutoriels pour résoudre les problèmes courants."
            />
            <ResourceCard
              icon={MessageCircle}
              title="Communauté"
              desc="Forum d'échange entre utilisateurs et experts CashCash."
            />
          </div>
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
            <Link href="/footer/mentions-legales" className="hover:text-primary transition-colors">Mentions Légales</Link>
            <Link href="/footer/confidentialite" className="hover:text-primary transition-colors">Confidentialité</Link>
            <Link href="/footer/support" className="text-primary font-semibold">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ContactCard({ icon: Icon, title, value, subtitle, color }: any) {
  return (
    <div className="p-6 rounded-3xl border border-slate-100 bg-white hover:border-secondary hover:shadow-2xl hover:shadow-secondary/10 transition-all text-center group">
      <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="font-bold text-lg mb-1">{title}</h3>
      <p className="text-primary font-semibold text-sm mb-1">{value}</p>
      <p className="text-slate-400 text-xs">{subtitle}</p>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group bg-white border border-slate-100 rounded-2xl overflow-hidden hover:border-secondary transition-colors">
      <summary className="flex items-center justify-between cursor-pointer p-5 font-semibold text-slate-800 select-none">
        <span>{question}</span>
        <ChevronDown className="h-5 w-5 text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" />
      </summary>
      <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-50 pt-3">
        {answer}
      </div>
    </details>
  );
}

function ResourceCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="p-6 rounded-3xl border border-slate-100 bg-white hover:border-secondary hover:shadow-xl hover:shadow-secondary/10 transition-all group cursor-pointer">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
