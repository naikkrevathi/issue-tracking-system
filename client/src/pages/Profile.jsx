import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="card form">
      <h2>Profile</h2>
      <dl className="meta">
        <dt>Name</dt><dd>{user.name}</dd>
        <dt>Email</dt><dd>{user.email}</dd>
        <dt>Role</dt><dd>{user.role}</dd>
      </dl>
      <button className="btn danger" onClick={() => { logout(); navigate("/login"); }}>Logout</button>
    </div>
  );
}
