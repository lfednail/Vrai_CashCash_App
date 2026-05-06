import { getGestionnaireStats } from "@/app/actions/gestionnaire.actions";
import { getServerSession } from "next-auth";

// Only mock next-auth, let Prisma use the real DB
jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

describe("Gestionnaire Integration Tests (Real DB)", () => {
  it("should retrieve real stats for GEST001", async () => {
    // Mock the session with a real user matricule from the DB
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: "GEST001", role: "GESTIONNAIRE" },
    });

    const stats = await getGestionnaireStats();

    console.log("Real DB Stats for GEST001:", stats);
    
    expect(stats).toBeDefined();
    expect(stats).toHaveProperty("total_interventions");
    expect(stats).toHaveProperty("distance_parcourue_km");
    expect(stats).toHaveProperty("temps_total_minutes");
    
    // We expect at least 0 or some numbers since it's real data
    expect(typeof stats.total_interventions).toBe("number");
  });
});
