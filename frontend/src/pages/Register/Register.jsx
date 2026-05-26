import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Register() {
  const [email, setEmail] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedCgu, setAcceptedCgu] = useState(false);

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/profile", { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  // 🔐 REGEX PASSWORD
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{10,}$/;

  const validate = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email requis";
    }

    if (!pseudo) {
      newErrors.pseudo = "Pseudo requis";
    }

    if (!password) {
      newErrors.password = "Mot de passe requis";
    } else if (!passwordRegex.test(password)) {
      newErrors.password = "Minimum 10 caractères, 1 majuscule et 1 chiffre";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirmation requise";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    if (!acceptedCgu) {
      newErrors.cgu = "Vous devez accepter les CGU pour créer un compte";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      const res = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, pseudo }),
      });

      const data = await res.json();

      // SI ERREUR BACKEND
      if (!res.ok) {
        if (data.error.includes("Pseudo")) {
          setErrors({ pseudo: data.error });
        } else if (data.error.includes("Email")) {
          setErrors({ email: data.error });
        } else {
          setErrors({ global: data.error });
        }
        return;
      }

      // SI OK
      navigate("/login");
    } catch (err) {
      console.error(err);
      setErrors({ global: "Erreur serveur" });
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-[#121212] border border-[#2A2A2A] p-8 rounded-2xl w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-semibold text-center text-[#E25822]">
          Créer un compte
        </h1>

        {/* EMAIL */}
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#2A2A2A] p-3 rounded-lg focus:outline-none focus:border-[#E25822]"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* PSEUDO */}
        <div>
          <input
            type="text"
            placeholder="Pseudo"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#2A2A2A] p-3 rounded-lg focus:outline-none focus:border-[#E25822]"
          />
          {errors.pseudo && (
            <p className="text-red-500 text-sm mt-1">{errors.pseudo}</p>
          )}
        </div>

        {/* PASSWORD */}
        <div>
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#2A2A2A] p-3 rounded-lg focus:outline-none focus:border-[#E25822]"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* CONFIRM PASSWORD */}
        <div>
          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#2A2A2A] p-3 rounded-lg focus:outline-none focus:border-[#E25822]"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>
        {/* PASSWORD REQUIREMENTS */}
        <div className="bg-[#1a1a1a] border border-[#2A2A2A] p-3 rounded-lg text-sm text-gray-400">
          <p className="text-[#E25822] font-medium mb-1">
            Mot de passe requis :
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Au moins 10 caractères</li>
            <li>Une lettre majuscule</li>
            <li>Un chiffre</li>
          </ul>
        </div>

        <label className="flex items-start gap-2 text-sm text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={acceptedCgu}
            onChange={(e) => {
              setAcceptedCgu(e.target.checked);
              if (e.target.checked) {
                setErrors((prev) => ({ ...prev, cgu: undefined }));
              }
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

        {errors.cgu && (
          <p className="text-red-500 text-sm -mt-2">{errors.cgu}</p>
        )}

        {/* GLOBAL ERROR */}
        {errors.global && (
          <p className="text-red-500 text-sm text-center">{errors.global}</p>
        )}

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full bg-[#E25822] hover:bg-orange-600 active:scale-95 transition p-3 rounded-lg font-semibold cursor-pointer"
        >
          S'inscrire
        </button>
      </form>
    </div>
  );
}

export default Register;
