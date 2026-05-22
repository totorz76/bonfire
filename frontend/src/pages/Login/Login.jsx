import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedCgu, setAcceptedCgu] = useState(false);
  const [cguError, setCguError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/profile");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!acceptedCgu) {
      setCguError(true);
      return;
    }

    setCguError(false);

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Erreur login");
        return;
      }

      // Stocker le token
      localStorage.setItem("token", data.token);

      // Redirection
      navigate("/profile");
    } catch (error) {
      console.error(error);
      alert("Erreur serveur");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F0F0F] px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-[#121212] border border-[#2A2A2A] rounded-xl p-6 flex flex-col gap-4 shadow-lg"
      >
        <h2 className="text-2xl font-bold text-center text-[#E25822]">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-[#0F0F0F] border border-[#2A2A2A] text-white focus:outline-none focus:border-[#E25822]"
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-[#0F0F0F] border border-[#2A2A2A] text-white focus:outline-none focus:border-[#E25822]"
        />

        <label className="flex items-start gap-2 text-sm text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={acceptedCgu}
            onChange={(e) => {
              setAcceptedCgu(e.target.checked);
              if (e.target.checked) setCguError(false);
            }}
            className="mt-1 accent-[#E25822] cursor-pointer"
          />
          <span>
            J'accepte les{" "}
            <Link
              to="/cgu"
              className="text-[#E25822] hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              conditions générales d'utilisation
            </Link>
          </span>
        </label>

        {cguError && (
          <p className="text-red-500 text-sm -mt-2">
            Vous devez accepter les CGU pour vous connecter.
          </p>
        )}

        <button
          type="submit"
          className="w-full py-2 bg-[#E25822] text-white rounded-lg font-semibold hover:opacity-90 transition cursor-pointer"
        >
          Se connecter
        </button>

        {/* LINKS */}
        <div className="flex flex-col gap-2 text-sm text-gray-400 mt-2">
          {/* forgot password */}
          <a href="#" className="text-center hover:text-[#E25822] transition">
            Mot de passe oublié ?
          </a>

          {/* register */}
          <div className="text-center">
            Pas de compte ?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-[#E25822] cursor-pointer hover:underline"
            >
              S'inscrire
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
