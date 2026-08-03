import { describe, expect, it } from "vitest";
import { calculateDashboardMetrics } from "@/lib/dashboard/metrics";

describe("calculateDashboardMetrics", () => {
  it("calculates the approved dashboard groups", () => {
    const metrics = calculateDashboardMetrics([
      "new",
      "researching",
      "ready_to_contact",
      "contacted",
      "meeting_booked",
      "proposal_sent",
      "won",
    ]);

    expect(metrics).toEqual({
      total: 7,
      researching: 1,
      readyToContact: 1,
      waitingForReply: 1,
      meetingsBooked: 1,
      proposalsSent: 1,
      wonClients: 1,
    });
  });
});
