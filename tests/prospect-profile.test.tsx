import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ProspectProfilePage from "@/app/prospects/[prospectId]/page";

vi.mock("@/lib/prospects/queries", () => ({
  getProspectById: vi.fn(async () => ({
    id: "prospect-123",
    userId: "user-1",
    contactName: "Amanda Shepherd",
    companyName: "Voda Cleaning",
    role: "Owner",
    phone: null,
    email: "amanda@example.com",
    website: null,
    linkedinUrl: null,
    notes: null,
    relationshipType: "prospect",
    pipelineStatus: "new",
    opportunityScore: null,
    lastContactAt: null,
    nextAction: null,
    followUpAt: null,
    businessCardImagePath: null,
    createdAt: "2026-08-02T12:00:00.000Z",
    updatedAt: "2026-08-02T12:00:00.000Z",
  })),
}));

vi.mock("@/app/prospects/actions", () => ({
  updatePipelineStatus: vi.fn(),
}));

describe("ProspectProfilePage", () => {
  it("renders the saved profile and approved future sections", async () => {
    const page = await ProspectProfilePage({
      params: Promise.resolve({ prospectId: "prospect-123" }),
    });

    render(page);

    expect(
      screen.getByRole("heading", { name: "Amanda Shepherd" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Research")).toBeInTheDocument();
    expect(screen.getByText("Bottlenecks")).toBeInTheDocument();
    expect(screen.getByText("Opportunities")).toBeInTheDocument();
    expect(screen.getByText("Questions")).toBeInTheDocument();
    expect(screen.getByText("Audit")).toBeInTheDocument();
    expect(screen.getByText("Outreach")).toBeInTheDocument();
    expect(screen.getByText("Sources")).toBeInTheDocument();
    expect(screen.getByText("Timeline")).toBeInTheDocument();
  });
});
