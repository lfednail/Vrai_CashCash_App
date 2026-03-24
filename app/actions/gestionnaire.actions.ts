import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export async function getGestionnaireStats() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "GESTIONNAIRE") {
    throw new Error("Non autorisé");
  }

  // Récupérer l'agence du gestionnaire
  const user = await prisma.employe.findUnique({
    where: { matricule: (session.user as any).id },
    select: { numeroAgence: true },
  });

  if (!user) throw new Error("Utilisateur non trouvé");

  const now = new Date();
  const month = now.getMonth() + 1; // JS months are 0-indexed
  const year = now.getFullYear();

  // On utilise une requête brute pour appeler la procédure stockée si elle existe, 
  // ou on simule l'agrégation avec Prisma pour plus de portabilité dans le code TS.
  // Ici, on fait les deux pour démontrer la capacité à utiliser du SQL brut.
  
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
  if (!session || (session.user as any).role !== "GESTIONNAIRE") {
    throw new Error("Non autorisé");
  }

  const user = await prisma.employe.findUnique({
    where: { matricule: (session.user as any).id },
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
    if (!session || (session.user as any).role !== "GESTIONNAIRE") {
      throw new Error("Non autorisé");
    }

    const user = await prisma.employe.findUnique({
        where: { matricule: (session.user as any).id },
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
