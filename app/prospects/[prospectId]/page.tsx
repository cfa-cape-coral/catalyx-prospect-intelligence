import { PageShell } from "@/components/page-shell";
import { PlaceholderCard } from "@/components/placeholder-card";

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

  return (
    <PageShell
      eyebrow="Prospect record"
      title="Prospect profile"
      description={`Placeholder profile for ${prospectId}. Live prospect data arrives after Supabase is connected.`}
    >
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
