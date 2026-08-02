export type NavigationItem = {
  label: string;
  href: string;
};

export const primaryNavigation: NavigationItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "New Prospect", href: "/prospects/new" },
  { label: "Login", href: "/login" },
];
