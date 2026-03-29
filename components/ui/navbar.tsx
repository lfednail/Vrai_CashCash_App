import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LogOut, User, Building2, ClipboardList } from "lucide-react";
import Link from "next/link";
import SignOutButton from "@/components/ui/signout-button";

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  if (!session) return null;

  const user = session.user;
  const role = (user as any).role;

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-800">
              <img 
                src="/images/cashcash-logov2.png" 
                alt="CashCash" 
                className="h-12 w-auto object-contain"
              />
            </Link>

            
            <div className="hidden md:flex items-center gap-6">
              {role === "GESTIONNAIRE" ? (
                <>
                  <Link href="/gestionnaire" className="text-sm font-medium text-slate-600 hover:text-blue-600">Tableau de bord</Link>
                  <Link href="/gestionnaire/assigner" className="text-sm font-medium text-slate-600 hover:text-blue-600">Assigner</Link>
                </>
              ) : (
                <>
                  <Link href="/technicien" className="text-sm font-medium text-slate-600 hover:text-blue-600">Mes Interventions</Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-100">
                <User className="h-4 w-4" />
              </span>
              <span className="hidden sm:inline font-medium">{user?.name}</span>
              <span className="hidden sm:inline bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {role}
              </span>
            </div>
            <SignOutButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
