import { updatePipelineStatus } from "@/app/prospects/actions";
import {
  pipelineStatuses,
  pipelineStatusLabels,
  type PipelineStatus,
} from "@/lib/prospects/constants";

type PipelineStatusFormProps = {
  prospectId: string;
  currentStatus: PipelineStatus;
};

export function PipelineStatusForm({
  prospectId,
  currentStatus,
}: PipelineStatusFormProps) {
  return (
    <form action={updatePipelineStatus} className="form-card">
      <input name="prospectId" type="hidden" value={prospectId} />
      <label>
        Pipeline status
        <select
          name="pipelineStatus"
          defaultValue={currentStatus}
        >
          {pipelineStatuses.map((status) => (
            <option key={status} value={status}>
              {pipelineStatusLabels[status]}
            </option>
          ))}
        </select>
      </label>
      <button type="submit">Update status</button>
    </form>
  );
}
