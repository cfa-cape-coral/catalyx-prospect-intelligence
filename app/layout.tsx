import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppHeader } from "@/components/app-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Catalyx Prospect Intelligence",
  description: "Private prospect research and consulting-intelligence platform.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
