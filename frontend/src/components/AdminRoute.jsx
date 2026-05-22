import { Navigate } from "react-router-dom";
import { isAdmin } from "../utils/auth";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Vérification des droits...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin(user)) {
    return <Navigate to="/acces-refuse" replace />;
  }

  return children;
}
