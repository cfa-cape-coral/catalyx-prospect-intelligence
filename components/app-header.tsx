import Link from "next/link";
import { primaryNavigation } from "@/lib/navigation";

export function AppHeader() {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Link className="app-header__brand" href="/dashboard">
          Catalyx Prospect Intelligence
        </Link>
        <nav aria-label="Primary navigation">
          <ul className="app-header__nav-list">
            {primaryNavigation.map((item) => (
              <li key={item.href}>
                <Link className="app-header__nav-link" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
