import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";
import { PageShell } from "@/components/page-shell";
import { createClient } from "@/lib/supabase/server";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <PageShell
      title="Sign in"
      description="Use your private Catalyx account to access prospect intelligence."
    >
      <LoginForm />
    </PageShell>
  );
}
