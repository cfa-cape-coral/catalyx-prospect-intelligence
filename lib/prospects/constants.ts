export const relationshipTypes = [
  "prospect",
  "partner",
  "referral",
  "supplier",
] as const;

export const pipelineStatuses = [
  "new",
  "researching",
  "research_complete",
  "ready_to_contact",
  "contacted",
  "replied",
  "meeting_booked",
  "audit_complete",
  "proposal_sent",
  "won",
  "lost",
  "partner",
] as const;

export const pipelineStatusLabels: Record<PipelineStatus, string> = {
  new: "New",
  researching: "Researching",
  research_complete: "Research complete",
  ready_to_contact: "Ready to contact",
  contacted: "Contacted",
  replied: "Replied",
  meeting_booked: "Meeting booked",
  audit_complete: "Audit complete",
  proposal_sent: "Proposal sent",
  won: "Won",
  lost: "Lost",
  partner: "Partner",
};

export type RelationshipType = (typeof relationshipTypes)[number];
export type PipelineStatus = (typeof pipelineStatuses)[number];
