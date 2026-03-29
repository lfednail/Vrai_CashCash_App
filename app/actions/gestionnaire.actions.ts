"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export async function getGestionnaireStats() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "GESTIONNAIRE") {
    throw new Error("Non autorisé");
  }

  // Récupérer l'agence du gestionnaire
  const user = await prisma.employe.findUnique({
    where: { matricule: session.user.id },
    select: { numeroAgence: true },
  });

  if (!user) throw new Error("Utilisateur non trouvé");

  const now = new Date();
  const month = now.getMonth() + 1; // JS months are 0-indexed
  const year = now.getFullYear();

  try {
    const stats: any[] = await prisma.$queryRaw`CALL GetGestionnaireStats(${user.numeroAgence}, ${month}, ${year})`;
    return stats[0]?.[0] || { total_interventions: 0, distance_parcourue_km: 0, temps_total_minutes: 0 };
  } catch (error) {
    // Fallback Prisma si la procédure n'est pas encore créée en base
    const interventions = await prisma.intervention.findMany({
      where: {
        client: { numeroAgence: user.numeroAgence },
        dateVisite: {
          gte: new Date(year, month - 1, 1),
          lt: new Date(year, month, 1),
        },
      },
      include: {
        client: true,
        controles: true,
      },
    });

    const total_interventions = interventions.length;
    const distance_parcourue_km = interventions.reduce((acc, i) => acc + (i.client.distanceKM * 2), 0);
    const temps_total_minutes = interventions.reduce((acc, i) => acc + i.controles.reduce((sum, c) => sum + (c.tempsPasse || 0), 0), 0);

    return { total_interventions, distance_parcourue_km, temps_total_minutes };
  }
}

export async function getClientsWithMaterials() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "GESTIONNAIRE") {
    throw new Error("Non autorisé");
  }

  const user = await prisma.employe.findUnique({
    where: { matricule: session.user.id },
  });

  return await prisma.client.findMany({
    where: { numeroAgence: user?.numeroAgence },
    include: {
      materiels: {
        where: {
          numeroContrat: { not: null },
          contrat: {
            dateEcheance: { gte: new Date() },
          },
        },
        include: {
            contrat: true
        }
      },
    },
  });
}

export async function getTechniciansByAgency() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "GESTIONNAIRE") {
      throw new Error("Non autorisé");
    }

    const user = await prisma.employe.findUnique({
        where: { matricule: session.user.id },
    });

    return await prisma.technicien.findMany({
        where: {
            employe: {
                numeroAgence: user?.numeroAgence
            }
        },
        include: {
            employe: true
        }
    });
}

/**
 * Création d'un nouveau client.
 */
export async function createClient(data: {
  raisonSociale: string;
  siren: string;
  codeApe: string;
  adresse: string;
  telephoneClient: string;
  email: string;
  longitude?: number;
  latitude?: number;
  distanceKM: number;
  dureeDeplacement: number;
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "GESTIONNAIRE") throw new Error("Non autorisé");

  const gestionnaire = await prisma.employe.findUnique({
    where: { matricule: session.user.id },
  });
  if (!gestionnaire) throw new Error("Gestionnaire non trouvé");

  return prisma.client.create({
    data: {
      ...data,
      numeroAgence: gestionnaire.numeroAgence,
    },
  });
}

/**
 * Récupérer l'historique complet des interventions pour un client.
 */
export async function getClientInterventions(clientId: number) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "GESTIONNAIRE") throw new Error("Non autorisé");

  return prisma.intervention.findMany({
    where: { numeroClient: clientId },
    include: {
      technicien: { include: { employe: true } },
      controles: { include: { materiel: { include: { typeMateriel: true } } } },
    },
    orderBy: { dateVisite: "desc" },
  });
}

/**
 * Récupérer tout le parc matériel d'un client.
 */
export async function getClientMaterials(clientId: number) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "GESTIONNAIRE") throw new Error("Non autorisé");
  
    return prisma.materiel.findMany({
      where: { numeroClient: clientId },
      include: {
        typeMateriel: true,
        contrat: true,
      },
      orderBy: { dateInstallation: "desc" },
    });
}

/**
 * Statistiques hebdomadaires pour les graphiques.
 */
export async function getWeeklyStats() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "GESTIONNAIRE") throw new Error("Non autorisé");

    const user = await prisma.employe.findUnique({
        where: { matricule: session.user.id },
    });

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 7);

    const interventions = await prisma.intervention.findMany({
      where: {
        client: { numeroAgence: user?.numeroAgence },
        dateVisite: { gte: start, lte: end },
      },
      select: { dateVisite: true },
    });

    // Agréger par jour
    const stats: Record<string, number> = {};
    for (let i = 0; i <= 7; i++) {
        const d = new Date();
        d.setDate(end.getDate() - i);
        const dayStr = d.toLocaleDateString("fr-FR", { weekday: 'short' });
        stats[dayStr] = 0;
    }

    interventions.forEach(i => {
        const dayStr = new Date(i.dateVisite).toLocaleDateString("fr-FR", { weekday: 'short' });
        if (stats[dayStr] !== undefined) stats[dayStr]++;
    });

    return Object.entries(stats).reverse().map(([day, count]) => ({ day, count }));
}
