import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppHeader } from "@/components/app-header";

const getUser = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser },
  })),
}));

vi.mock("@/app/auth/actions", () => ({
  logout: vi.fn(),
}));

describe("AppHeader", () => {
  beforeEach(() => {
    getUser.mockReset();
  });

  it("shows private navigation and sign out when authenticated", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });

    render(await AppHeader());

    expect(screen.getByText("Catalyx Prospect Intelligence")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
      "href",
      "/dashboard",
    );
    expect(screen.getByRole("link", { name: "New Prospect" })).toHaveAttribute(
      "href",
      "/prospects/new",
    );
    expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Login" })).not.toBeInTheDocument();
  });

  it("shows only login navigation when unauthenticated", async () => {
    getUser.mockResolvedValue({ data: { user: null } });

    render(await AppHeader());

    expect(screen.getByRole("link", { name: "Login" })).toHaveAttribute(
      "href",
      "/login",
    );
    expect(
      screen.queryByRole("link", { name: "Dashboard" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "New Prospect" }),
    ).not.toBeInTheDocument();
  });
});
