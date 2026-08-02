import { describe, expect, it } from "vitest";
import { primaryNavigation } from "@/lib/navigation";

describe("primaryNavigation", () => {
  it("contains the approved foundation routes", () => {
    expect(primaryNavigation).toEqual([
      { label: "Dashboard", href: "/dashboard" },
      { label: "New Prospect", href: "/prospects/new" },
      { label: "Login", href: "/login" },
    ]);
  });
});
