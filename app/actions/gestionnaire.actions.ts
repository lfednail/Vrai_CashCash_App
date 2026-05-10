"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";


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

/**
 * Récupère tous les types de matériel disponibles.
 */
export async function getTypeMateriels() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "GESTIONNAIRE") throw new Error("Non autorisé");

  return prisma.typeMateriel.findMany({
    include: {
      famille: true,
    },
    orderBy: {
      libelleTypeMateriel: "asc",
    },
  });
}

/**
 * Récupère tous les types de contrat disponibles.
 */
export async function getTypeContrats() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "GESTIONNAIRE") throw new Error("Non autorisé");

  const contrats = await prisma.typeContrat.findMany({
    orderBy: {
      refTypeContrat: "asc",
    },
  });

  return contrats.map(c => ({
    ...c,
    tauxApplicable: c.tauxApplicable.toNumber()
  }));
}

/**
 * Création d'un client avec son parc matériel et ses contrats en une seule transaction.
 */
export async function createFullClient(
  clientData: any,
  materielsData: any[],
  contratsData: any[]
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "GESTIONNAIRE") throw new Error("Non autorisé");

  const gestionnaire = await prisma.employe.findUnique({
    where: { matricule: session.user.id },
  });
  if (!gestionnaire) throw new Error("Gestionnaire non trouvé");

  return prisma.$transaction(async (tx) => {
    // 1. Créer le client
    const client = await tx.client.create({
      data: {
        ...clientData,
        numeroAgence: gestionnaire.numeroAgence,
      },
    });

    // 2. Créer les contrats
    const createdContrats = [];
    for (const contrat of contratsData) {
      const newContrat = await tx.contratMaintenance.create({
        data: {
          ...contrat,
          numeroClient: client.numeroClient,
          dateSignature: new Date(contrat.dateSignature),
          dateEcheance: new Date(contrat.dateEcheance),
        },
      });
      createdContrats.push(newContrat);
    }

    // 3. Créer le matériel
    for (const mat of materielsData) {
      // On associe le matériel au premier contrat créé si applicable
      // (On pourrait faire plus complexe si besoin, mais restons simple pour l'instant)
      // Souvent un matériel est lié à un contrat spécifique.
      // Si on a un seul contrat, on l'associe à tous les matériels.
      const contratId = createdContrats.length > 0 ? createdContrats[0].numeroContrat : null;

      await tx.materiel.create({
        data: {
          ...mat,
          numeroClient: client.numeroClient,
          numeroContrat: contratId,
          dateVente: new Date(mat.dateVente),
          dateInstallation: new Date(mat.dateInstallation),
          prixVente: Number(mat.prixVente),
        },
      });
    }

    return client;
  });
}

/**
 * Supprime un client et toutes ses données associées (Cascade).
 */
export async function deleteClient(clientId: number) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "GESTIONNAIRE") throw new Error("Non autorisé");

  return prisma.client.delete({
    where: { numeroClient: clientId },
  });
}

/**
 * Met à jour les informations d'un client.
 */
export async function updateClient(clientId: number, data: any) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "GESTIONNAIRE") throw new Error("Non autorisé");

  return prisma.client.update({
    where: { numeroClient: clientId },
    data,
  });
}

/**
 * Création d'un Technicien (Employé + Technicien)
 */
export async function createTechnicien(data: any) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "GESTIONNAIRE") throw new Error("Non autorisé");

  const gestionnaire = await prisma.employe.findUnique({
    where: { matricule: session.user.id },
  });
  if (!gestionnaire) throw new Error("Gestionnaire non trouvé");

  const hashedPassword = await bcrypt.hash(data.mot_de_passe, 10);

  return prisma.$transaction(async (tx) => {
    const employe = await tx.employe.create({
      data: {
        matricule: data.matricule,
        nomEmploye: data.nomEmploye,
        prenomEmploye: data.prenomEmploye,
        adresseEmploye: data.adresseEmploye,
        dateEmbauche: new Date(data.dateEmbauche),
        numeroAgence: gestionnaire.numeroAgence,
        email: data.email,
        mot_de_passe: hashedPassword,
        role: "TECHNICIEN",
      },
    });

    const technicien = await tx.technicien.create({
      data: {
        matricule: data.matricule,
        telephoneMobile: data.telephoneMobile,
        qualification: data.qualification,
        dateObtention: data.dateObtention ? new Date(data.dateObtention) : null,
      },
    });

    return { employe, technicien };
  });
}

/**
 * Mise à jour d'un Technicien
 */
export async function updateTechnicien(matricule: string, data: any) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "GESTIONNAIRE") throw new Error("Non autorisé");

  return prisma.$transaction(async (tx) => {
    const employe = await tx.employe.update({
      where: { matricule },
      data: {
        nomEmploye: data.nomEmploye,
        prenomEmploye: data.prenomEmploye,
        adresseEmploye: data.adresseEmploye,
        email: data.email,
      },
    });

    const technicien = await tx.technicien.update({
      where: { matricule },
      data: {
        telephoneMobile: data.telephoneMobile,
        qualification: data.qualification,
        dateObtention: data.dateObtention ? new Date(data.dateObtention) : null,
      },
    });

    return { employe, technicien };
  });
}

/**
 * Supprime un technicien (supprime l'employé associé et le technicien en cascade)
 */
export async function deleteTechnicien(matricule: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "GESTIONNAIRE") throw new Error("Non autorisé");

  return prisma.employe.delete({
    where: { matricule },
  });
}
