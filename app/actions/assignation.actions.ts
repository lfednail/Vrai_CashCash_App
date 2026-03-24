"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { revalidatePath } from "next/cache";

export async function createIntervention(data: {
  numeroClient: number;
  matriculeTechnicien: string;
  dateVisite: string;
  heureVisite: string;
  materiels: string[];
}) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "GESTIONNAIRE") {
    throw new Error("Non autorisé");
  }

  // 1. Vérifier que le technicien et le client sont dans la même agence (Règle métier)
  const [tech, client] = await Promise.all([
    prisma.employe.findUnique({ where: { matricule: data.matriculeTechnicien }, select: { numeroAgence: true } }),
    prisma.client.findUnique({ where: { numeroClient: data.numeroClient }, select: { numeroAgence: true } })
  ]);

  if (!tech || !client || tech.numeroAgence !== client.numeroAgence) {
    throw new Error("Le technicien et le client doivent appartenir à la même agence.");
  }

  // 2. Création de l'intervention
  const intervention = await prisma.intervention.create({
    data: {
      numeroClient: data.numeroClient,
      matriculeTechnicien: data.matriculeTechnicien,
      dateVisite: new Date(data.dateVisite),
      heureVisite: new Date(`1970-01-01T${data.heureVisite}:00`),
      controles: {
        create: data.materiels.map(sn => ({
          numeroSerieMateriel: sn
        }))
      }
    }
  });

  revalidatePath("/gestionnaire");
  return { success: true, id: intervention.numeroIntervent };
}
