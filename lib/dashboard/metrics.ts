import type { PipelineStatus } from "@/lib/prospects/constants";

export type DashboardMetrics = {
  total: number;
  researching: number;
  readyToContact: number;
  waitingForReply: number;
  meetingsBooked: number;
  proposalsSent: number;
  wonClients: number;
};

export function calculateDashboardMetrics(
  statuses: PipelineStatus[],
): DashboardMetrics {
  const count = (status: PipelineStatus) =>
    statuses.filter((value) => value === status).length;

  return {
    total: statuses.length,
    researching: count("researching"),
    readyToContact: count("ready_to_contact"),
    waitingForReply: count("contacted"),
    meetingsBooked: count("meeting_booked"),
    proposalsSent: count("proposal_sent"),
    wonClients: count("won"),
  };
}
