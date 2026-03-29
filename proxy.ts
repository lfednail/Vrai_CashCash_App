import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export const proxy = withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const role = token?.role as string | undefined;
    const path = req.nextUrl.pathname;

    // Technicien essaie d'accéder au portail gestionnaire → redirigé vers son portail
    if (path.startsWith("/gestionnaire") && role !== "GESTIONNAIRE") {
      return NextResponse.redirect(new URL("/technicien", req.url));
    }

    // Gestionnaire essaie d'accéder au portail technicien → redirigé vers son portail
    if (path.startsWith("/technicien") && role !== "TECHNICIEN") {
      return NextResponse.redirect(new URL("/gestionnaire", req.url));
    }
  },
  {
    callbacks: {
      // L'utilisateur doit être authentifié pour accéder aux routes protégées
      // (sinon withAuth le redirige automatiquement vers /login)
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/gestionnaire/:path*", "/technicien/:path*", "/api/((?!auth).)*"],
};
