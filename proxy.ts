import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export const proxy = withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const isGestionnaire = token?.role === "GESTIONNAIRE";
    const isTechnicien = token?.role === "TECHNICIEN";

    const path = req.nextUrl.pathname;

    // Protection des routes Gestionnaire
    if (path.startsWith("/gestionnaire") && !isGestionnaire) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Protection des routes Technicien
    if (path.startsWith("/technicien") && !isTechnicien) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);


export const config = {
  matcher: ["/gestionnaire/:path*", "/technicien/:path*", "/api/((?!auth).)*"],
};
