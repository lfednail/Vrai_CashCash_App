import { searchClients } from "@/app/actions/client.actions";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

describe("Client Actions Integration Tests", () => {
  it("should find clients by name for a technician in the same agency", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: "TECH001", role: "TECHNICIEN" },
    });

    // TECH001 is Agency 1 (Paris)
    // We expect to find "Hypermarché" in Paris
    const results = await searchClients("Hyper");

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].raisonSociale).toContain("Hypermarché");
    expect(results[0].numeroAgence).toBe(1);
  });

  it("should not find clients from other agencies", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: "TECH001", role: "TECHNICIEN" },
    });

    // We search for "Centre Commercial" which is in Agency 2 (Lyon)
    const results = await searchClients("Part-Dieu");

    expect(results.length).toBe(0);
  });
});
