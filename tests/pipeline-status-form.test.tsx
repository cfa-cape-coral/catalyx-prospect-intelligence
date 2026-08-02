import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PipelineStatusForm } from "@/app/prospects/[prospectId]/pipeline-status-form";

vi.mock("@/app/prospects/actions", () => ({
  updatePipelineStatus: vi.fn(),
}));

describe("PipelineStatusForm", () => {
  it("renders every approved status with the current status selected", () => {
    render(
      <PipelineStatusForm prospectId="prospect-1" currentStatus="new" />,
    );

    const status = screen.getByRole("combobox", { name: "Pipeline status" });
    expect(status).toHaveValue("new");

    const labels = [
      "New",
      "Researching",
      "Research complete",
      "Ready to contact",
      "Contacted",
      "Replied",
      "Meeting booked",
      "Audit complete",
      "Proposal sent",
      "Won",
      "Lost",
      "Partner",
    ];

    labels.forEach((label) => {
      expect(screen.getByRole("option", { name: label })).toBeInTheDocument();
    });
  });
});
