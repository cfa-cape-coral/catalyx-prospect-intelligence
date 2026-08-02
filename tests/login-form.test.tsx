import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LoginForm } from "@/app/login/login-form";

vi.mock("@/app/auth/actions", () => ({
  login: vi.fn(),
}));

describe("LoginForm", () => {
  it("renders enabled email, password, and submit controls", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText("Email")).toBeEnabled();
    expect(screen.getByLabelText("Password")).toBeEnabled();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeEnabled();
  });
});
