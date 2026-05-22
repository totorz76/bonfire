import { Link } from "react-router-dom";

export default function Forbidden() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="text-8xl font-bold text-[#E25822]">403</p>
      <h1 className="text-2xl font-semibold mt-4 mb-2">Accès refusé</h1>
      <p className="text-gray-400 max-w-md mb-8">
        Vous n'avez pas les droits nécessaires pour accéder à cette page.
        Seuls les administrateurs peuvent consulter l'espace admin.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/feed"
          className="px-6 py-3 rounded-lg bg-[#E25822] text-white font-semibold hover:opacity-90 transition"
        >
          Retour au feed
        </Link>
        <Link
          to="/profile"
          className="px-6 py-3 rounded-lg border border-[#2A2A2A] text-gray-300 font-semibold hover:border-[#E25822] hover:text-[#E25822] transition"
        >
          Mon profil
        </Link>
      </div>
    </div>
  );
}
