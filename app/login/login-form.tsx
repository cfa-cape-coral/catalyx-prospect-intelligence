"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/auth/actions";
import { SubmitButton } from "@/components/submit-button";

const initialState: LoginState = { error: null };

export function LoginForm() {
  const [state, action] = useActionState(login, initialState);

  return (
    <form action={action} className="form-card">
      <label>
        Email
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>
      {state.error ? <p role="alert">{state.error}</p> : null}
      <SubmitButton idleLabel="Sign in" pendingLabel="Signing in…" />
    </form>
  );
}
