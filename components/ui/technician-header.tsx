import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Bell, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import SignOutButton from "@/components/ui/signout-button";

export default async function TechnicianHeader() {
  const session = await getServerSession(authOptions);

  if (!session) return null;

  const user = session.user;

  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex items-center gap-3">
        <Link href="/technicien" className="flex items-center gap-2">
         <img 
            src="/images/cashcash-logov2.png" 
            alt="CashCash" 
            className="h-12 w-auto object-contain"
         />
          <span className="text-xl font-bold text-slate-900 tracking-tight">
            CashCash<span className="text-blue-600">Interventions</span>
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 rounded-full bg-slate-100 pr-4 pl-1 py-1">
          <div className="h-8 w-8 rounded-full bg-slate-300"></div>
          <span className="text-sm font-semibold text-slate-800">{user?.name}</span>
        </div>
        
        <div className="flex items-center gap-4 text-slate-500">
          {/* Custom logout button icon matching the mockup */}
          <SignOutButton className="hover:text-slate-800 transition-colors">
             <LogOut className="h-5 w-5" />
          </SignOutButton>
        </div>
      </div>
    </header>
  );
}
