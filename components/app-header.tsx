import Link from "next/link";
import { logout } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/server";

export async function AppHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Link className="app-header__brand" href="/dashboard">
          Catalyx Prospect Intelligence
        </Link>
        <nav aria-label="Primary navigation">
          <ul className="app-header__nav-list">
            {user ? (
              <>
                <li>
                  <Link className="app-header__nav-link" href="/dashboard">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link className="app-header__nav-link" href="/prospects/new">
                    New Prospect
                  </Link>
                </li>
                <li>
                  <form action={logout}>
                    <button className="app-header__nav-link" type="submit">
                      Sign out
                    </button>
                  </form>
                </li>
              </>
            ) : (
              <li>
                <Link className="app-header__nav-link" href="/login">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
