import { Navigate } from "react-router-dom";
import Home from "../pages/Home/Home";
import Feed from "../pages/Feed/Feed";

const RootRoute = () => {
  const token = localStorage.getItem("token");

  return token ? <Feed /> : <Home />;
};

export default RootRoute;
