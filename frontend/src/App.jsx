import { BrowserRouter, Routes, Route } from "react-router-dom";
import Feed from "./pages/Feed/Feed";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Profile from "./pages/Profile/profile";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import PublicRoute from "./components/PublicRoute";
import Footer from "./components/Footer/Footer";
import MyPosts from "./pages/MyPosts/MyPosts";
import CreatePost from "./pages/CreatePost/CreatePost";
import Admin from "./pages/Admin/Admin";
import AdminRoute from "./components/AdminRoute";
import RootRoute from "./components/RootRoute";
import ScrollToTop from "./components/ScrollToTop";
import CGU from "./pages/CGU/CGU";
import NotFound from "./pages/NotFound/NotFound";
import Forbidden from "./pages/Forbidden/Forbidden";

function App() {
  return (
    <div className="bg-[#0A0A0A] min-h-screen text-[#F1F1F1] flex flex-col">
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <main className="flex-1 flex flex-col">
          <Routes>
          <Route path="/" element={<RootRoute />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/createpost" element={<CreatePost />} />
          <Route path="/myposts" element={<MyPosts />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/home"
            element={
              <PublicRoute>
                <Home />
              </PublicRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/cgu" element={<CGU />} />
          <Route path="/acces-refuse" element={<Forbidden />} />
          <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
