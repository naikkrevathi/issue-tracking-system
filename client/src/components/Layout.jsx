import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Layout() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <>
      <header className="navbar">
        <span className="brand">Issue Tracker</span>
        <nav>
          <NavLink to="/" end>{isAdmin ? "Admin Dashboard" : "Dashboard"}</NavLink>
          <NavLink to="/issues" end>{isAdmin ? "All Issues" : "Issues"}</NavLink>
          {!isAdmin && <NavLink to="/issues/assigned">My Assigned Issues</NavLink>}
          {isAdmin && <NavLink to="/users">Users</NavLink>}
          <NavLink to="/profile">Profile</NavLink>
        </nav>
        <div className="nav-user">
          <span>{user.name} ({user.role})</span>
          <button className="btn small secondary" onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}
