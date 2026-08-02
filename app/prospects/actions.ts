"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createProspectSchema } from "@/lib/prospects/schema";
import { requireUser } from "@/lib/auth/require-user";
import { createClient } from "@/lib/supabase/server";

export type CreateProspectState = {
  formError: string | null;
  fieldErrors: Partial<
    Record<"contactName" | "companyName" | "email", string>
  >;
};

export async function createProspect(
  _previousState: CreateProspectState,
  formData: FormData,
): Promise<CreateProspectState> {
  const user = await requireUser();
  const result = createProspectSchema.safeParse({
    contactName: String(formData.get("contactName") ?? ""),
    companyName: String(formData.get("companyName") ?? ""),
    role: String(formData.get("role") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    website: String(formData.get("website") ?? ""),
    linkedinUrl: String(formData.get("linkedinUrl") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    relationshipType: String(formData.get("relationshipType") ?? ""),
  });

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;

    return {
      formError: null,
      fieldErrors: {
        contactName: errors.contactName?.[0],
        companyName: errors.companyName?.[0],
        email: errors.email?.[0],
      },
    };
  }

  const supabase = await createClient();
  const { data: prospect, error } = await supabase
    .from("prospects")
    .insert({
      user_id: user.id,
      contact_name: result.data.contactName,
      company_name: result.data.companyName,
      role: result.data.role,
      phone: result.data.phone,
      email: result.data.email,
      website: result.data.website,
      linkedin_url: result.data.linkedinUrl,
      notes: result.data.notes,
      relationship_type: result.data.relationshipType,
      pipeline_status: "new",
    })
    .select("id")
    .single();

  if (error || !prospect) {
    return {
      formError: "Unable to save the prospect. Try again.",
      fieldErrors: {},
    };
  }

  const { error: timelineError } = await supabase
    .from("timeline_events")
    .insert({
      prospect_id: prospect.id,
      user_id: user.id,
      event_type: "prospect_created",
      title: "Prospect created",
    });

  if (timelineError) {
    console.error("Unable to create prospect timeline event", timelineError);
  }

  revalidatePath("/dashboard");
  redirect(`/prospects/${prospect.id}`);
}
