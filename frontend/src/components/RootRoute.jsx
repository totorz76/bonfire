import Home from "../pages/Home/Home";
import Feed from "../pages/Feed/Feed";
import { useAuth } from "../context/AuthContext";

const RootRoute = () => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Chargement...
      </div>
    );
  }

  return isAuthenticated ? <Feed /> : <Home />;
};

export default RootRoute;
