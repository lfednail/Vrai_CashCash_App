import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";


export default async function HomePage() {
  const session = await getServerSession(authOptions);

  console.log("DEBUG: Root page session:", session ? "Active" : "None");

  if (!session) {
    console.log("DEBUG: No session, redirecting to /login");
    redirect("/login");
  }

  const role = (session.user as any).role;
  console.log("DEBUG: Session role:", role);

  if (role === "GESTIONNAIRE") {
    redirect("/gestionnaire");
  } else if (role === "TECHNICIEN") {
    redirect("/technicien");
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Redirection en cours...</p>
    </div>
  );
}

