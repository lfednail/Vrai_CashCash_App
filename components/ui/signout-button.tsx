"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

interface SignOutProps {
  className?: string;
  children?: React.ReactNode;
}

export default function SignOutButton({ className, children }: SignOutProps) {
  return (
    <button
      onClick={() => signOut()}
      className={className || "flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-600 transition-colors bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200"}
    >
      {children || (
        <>
          <LogOut className="h-4 w-4" />
          <span className="hidden md:inline">Déconnexion</span>
        </>
      )}
    </button>
  );
}
