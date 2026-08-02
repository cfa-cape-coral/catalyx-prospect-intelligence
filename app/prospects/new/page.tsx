import { NewProspectForm } from "./new-prospect-form";
import { PageShell } from "@/components/page-shell";
import { requireUser } from "@/lib/auth/require-user";

export default async function NewProspectPage() {
  await requireUser();

  return (
    <PageShell
      eyebrow="Prospect intake"
      title="Add a prospect"
      description="This placeholder establishes the approved intake fields. Saving and analysis arrive in later tasks."
    >
      <NewProspectForm />
    </PageShell>
  );
}
