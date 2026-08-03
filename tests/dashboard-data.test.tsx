import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DashboardPage from "@/app/dashboard/page";

const { getAllProspectStatuses, getRecentProspects } = vi.hoisted(() => ({
  getAllProspectStatuses: vi.fn(),
  getRecentProspects: vi.fn(),
}));

vi.mock("@/lib/auth/require-user", () => ({
  requireUser: vi.fn(async () => ({ id: "user-1" })),
}));

vi.mock("@/lib/prospects/queries", () => ({
  getAllProspectStatuses,
  getRecentProspects,
}));

describe("DashboardPage", () => {
  it("renders live metrics and a recent prospect link", async () => {
    getAllProspectStatuses.mockResolvedValue([
      "new",
      "researching",
      "ready_to_contact",
      "contacted",
      "meeting_booked",
      "proposal_sent",
      "won",
    ]);
    getRecentProspects.mockResolvedValue([
      {
        id: "prospect-1",
        contactName: "Amanda Shepherd",
        companyName: "Voda Cleaning",
        role: "Owner",
        pipelineStatus: "new",
        opportunityScore: null,
        nextAction: null,
        followUpAt: null,
        createdAt: "2026-08-02T12:00:00.000Z",
      },
    ]);

    render(await DashboardPage());

    const labels = [
      "Total prospects",
      "Researching",
      "Ready to contact",
      "Waiting for reply",
      "Meetings booked",
      "Proposals sent",
      "Won clients",
    ];

    labels.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });

    expect(screen.getByRole("link", { name: "Voda Cleaning" })).toHaveAttribute(
      "href",
      "/prospects/prospect-1",
    );
  });
});
