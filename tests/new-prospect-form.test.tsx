import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NewProspectForm } from "@/app/prospects/new/new-prospect-form";

vi.mock("@/app/prospects/actions", () => ({
  createProspect: vi.fn(),
}));

describe("NewProspectForm", () => {
  it("renders the approved enabled intake fields and save controls", () => {
    render(<NewProspectForm />);

    const labels = [
      "Contact name",
      "Company",
      "Role",
      "Phone",
      "Email",
      "Website",
      "LinkedIn",
      "Notes",
      "Relationship type",
    ];

    labels.forEach((label) => {
      expect(screen.getByLabelText(label)).toBeEnabled();
    });

    expect(screen.getByRole("button", { name: "Save Draft" })).toBeEnabled();
    expect(
      screen.getByRole("button", { name: "Save and Analyze" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Save and Analyze" }),
    ).toHaveAttribute(
      "title",
      "Research automation arrives in a later milestone.",
    );
  });
});
