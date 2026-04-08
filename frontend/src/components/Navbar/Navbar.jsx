import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://localhost:8000/api/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <nav className="bg-[#0A0A0A] text-[#F1F1F1] p-4 border-b border-[#2A2A2A]">
        Chargement...
      </nav>
    );
  }

  return (
    <nav className="bg-[#0A0A0A] text-[#F1F1F1] px-6 h-16 flex items-center border-b border-[#2A2A2A] relative">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-[#E25822] font-bold text-xl leading-none hover:opacity-80 transition cursor-pointer"
          >
            Bonfire
          </Link>

          <Link
            to="/"
            className="hidden md:block hover:text-[#E25822] transition cursor-pointer"
          >
            Feed
          </Link>

          {token && (
            <Link
              to="/myposts"
              className="hidden md:block hover:text-[#E25822] transition cursor-pointer"
            >
              My posts
            </Link>
          )}
        </div>

        <div className="hidden md:flex items-center gap-4 text-sm">
          {!token ? (
            <>
              <Link className="hover:text-[#E25822] cursor-pointer" to="/login">
                Login
              </Link>

              <Link
                className="bg-[#E25822] text-white px-4 py-2 rounded-lg font-semibold hover:bg-white hover:text-[#E25822] transition cursor-pointer"
                to="/register"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/profile"
                className="text-gray-400 hover:text-[#E25822] transition cursor-pointer"
              >
                👤 {user?.pseudo}
              </Link>

              <button
                onClick={handleLogout}
                className="border border-[#E25822] text-[#E25822] px-4 py-2 rounded-lg hover:bg-[#E25822] hover:text-white transition cursor-pointer"
              >
                Logout
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col justify-center gap-1 cursor-pointer"
        >
          <span className="w-6 h-0.5 bg-white"></span>
          <span className="w-6 h-0.5 bg-white"></span>
          <span className="w-6 h-0.5 bg-white"></span>
        </button>
      </div>

      <div
        className={`md:hidden absolute left-0 top-full w-full bg-[#0A0A0A] flex flex-col items-center justify-center gap-4 py-6 text-sm border-b border-[#2A2A2A] transition-all duration-300 ${
          open
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <Link
          onClick={() => setOpen(false)}
          to="/"
          className="hover:text-[#E25822] cursor-pointer"
        >
          Feed
        </Link>

        {token && (
          <Link
            onClick={() => setOpen(false)}
            to="/myposts"
            className="hover:text-[#E25822] cursor-pointer"
          >
            My posts
          </Link>
        )}

        {!token ? (
          <>
            <Link
              onClick={() => setOpen(false)}
              to="/login"
              className="hover:text-[#E25822] cursor-pointer"
            >
              Login
            </Link>
            <Link
              onClick={() => setOpen(false)}
              to="/register"
              className="hover:text-[#E25822] cursor-pointer"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/profile"
              className="text-gray-400 hover:text-[#E25822] transition cursor-pointer"
            >
              👤 {user?.pseudo}
            </Link>
            <button
              onClick={handleLogout}
              className="hover:text-[#E25822] cursor-pointer"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
