import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="mt-10 border-t border-[#2A2A2A] bg-[#0F0F0F] text-gray-400">
      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* LEFT */}
        <p className="text-sm">© 2026 Bonfire</p>

        {/* RIGHT LINKS */}
        <div className="flex gap-4 text-sm">
          <Link to="/cgu" className="hover:text-[#E25822] transition">
            CGU
          </Link>

          <a
            href="/mentions-legales"
            className="hover:text-[#E25822] transition"
          >
            Mentions légales
          </a>

          <a href="/contact" className="hover:text-[#E25822] transition">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
