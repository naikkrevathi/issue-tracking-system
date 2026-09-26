import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../AuthContext";
import StatusBadge, { STATUSES } from "../components/StatusBadge";

export default function Issues({ assignedOnly = false }) {
  const { isAdmin } = useAuth();
  const [issues, setIssues] = useState(null);
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  function load() {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (assignedOnly) params.set("assigned", "me");
    api(`/issues?${params}`).then(setIssues).catch((err) => setError(err.message));
  }

  useEffect(() => {
    setIssues(null);
    load();
  }, [status, assignedOnly]);

  // Admins manage status/assignment straight from the list, so they need the user list.
  useEffect(() => {
    if (isAdmin) api("/users").then(setUsers).catch(() => {});
  }, [isAdmin]);

  async function update(id, action, body) {
    try {
      await api(`/issues/${id}/${action}`, { method: "PATCH", body });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(id) {
    if (!window.confirm("Delete this issue and its comments?")) return;
    try {
      await api(`/issues/${id}`, { method: "DELETE" });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  const title = assignedOnly ? "My Assigned Issues" : isAdmin ? "All Issues" : "Issues";

  return (
    <>
      <div className="row between">
        <h2>{title}</h2>
        <Link to="/issues/new" className="btn">+ New Issue</Link>
      </div>

      <div className="row">
        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {error && <p className="error">{error}</p>}
      {!issues ? (
        <p>Loading...</p>
      ) : issues.length === 0 ? (
        <p className="muted">No issues found.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Created by</th>
                <th>Assigned to</th>
                <th>Created</th>
                {isAdmin && <th>Manage</th>}
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr key={issue._id}>
                  <td><Link to={`/issues/${issue._id}`}>{issue.title}</Link></td>
                  <td><StatusBadge status={issue.status} /></td>
                  <td>{issue.createdBy?.name || "Deleted user"}</td>
                  <td>{issue.assignedTo?.name || "Unassigned"}</td>
                  <td>{new Date(issue.createdAt).toLocaleDateString()}</td>
                  {isAdmin && (
                    <td className="manage">
                      <select value={issue.status} onChange={(e) => update(issue._id, "status", { status: e.target.value })}>
                        {STATUSES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                      <select value={issue.assignedTo?._id || ""} onChange={(e) => update(issue._id, "assign", { assignedTo: e.target.value || null })}>
                        <option value="">Unassigned</option>
                        {users.map((u) => <option key={u._id} value={u._id}>{u.name}</option>)}
                      </select>
                      <button className="btn small danger" onClick={() => remove(issue._id)}>Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
