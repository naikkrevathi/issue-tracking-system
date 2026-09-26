import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../AuthContext";

function Card({ label, value, to }) {
  const content = (
    <div className="card stat">
      <div className="stat-value">{value}</div>
      <div className="muted">{label}</div>
    </div>
  );
  return to ? <Link to={to} className="plain-link">{content}</Link> : content;
}

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/dashboard").then(setStats).catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!stats) return <p>Loading...</p>;

  return (
    <>
      <h2>{isAdmin ? "Admin Dashboard" : "Dashboard"}</h2>
      <p className="muted">Welcome, {user.name}.</p>
      <div className="grid">
        {isAdmin && <Card label="Total Users" value={stats.totalUsers} to="/users" />}
        <Card label="Total Issues" value={stats.total} to="/issues" />
        <Card label="Open" value={stats.open} />
        <Card label="In Progress" value={stats.inProgress} />
        <Card label="Closed" value={stats.closed} />
        {!isAdmin && <Card label="Assigned to Me" value={stats.assignedToMe} to="/issues/assigned" />}
      </div>
    </>
  );
}
