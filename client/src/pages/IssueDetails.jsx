import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../AuthContext";
import StatusBadge, { STATUSES } from "../components/StatusBadge";

export default function IssueDetails() {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api(`/issues/${id}`), api(`/issues/${id}/comments`), api("/users")])
      .then(([i, c, u]) => {
        setIssue(i);
        setComments(c);
        setUsers(u);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  const canModify = issue && (isAdmin || issue.createdBy?._id === user.id);

  async function update(action, body) {
    setError("");
    try {
      setIssue(await api(`/issues/${id}/${action}`, { method: "PATCH", body }));
    } catch (err) {
      setError(err.message);
    }
  }

  async function addComment(e) {
    e.preventDefault();
    setError("");
    try {
      const comment = await api(`/issues/${id}/comments`, { method: "POST", body: { text } });
      setComments([...comments, comment]);
      setText("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove() {
    if (!window.confirm("Delete this issue and its comments?")) return;
    try {
      await api(`/issues/${id}`, { method: "DELETE" });
      navigate("/issues");
    } catch (err) {
      setError(err.message);
    }
  }

  if (!issue) return error ? <p className="error">{error}</p> : <p>Loading...</p>;

  return (
    <>
      <div className="card">
        <div className="row between">
          <h2>{issue.title}</h2>
          <StatusBadge status={issue.status} />
        </div>
        {error && <p className="error">{error}</p>}
        <p className="description">{issue.description}</p>

        <dl className="meta">
          <dt>Created by</dt><dd>{issue.createdBy?.name || "Deleted user"}</dd>
          <dt>Assigned to</dt><dd>{issue.assignedTo?.name || "Unassigned"}</dd>
          <dt>Created</dt><dd>{new Date(issue.createdAt).toLocaleString()}</dd>
          <dt>Updated</dt><dd>{new Date(issue.updatedAt).toLocaleString()}</dd>
        </dl>

        <div className="row">
          <label>Status</label>
          <select value={issue.status} onChange={(e) => update("status", { status: e.target.value })}>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <label>Assign to</label>
          <select value={issue.assignedTo?._id || ""} onChange={(e) => update("assign", { assignedTo: e.target.value || null })}>
            <option value="">Unassigned</option>
            {users.map((u) => <option key={u._id} value={u._id}>{u.name}</option>)}
          </select>
        </div>

        {canModify && (
          <div className="row">
            <Link to={`/issues/${id}/edit`} className="btn small">Edit</Link>
            <button className="btn small danger" onClick={remove}>Delete</button>
          </div>
        )}
      </div>

      <div className="card">
        <h3>Comments ({comments.length})</h3>
        {comments.length === 0 && <p className="muted">No comments yet.</p>}
        {comments.map((c) => (
          <div key={c._id} className="comment">
            <strong>{c.author?.name || "Deleted user"}</strong>
            <span className="muted"> · {new Date(c.createdAt).toLocaleString()}</span>
            <p>{c.text}</p>
          </div>
        ))}
        <form onSubmit={addComment} className="form">
          <textarea required rows={3} placeholder="Write a comment..." value={text} onChange={(e) => setText(e.target.value)} />
          <button className="btn">Add Comment</button>
        </form>
      </div>
    </>
  );
}
