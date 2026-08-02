import type { ReactNode } from "react";

type PageShellProps = {
  eyebrow?: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function PageShell({
  eyebrow,
  title,
  description,
  children,
}: PageShellProps) {
  return (
    <main className="page-shell">
      <header className="page-shell__heading">
        {eyebrow ? <p className="page-shell__eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        <p>{description}</p>
      </header>
      <section className="page-shell__content">{children}</section>
    </main>
  );
}
