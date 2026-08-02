import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppHeader } from "@/components/app-header";

describe("AppHeader", () => {
  it("shows the product name and approved navigation links", () => {
    render(<AppHeader />);

    expect(screen.getByText("Catalyx Prospect Intelligence")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
      "href",
      "/dashboard",
    );
    expect(screen.getByRole("link", { name: "New Prospect" })).toHaveAttribute(
      "href",
      "/prospects/new",
    );
    expect(screen.getByRole("link", { name: "Login" })).toHaveAttribute(
      "href",
      "/login",
    );
  });
});
