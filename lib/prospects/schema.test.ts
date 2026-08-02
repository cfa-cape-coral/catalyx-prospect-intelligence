import { describe, expect, it } from "vitest";
import { createProspectSchema } from "@/lib/prospects/schema";

describe("createProspectSchema", () => {
  it("requires contact and company names", () => {
    const result = createProspectSchema.safeParse({
      contactName: "",
      companyName: "",
      role: "",
      phone: "",
      email: "",
      website: "",
      linkedinUrl: "",
      notes: "",
      relationshipType: "prospect",
    });

    expect(result.success).toBe(false);
  });

  it("normalizes optional empty strings to null", () => {
    const result = createProspectSchema.parse({
      contactName: " Amanda Shepherd ",
      companyName: " Voda Cleaning ",
      role: "",
      phone: "",
      email: "",
      website: "",
      linkedinUrl: "",
      notes: "",
      relationshipType: "prospect",
    });

    expect(result).toEqual({
      contactName: "Amanda Shepherd",
      companyName: "Voda Cleaning",
      role: null,
      phone: null,
      email: null,
      website: null,
      linkedinUrl: null,
      notes: null,
      relationshipType: "prospect",
    });
  });
});
