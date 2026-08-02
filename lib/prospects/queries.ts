import { requireUser } from "@/lib/auth/require-user";
import { createClient } from "@/lib/supabase/server";
import type { PipelineStatus, RelationshipType } from "./constants";
import type { Prospect, ProspectSummary } from "./types";

export type ProspectRow = {
  id: string;
  user_id: string;
  contact_name: string;
  company_name: string;
  role: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  linkedin_url: string | null;
  notes: string | null;
  relationship_type: RelationshipType;
  pipeline_status: PipelineStatus;
  opportunity_score: number | null;
  last_contact_at: string | null;
  next_action: string | null;
  follow_up_at: string | null;
  business_card_image_path: string | null;
  created_at: string;
  updated_at: string;
};

export function mapProspectRow(row: ProspectRow): Prospect {
  return {
    id: row.id,
    userId: row.user_id,
    contactName: row.contact_name,
    companyName: row.company_name,
    role: row.role,
    phone: row.phone,
    email: row.email,
    website: row.website,
    linkedinUrl: row.linkedin_url,
    notes: row.notes,
    relationshipType: row.relationship_type,
    pipelineStatus: row.pipeline_status,
    opportunityScore: row.opportunity_score,
    lastContactAt: row.last_contact_at,
    nextAction: row.next_action,
    followUpAt: row.follow_up_at,
    businessCardImagePath: row.business_card_image_path,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getProspectById(
  prospectId: string,
): Promise<Prospect | null> {
  const user = await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("prospects")
    .select("*")
    .eq("user_id", user.id)
    .eq("id", prospectId)
    .maybeSingle();

  if (error) {
    throw new Error("Unable to load prospects");
  }

  return data ? mapProspectRow(data as ProspectRow) : null;
}

export async function getRecentProspects(
  limit = 10,
): Promise<ProspectSummary[]> {
  const user = await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("prospects")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error("Unable to load prospects");
  }

  return ((data ?? []) as ProspectRow[]).map(mapProspectRow);
}

export async function getAllProspectStatuses(): Promise<PipelineStatus[]> {
  const user = await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("prospects")
    .select("pipeline_status")
    .eq("user_id", user.id);

  if (error) {
    throw new Error("Unable to load prospects");
  }

  return (data ?? []).map(({ pipeline_status }) =>
    pipeline_status as PipelineStatus,
  );
}
