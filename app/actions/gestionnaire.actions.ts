"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export async function getGestionnaireStats(targetMonth?: number, targetYear?: number) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "GESTIONNAIRE") {
    throw new Error("Non autorisé");
  }

  // Récupérer l'agence du gestionnaire
  const user = await prisma.employe.findUnique({
    where: { matricule: session.user.id },
    select: { numeroAgence: true },
  });

  // On vérifie si l'utilisateur existe avant de continuer
  if (!user) {
    throw new Error("Employé gestionnaire non trouvé");
  }

  const now = new Date();
  const month = targetMonth || (now.getMonth() + 1);
  const year = targetYear || now.getFullYear();

  // Définition des bornes du mois en UTC pour une cohérence parfaite avec le graphique
  const startDate = new Date(Date.UTC(year, month - 1, 1));
  const endDate = new Date(Date.UTC(year, month, 1));

  const interventions = await prisma.intervention.findMany({
    where: {
      client: { numeroAgence: user.numeroAgence },
      dateVisite: {
        gte: startDate,
        lt: endDate,
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

export async function getClientsWithMaterials() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "GESTIONNAIRE") {
    throw new Error("Non autorisé");
  }

  const user = await prisma.employe.findUnique({
    where: { matricule: session.user.id },
  });

  if (!user) throw new Error("Employé non trouvé");

  const clients = await prisma.client.findMany({
    where: { numeroAgence: user.numeroAgence },
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

  // Sérialisation des Decimal pour Next.js Client Components
  return clients.map(client => ({
    ...client,
    materiels: client.materiels.map(mat => ({
        ...mat,
        prixVente: mat.prixVente.toNumber()
    }))
  }));
}

export async function getTechniciansByAgency() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "GESTIONNAIRE") {
      throw new Error("Non autorisé");
    }

    const user = await prisma.employe.findUnique({
        where: { matricule: session.user.id },
    });

    if (!user) throw new Error("Employé non trouvé");

    return await prisma.technicien.findMany({
        where: {
            employe: {
                numeroAgence: user.numeroAgence
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

  const interventions = await prisma.intervention.findMany({
    where: { numeroClient: clientId },
    include: {
      technicien: { include: { employe: true } },
      controles: { include: { materiel: { include: { typeMateriel: true } } } },
    },
    orderBy: { dateVisite: "desc" },
  });

  return interventions.map(inter => ({
    ...inter,
    controles: inter.controles.map(ctrl => ({
        ...ctrl,
        materiel: {
            ...ctrl.materiel,
            prixVente: ctrl.materiel.prixVente.toNumber()
        }
    }))
  }));
}

/**
 * Récupérer tout le parc matériel d'un client.
 */
export async function getClientMaterials(clientId: number) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "GESTIONNAIRE") throw new Error("Non autorisé");
  
    const materials = await prisma.materiel.findMany({
      where: { numeroClient: clientId },
      include: {
        typeMateriel: true,
        contrat: true,
      },
      orderBy: { dateInstallation: "desc" },
    });

    return materials.map(mat => ({
        ...mat,
        prixVente: mat.prixVente.toNumber()
    }));
}

/**
 * Statistiques hebdomadaires pour les graphiques.
 */
/**
 * Statistiques d'activité pour les graphiques, adaptées au mois sélectionné.
 */
export async function getMonthlyActivity(targetMonth?: number, targetYear?: number) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "GESTIONNAIRE") throw new Error("Non autorisé");

    const user = await prisma.employe.findUnique({
        where: { matricule: session.user.id },
    });

    if (!user) throw new Error("Employé non trouvé");

    const now = new Date();
    const month = targetMonth || (now.getMonth() + 1);
    const year = targetYear || now.getFullYear();

    // Début et fin du mois
    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 1));

    const interventions = await prisma.intervention.findMany({
      where: {
        client: { numeroAgence: user.numeroAgence },
        dateVisite: { gte: start, lt: end },
      },
      select: { dateVisite: true },
    });

    // Agréger par jour pour tout le mois
    const daysInMonth = new Date(year, month, 0).getDate();
    const stats: Record<string, number> = {};
    
    // On initialise tous les jours du mois à 0
    for (let i = 1; i <= daysInMonth; i++) {
        const d = new Date(year, month - 1, i);
        const dayKey = d.toLocaleDateString("fr-FR", { day: 'numeric', month: 'short' });
        stats[dayKey] = 0;
    }

    interventions.forEach(i => {
        const dayKey = new Date(i.dateVisite).toLocaleDateString("fr-FR", { day: 'numeric', month: 'short' });
        if (stats[dayKey] !== undefined) stats[dayKey]++;
    });

    return Object.entries(stats).map(([day, count]) => ({ day, count }));
}
