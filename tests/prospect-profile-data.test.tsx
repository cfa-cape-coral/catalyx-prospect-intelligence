import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProspectProfilePage from "@/app/prospects/[prospectId]/page";

const { getProspectById, notFound } = vi.hoisted(() => ({
  getProspectById: vi.fn(),
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("@/lib/prospects/queries", () => ({
  getProspectById,
}));

vi.mock("next/navigation", () => ({
  notFound,
}));

vi.mock("@/app/prospects/actions", () => ({
  updatePipelineStatus: vi.fn(),
}));

const prospect = {
  id: "prospect-1",
  userId: "user-1",
  contactName: "Amanda Shepherd",
  companyName: "Voda Cleaning",
  role: "Owner",
  phone: null,
  email: "amanda@example.com",
  website: null,
  linkedinUrl: null,
  notes: null,
  relationshipType: "prospect" as const,
  pipelineStatus: "new" as const,
  opportunityScore: null,
  lastContactAt: null,
  nextAction: null,
  followUpAt: null,
  businessCardImagePath: null,
  createdAt: "2026-08-02T12:00:00.000Z",
  updatedAt: "2026-08-02T12:00:00.000Z",
};

describe("ProspectProfilePage", () => {
  beforeEach(() => {
    getProspectById.mockReset();
    notFound.mockClear();
  });

  it("renders saved prospect data", async () => {
    getProspectById.mockResolvedValue(prospect);

    render(
      await ProspectProfilePage({
        params: Promise.resolve({ prospectId: "prospect-1" }),
      }),
    );

    expect(
      screen.getByRole("heading", { name: "Amanda Shepherd" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Voda Cleaning")).toBeInTheDocument();
    expect(screen.getByText("Owner")).toBeInTheDocument();
    expect(screen.getAllByText("New").length).toBeGreaterThan(0);
  });

  it("uses the not-found response for an unknown prospect", async () => {
    getProspectById.mockResolvedValue(null);

    await expect(
      ProspectProfilePage({
        params: Promise.resolve({ prospectId: "missing-prospect" }),
      }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalledOnce();
  });
});
