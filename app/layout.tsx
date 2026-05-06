import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/session-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "CashCash - Gestion des Interventions",
    template: "%s | CashCash | Dashboard | Maintenance | Intervention",
  },
  description: "Solution professionnelle de maintenance pour CashCash",
   icons: {
    icon: [
      { url: "/images/cashcash-logov2.png", sizes: "32x32", type: "image/png" },
      { url: "/images/cashcash-logov2.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/images/cashcash-logov2.png", sizes: "180x180" },
    ],
  },
};

export const viewport = {
  themeColor: "#00674f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
