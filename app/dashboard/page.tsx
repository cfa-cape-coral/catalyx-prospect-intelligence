import { PageShell } from "@/components/page-shell";
import { PlaceholderCard } from "@/components/placeholder-card";

const dashboardCards = [
  ["Total prospects", "Database-backed metrics arrive in Milestone 1."],
  ["Priority prospects", "Ranked prospect records will appear here."],
  ["Follow-ups due", "Upcoming outreach actions will appear here."],
  ["Research jobs", "Queued, active, completed, and failed jobs will appear here."],
] as const;

export default function DashboardPage() {
  return (
    <PageShell
      eyebrow="Command center"
      title="Prospect intelligence dashboard"
      description="This shell confirms the approved layout before live data is connected."
    >
      {dashboardCards.map(([title, description]) => (
        <PlaceholderCard key={title} title={title} description={description} />
      ))}
    </PageShell>
  );
}
