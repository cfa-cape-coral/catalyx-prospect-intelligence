import { PageShell } from "@/components/page-shell";

export default function LoginPage() {
  return (
    <PageShell
      eyebrow="Private access"
      title="Sign in"
      description="Authentication will be connected to Supabase in a later milestone."
    >
      <form className="placeholder-card" aria-label="Login placeholder">
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" disabled />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" disabled />
        </div>
        <button type="button" disabled>
          Sign in unavailable
        </button>
      </form>
    </PageShell>
  );
}
