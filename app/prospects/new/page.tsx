import { PageShell } from "@/components/page-shell";

const textFields = [
  ["contact-name", "Contact name", "text"],
  ["company", "Company", "text"],
  ["role", "Role", "text"],
  ["phone", "Phone", "tel"],
  ["email", "Email", "email"],
  ["website", "Website", "url"],
  ["linkedin", "LinkedIn", "url"],
] as const;

export default function NewProspectPage() {
  return (
    <PageShell
      eyebrow="Prospect intake"
      title="Add a prospect"
      description="This placeholder establishes the approved intake fields. Saving and analysis arrive in later tasks."
    >
      <form className="placeholder-card" aria-label="New prospect placeholder">
        {textFields.map(([id, label, type]) => (
          <div key={id}>
            <label htmlFor={id}>{label}</label>
            <input id={id} name={id} type={type} disabled />
          </div>
        ))}

        <div>
          <label htmlFor="notes">Notes</label>
          <textarea id="notes" name="notes" disabled />
        </div>

        <div>
          <label htmlFor="relationship-type">Relationship type</label>
          <select id="relationship-type" name="relationship-type" disabled>
            <option>Prospect</option>
            <option>Partner</option>
            <option>Referral</option>
            <option>Supplier</option>
          </select>
        </div>

        <div>
          <button type="button" disabled>
            Save Draft
          </button>
          <button type="button" disabled>
            Save and Analyze
          </button>
        </div>
      </form>
    </PageShell>
  );
}
