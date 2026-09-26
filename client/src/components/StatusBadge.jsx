export const STATUSES = ["Open", "In Progress", "Closed"];

export default function StatusBadge({ status }) {
  return <span className={`badge ${status.replace(" ", "-").toLowerCase()}`}>{status}</span>;
}
