import { createIntervention } from "@/app/actions/assignation.actions";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

describe("Business Rules Integration Tests", () => {
  it("should fail to create intervention if tech and client are in different agencies", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: "GEST001", role: "GESTIONNAIRE" },
    });

    // We know TECH001 is Agency 1
    // Let's find a client in Agency 2 (Lyon)
    const clientAgency2 = await prisma.client.findFirst({
      where: { numeroAgence: 2 },
    });

    if (clientAgency2) {
      await expect(createIntervention({
        numeroClient: clientAgency2.numeroClient,
        matriculeTechnicien: "TECH001",
        dateVisite: "2026-05-01",
        heureVisite: "10:00",
        materiels: []
      })).rejects.toThrow("Le technicien et le client doivent appartenir à la même agence.");
    } else {
      console.warn("Skipping test: No client found in Agency 2");
    }
  });

  it("should succeed to create intervention if tech and client are in the same agency", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: "GEST001", role: "GESTIONNAIRE" },
    });

    // TECH001 is Agency 1
    const clientAgency1 = await prisma.client.findFirst({
      where: { numeroAgence: 1 },
      include: { materiels: true }
    });

    if (clientAgency1 && clientAgency1.materiels.length > 0) {
      const result = await createIntervention({
        numeroClient: clientAgency1.numeroClient,
        matriculeTechnicien: "TECH001",
        dateVisite: "2026-06-01",
        heureVisite: "14:00",
        materiels: [clientAgency1.materiels[0].numeroSerie]
      });

      expect(result.success).toBe(true);
      
      // Clean up the created test intervention
      await prisma.controler.deleteMany({ where: { numeroIntervent: result.id } });
      await prisma.intervention.delete({ where: { numeroIntervent: result.id } });
    }
  });
});
