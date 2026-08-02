import { describe, expect, it } from "vitest";
import { mapProspectRow } from "@/lib/prospects/queries";

describe("mapProspectRow", () => {
  it("maps a database row to the Prospect contract", () => {
    const row = {
      id: "prospect-1",
      user_id: "user-1",
      contact_name: "Amanda Shepherd",
      company_name: "Voda Cleaning",
      role: "Owner",
      phone: null,
      email: "amanda@example.com",
      website: null,
      linkedin_url: null,
      notes: null,
      relationship_type: "prospect" as const,
      pipeline_status: "new" as const,
      opportunity_score: null,
      last_contact_at: null,
      next_action: null,
      follow_up_at: null,
      business_card_image_path: null,
      created_at: "2026-08-02T12:00:00.000Z",
      updated_at: "2026-08-02T12:00:00.000Z",
    };

    expect(mapProspectRow(row)).toEqual({
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
      relationshipType: "prospect",
      pipelineStatus: "new",
      opportunityScore: null,
      lastContactAt: null,
      nextAction: null,
      followUpAt: null,
      businessCardImagePath: null,
      createdAt: "2026-08-02T12:00:00.000Z",
      updatedAt: "2026-08-02T12:00:00.000Z",
    });
  });
});
