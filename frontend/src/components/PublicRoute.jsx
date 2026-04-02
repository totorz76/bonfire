import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const token = localStorage.getItem("token");

  // Si connecté → on redirige vers le feed
  if (token) {
    return <Navigate to="/" />;
  }

  // Sinon → on affiche la page publique
  return children;
}

export default PublicRoute;
