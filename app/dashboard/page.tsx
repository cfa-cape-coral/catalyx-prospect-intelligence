import Link from "next/link";
import { DashboardMetric } from "@/components/dashboard-metric";
import { PageShell } from "@/components/page-shell";
import { ProspectList } from "@/components/prospect-list";
import { requireUser } from "@/lib/auth/require-user";
import { calculateDashboardMetrics } from "@/lib/dashboard/metrics";
import {
  getAllProspectStatuses,
  getRecentProspects,
} from "@/lib/prospects/queries";

export default async function DashboardPage() {
  await requireUser();
  const [statuses, recentProspects] = await Promise.all([
    getAllProspectStatuses(),
    getRecentProspects(),
  ]);
  const metrics = calculateDashboardMetrics(statuses);

  return (
    <PageShell
      eyebrow="Command center"
      title="Prospect intelligence dashboard"
      description="Live pipeline metrics and recently added prospects."
    >
      <DashboardMetric label="Total prospects" value={metrics.total} />
      <DashboardMetric label="Researching" value={metrics.researching} />
      <DashboardMetric
        label="Ready to contact"
        value={metrics.readyToContact}
      />
      <DashboardMetric
        label="Waiting for reply"
        value={metrics.waitingForReply}
      />
      <DashboardMetric
        label="Meetings booked"
        value={metrics.meetingsBooked}
      />
      <DashboardMetric
        label="Proposals sent"
        value={metrics.proposalsSent}
      />
      <DashboardMetric label="Won clients" value={metrics.wonClients} />

      {recentProspects.length > 0 ? (
        <ProspectList prospects={recentProspects} />
      ) : (
        <section className="placeholder-card">
          <p>No prospects yet.</p>
          <Link href="/prospects/new">Add a prospect</Link>
        </section>
      )}
    </PageShell>
  );
}
