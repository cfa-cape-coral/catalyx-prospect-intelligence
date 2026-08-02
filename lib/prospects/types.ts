import type { PipelineStatus, RelationshipType } from "./constants";

export type Prospect = {
  id: string;
  userId: string;
  contactName: string;
  companyName: string;
  role: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  linkedinUrl: string | null;
  notes: string | null;
  relationshipType: RelationshipType;
  pipelineStatus: PipelineStatus;
  opportunityScore: number | null;
  lastContactAt: string | null;
  nextAction: string | null;
  followUpAt: string | null;
  businessCardImagePath: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProspectSummary = Pick<
  Prospect,
  | "id"
  | "contactName"
  | "companyName"
  | "role"
  | "pipelineStatus"
  | "opportunityScore"
  | "nextAction"
  | "followUpAt"
  | "createdAt"
>;
