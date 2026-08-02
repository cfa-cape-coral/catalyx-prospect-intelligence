import { notFound } from "next/navigation";
import { PipelineStatusForm } from "./pipeline-status-form";
import { PageShell } from "@/components/page-shell";
import { PlaceholderCard } from "@/components/placeholder-card";
import { pipelineStatusLabels } from "@/lib/prospects/constants";
import { getProspectById } from "@/lib/prospects/queries";

const profileSections = [
  "Overview",
  "Research",
  "Bottlenecks",
  "Opportunities",
  "Questions",
  "Audit",
  "Outreach",
  "Sources",
  "Timeline",
] as const;

type ProspectProfilePageProps = {
  params: Promise<{ prospectId: string }>;
};

export default async function ProspectProfilePage({
  params,
}: ProspectProfilePageProps) {
  const { prospectId } = await params;
  const prospect = await getProspectById(prospectId);

  if (!prospect) {
    notFound();
  }

  const relationshipType =
    prospect.relationshipType.charAt(0).toUpperCase() +
    prospect.relationshipType.slice(1);
  const valueOrUnknown = (value: string | number | null) =>
    value ?? "Unknown";

  return (
    <PageShell
      eyebrow="Prospect record"
      title={prospect.contactName}
      description="Saved prospect profile and pipeline details."
    >
      <article className="placeholder-card">
        <h2>Prospect details</h2>
        <dl>
          <dt>Company</dt>
          <dd>{prospect.companyName}</dd>
          <dt>Role</dt>
          <dd>{valueOrUnknown(prospect.role)}</dd>
          <dt>Pipeline status</dt>
          <dd>{pipelineStatusLabels[prospect.pipelineStatus]}</dd>
          <dt>Relationship type</dt>
          <dd>{relationshipType}</dd>
          <dt>Email</dt>
          <dd>{valueOrUnknown(prospect.email)}</dd>
          <dt>Phone</dt>
          <dd>{valueOrUnknown(prospect.phone)}</dd>
          <dt>Website</dt>
          <dd>{valueOrUnknown(prospect.website)}</dd>
          <dt>LinkedIn</dt>
          <dd>{valueOrUnknown(prospect.linkedinUrl)}</dd>
          <dt>Notes</dt>
          <dd>{valueOrUnknown(prospect.notes)}</dd>
          <dt>Opportunity score</dt>
          <dd>{valueOrUnknown(prospect.opportunityScore)}</dd>
          <dt>Next action</dt>
          <dd>{valueOrUnknown(prospect.nextAction)}</dd>
          <dt>Follow-up date</dt>
          <dd>{valueOrUnknown(prospect.followUpAt)}</dd>
        </dl>
      </article>

      <PipelineStatusForm
        prospectId={prospect.id}
        currentStatus={prospect.pipelineStatus}
      />

      {profileSections.map((section) => (
        <PlaceholderCard
          key={section}
          title={section}
          description={`${section} content will be implemented in its assigned milestone.`}
        />
      ))}
    </PageShell>
  );
}
