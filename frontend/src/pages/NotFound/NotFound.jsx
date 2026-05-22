import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="text-8xl font-bold text-[#E25822]">404</p>
      <h1 className="text-2xl font-semibold mt-4 mb-2">Page introuvable</h1>
      <p className="text-gray-400 max-w-md mb-8">
        La page que vous cherchez n'existe pas ou a été déplacée.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/"
          className="px-6 py-3 rounded-lg bg-[#E25822] text-white font-semibold hover:opacity-90 transition"
        >
          Accueil
        </Link>
        <Link
          to="/feed"
          className="px-6 py-3 rounded-lg border border-[#E25822] text-[#E25822] font-semibold hover:bg-[#E25822] hover:text-white transition"
        >
          Voir le feed
        </Link>
      </div>
    </div>
  );
}
