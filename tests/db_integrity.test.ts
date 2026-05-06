import prisma from "@/lib/prisma";

describe("Database Integrity (SQL Triggers)", () => {
  it("should block intervention on material without contract (Trigger: check_intervention_contrat)", async () => {
    // 1. Create a dummy intervention
    const client = await prisma.client.findFirst();
    const tech = await prisma.technicien.findFirst({
        where: { employe: { numeroAgence: client?.numeroAgence } }
    });
    
    const intervention = await prisma.intervention.create({
        data: {
            dateVisite: new Date(),
            heureVisite: new Date(),
            matriculeTechnicien: tech!.matricule,
            numeroClient: client!.numeroClient
        }
    });

    // 2. Find or create a material without contract
    let materialNoContract = await prisma.materiel.findFirst({
        where: { numeroContrat: null }
    });

    if (!materialNoContract) {
        // Create one for the test
        materialNoContract = await prisma.materiel.create({
            data: {
                numeroSerie: "SN-TEST-NO-CONTRACT",
                dateVente: new Date(),
                dateInstallation: new Date(),
                prixVente: 100,
                emplacement: "Test",
                referenceInterneTypeMateriel: "TM-CAISSE",
                numeroClient: client!.numeroClient,
                numeroContrat: null
            }
        });
    }

    // 3. Try to add a control for this material
    // This should be blocked by the TRIGGER in MySQL
    try {
        await prisma.controler.create({
            data: {
                numeroIntervent: intervention.numeroIntervent,
                numeroSerieMateriel: materialNoContract.numeroSerie,
                tempsPasse: 10,
                commentaire: "Should fail"
            }
        });
        // If we reach here, the test failed
        throw new Error("Trigger did not block the insertion!");
    } catch (error: any) {
        // We expect a SQL error from the trigger
        expect(error.message).toContain("Règle stricte: Impossible d intervenir sur un matériel qui n est sous aucun contrat de maintenance.");
    }

    // Clean up
    await prisma.intervention.delete({ where: { numeroIntervent: intervention.numeroIntervent } });
    if (materialNoContract.numeroSerie === "SN-TEST-NO-CONTRACT") {
        await prisma.materiel.delete({ where: { numeroSerie: materialNoContract.numeroSerie } });
    }
  });

  it("should block intervention if tech and client agence differ (Trigger: check_technicien_agence)", async () => {
      const clientAgency1 = await prisma.client.findFirst({ where: { numeroAgence: 1 } });
      const techAgency2 = await prisma.technicien.findFirst({ where: { employe: { numeroAgence: 2 } } });

      try {
          await prisma.intervention.create({
              data: {
                  dateVisite: new Date(),
                  heureVisite: new Date(),
                  matriculeTechnicien: techAgency2!.matricule,
                  numeroClient: clientAgency1!.numeroClient
              }
          });
          throw new Error("Trigger did not block the insertion!");
      } catch (error: any) {
          expect(error.message).toContain("Règle stricte: Le technicien et le client doivent appartenir à la même agence.");
      }
  });
});
