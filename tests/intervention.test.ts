import { getTechnicianInterventions } from "@/app/actions/intervention.actions";
import { getServerSession } from "next-auth";

// Only mock next-auth
jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

describe("Intervention Integration Tests (Real DB)", () => {
  it("should retrieve real interventions for TECH001", async () => {
    // Mock the session with a real technician matricule from the DB
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: "TECH001", role: "TECHNICIEN" },
    });

    const interventions = await getTechnicianInterventions();

    console.log(`Retrieved ${interventions.length} interventions for TECH001`);
    
    expect(Array.isArray(interventions)).toBe(true);
    if (interventions.length > 0) {
      expect(interventions[0]).toHaveProperty("matriculeTechnicien", "TECH001");
      expect(interventions[0]).toHaveProperty("client");
    }
  });
});
