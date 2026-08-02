import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProspectProfilePage from "@/app/prospects/[prospectId]/page";

describe("ProspectProfilePage", () => {
  it("renders the route identifier and approved profile sections", async () => {
    const page = await ProspectProfilePage({
      params: Promise.resolve({ prospectId: "prospect-123" }),
    });

    render(page);

    expect(screen.getByRole("heading", { name: "Prospect profile" })).toBeInTheDocument();
    expect(screen.getByText(/prospect-123/)).toBeInTheDocument();
    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Research")).toBeInTheDocument();
    expect(screen.getByText("Bottlenecks")).toBeInTheDocument();
    expect(screen.getByText("Opportunities")).toBeInTheDocument();
    expect(screen.getByText("Questions")).toBeInTheDocument();
    expect(screen.getByText("Audit")).toBeInTheDocument();
    expect(screen.getByText("Outreach")).toBeInTheDocument();
    expect(screen.getByText("Sources")).toBeInTheDocument();
    expect(screen.getByText("Timeline")).toBeInTheDocument();
  });
});
