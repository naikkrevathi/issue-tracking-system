import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Issues from "./pages/Issues";
import IssueForm from "./pages/IssueForm";
import IssueDetails from "./pages/IssueDetails";
import Users from "./pages/Users";
import Profile from "./pages/Profile";

// Wraps pages that need a logged-in user (and optionally an admin).
function Protected({ adminOnly, children }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <p className="center">Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;
  return children;
}

function GuestOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="center">Loading...</p>;
  return user ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
      <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />

      <Route element={<Protected><Layout /></Protected>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/issues" element={<Issues />} />
        <Route path="/issues/assigned" element={<Issues assignedOnly />} />
        <Route path="/issues/new" element={<IssueForm />} />
        <Route path="/issues/:id" element={<IssueDetails />} />
        <Route path="/issues/:id/edit" element={<IssueForm />} />
        <Route path="/users" element={<Protected adminOnly><Users /></Protected>} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
