import Link from "next/link";
import { pipelineStatusLabels } from "@/lib/prospects/constants";
import type { ProspectSummary } from "@/lib/prospects/types";

type ProspectListProps = {
  prospects: ProspectSummary[];
};

export function ProspectList({ prospects }: ProspectListProps) {
  return (
    <section className="placeholder-card">
      <h2>Recent prospects</h2>
      <ul>
        {prospects.map((prospect) => (
          <li key={prospect.id}>
            <Link href={`/prospects/${prospect.id}`}>
              {prospect.companyName}
            </Link>
            <p>{prospect.contactName}</p>
            <p>{pipelineStatusLabels[prospect.pipelineStatus]}</p>
            <p>{prospect.nextAction ?? "No next action set."}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
