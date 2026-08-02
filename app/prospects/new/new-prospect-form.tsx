"use client";

import { useActionState } from "react";
import {
  createProspect,
  type CreateProspectState,
} from "@/app/prospects/actions";
import { SubmitButton } from "@/components/submit-button";

const initialState: CreateProspectState = {
  formError: null,
  fieldErrors: {},
};

export function NewProspectForm() {
  const [state, action] = useActionState(createProspect, initialState);

  return (
    <form action={action} className="form-card">
      <label>
        Contact name
        <input name="contactName" type="text" required />
      </label>
      {state.fieldErrors.contactName ? (
        <p role="alert">{state.fieldErrors.contactName}</p>
      ) : null}

      <label>
        Company
        <input name="companyName" type="text" required />
      </label>
      {state.fieldErrors.companyName ? (
        <p role="alert">{state.fieldErrors.companyName}</p>
      ) : null}

      <label>
        Role
        <input name="role" type="text" />
      </label>

      <label>
        Phone
        <input name="phone" type="tel" />
      </label>

      <label>
        Email
        <input name="email" type="email" />
      </label>
      {state.fieldErrors.email ? (
        <p role="alert">{state.fieldErrors.email}</p>
      ) : null}

      <label>
        Website
        <input name="website" type="url" />
      </label>

      <label>
        LinkedIn
        <input name="linkedinUrl" type="url" />
      </label>

      <label>
        Notes
        <textarea name="notes" />
      </label>

      <label>
        Relationship type
        <select name="relationshipType" defaultValue="prospect">
          <option value="prospect">Prospect</option>
          <option value="partner">Partner</option>
          <option value="referral">Referral</option>
          <option value="supplier">Supplier</option>
        </select>
      </label>

      {state.formError ? <p role="alert">{state.formError}</p> : null}

      <div>
        <SubmitButton idleLabel="Save Draft" pendingLabel="Saving…" />
        <button
          type="button"
          disabled
          title="Research automation arrives in a later milestone."
        >
          Save and Analyze
        </button>
      </div>
    </form>
  );
}
