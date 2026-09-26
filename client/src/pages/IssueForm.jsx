import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";

// Used for both creating (/issues/new) and editing (/issues/:id/edit).
export default function IssueForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!id) return;
    api(`/issues/${id}`)
      .then((issue) => setForm({ title: issue.title, description: issue.description }))
      .catch((err) => setError(err.message));
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const issue = await api(id ? `/issues/${id}` : "/issues", { method: id ? "PUT" : "POST", body: form });
      navigate(`/issues/${issue._id}`);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h2>{id ? "Edit Issue" : "Create Issue"}</h2>
      {error && <p className="error">{error}</p>}
      <label>Title</label>
      <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <label>Description</label>
      <textarea required rows={6} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <div className="row">
        <button className="btn" disabled={busy}>{id ? "Save Changes" : "Create Issue"}</button>
        <button type="button" className="btn secondary" onClick={() => navigate(-1)}>Cancel</button>
      </div>
    </form>
  );
}
