import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DashboardPage from "@/app/dashboard/page";
import LoginPage from "@/app/login/page";

describe("foundation routes", () => {
  it("renders the login placeholder", () => {
    render(<LoginPage />);
    expect(screen.getByRole("heading", { name: "Sign in" })).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("renders the dashboard placeholder", () => {
    render(<DashboardPage />);
    expect(
      screen.getByRole("heading", { name: "Prospect intelligence dashboard" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Total prospects")).toBeInTheDocument();
    expect(screen.getByText("Research jobs")).toBeInTheDocument();
  });
});
