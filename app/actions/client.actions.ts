"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Recherche des clients appartenant à l'agence du technicien connecté.
 * Filtre par raison sociale, SIREN ou numéro client.
 */
export async function searchClients(query: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "TECHNICIEN") {
    throw new Error("Non autorisé");
  }

  const matricule = session.user.id;
  const employe = await prisma.employe.findUnique({
    where: { matricule },
    select: { numeroAgence: true },
  });

  if (!employe) throw new Error("Employé non trouvé");

  const trimmed = query.trim();
  if (!trimmed) return [];

  return prisma.client.findMany({
    where: {
      numeroAgence: employe.numeroAgence,
      OR: [
        { raisonSociale: { contains: trimmed } },
        { siren:         { contains: trimmed } },
        {
          numeroClient: isNaN(Number(trimmed)) ? undefined : Number(trimmed),
        },
      ],
    },
    include: {
      materiels: {
        include: { typeMateriel: true },
        take: 5,
      },
      interventions: {
        orderBy: { dateVisite: "desc" },
        take: 3,
      },
    },
    take: 20,
  });
}

export async function getClientDetails(numeroClient: number) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "TECHNICIEN") {
    throw new Error("Non autorisé");
  }

  return prisma.client.findUnique({
    where: { numeroClient },
    include: {
      materiels: {
        include: { typeMateriel: true },
      },
      interventions: {
        include: {
           controles: true
        },
        orderBy: { dateVisite: "desc" },
      },
    },
  });
}
