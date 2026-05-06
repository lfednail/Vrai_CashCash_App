"use server";

import { serializePrisma } from "@/lib/serialization";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { revalidatePath } from "next/cache";

export async function getTechnicianInterventions() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "TECHNICIEN") {
    throw new Error("Non autorisé");
  }

  const matricule = session.user.id;

  const interventions = await prisma.intervention.findMany({
    where: { matriculeTechnicien: matricule },
    include: {
      client: true,
      controles: {
        include: {
          materiel: true,
        },
      },
    },
    orderBy: {
      dateVisite: "desc",
    },
  });

  return serializePrisma(interventions);
}

export async function validateIntervention(
  numeroIntervent: number,
  controles: { numeroSerieMateriel: string; tempsPasse: number; commentaire: string }[]
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "TECHNICIEN") {
    throw new Error("Non autorisé");
  }

  // Mise à jour de chaque contrôle
  for (const controle of controles) {
    await prisma.controler.update({
      where: {
        numeroIntervent_numeroSerieMateriel: {
          numeroIntervent,
          numeroSerieMateriel: controle.numeroSerieMateriel,
        },
      },
      data: {
        tempsPasse: controle.tempsPasse,
        commentaire: controle.commentaire,
      },
    });
  }

  revalidatePath("/technicien", "layout");
  return { success: true };
}
