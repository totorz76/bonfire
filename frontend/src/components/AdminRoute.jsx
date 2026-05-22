import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { fetchMe, isAdmin } from "../utils/auth";

export default function AdminRoute({ children }) {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setStatus("unauthorized");
      return;
    }

    fetchMe(token)
      .then((user) => {
        if (!user || user.error) {
          setStatus("unauthorized");
          return;
        }

        setStatus(isAdmin(user) ? "allowed" : "forbidden");
      })
      .catch(() => setStatus("unauthorized"));
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Vérification des droits...
      </div>
    );
  }

  if (status === "unauthorized") {
    return <Navigate to="/login" replace />;
  }

  if (status === "forbidden") {
    return <Navigate to="/acces-refuse" replace />;
  }

  return children;
}
