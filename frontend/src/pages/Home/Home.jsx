import { useNavigate } from "react-router-dom";
import flammeGif from "../../assets/images/Flamme_F.gif";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 bg-[#0A0A0A] text-[#F1F1F1] flex flex-col items-center justify-center gap-8 sm:gap-10 py-10 px-6">
      <h1 className="text-5xl sm:text-6xl font-bold text-[#E25822] tracking-wide">
        BONFIRE
      </h1>

      <img
        src={flammeGif}
        alt="Animation flamme Bonfire"
        className="w-24 sm:w-28 md:w-32 h-auto object-contain"
      />

      <div className="w-full max-w-md flex flex-col md:flex-row gap-4 justify-center">
        <button
          onClick={() => navigate("/login")}
          className="bg-white text-[#E25822] px-6 py-3 rounded-lg font-semibold 
               transition duration-300 active:scale-95 
               hover:bg-[#E25822] hover:text-white"
        >
          Se connecter
        </button>

        <button
          onClick={() => navigate("/register")}
          className="bg-[#E25822] text-white px-6 py-3 rounded-lg font-semibold 
               transition duration-300 active:scale-95 
               hover:bg-white hover:text-[#E25822]"
        >
          S'inscrire
        </button>

        <button
          onClick={() => navigate("/feed")}
          className="px-6 py-3 rounded-lg font-semibold 
               border border-[#E25822] text-[#E25822]
              transition duration-300 active:scale-95
               hover:bg-[#E25822] hover:text-white
               hover:shadow-[0_0_15px_rgba(226,88,34,0.6)]"
        >
          Explorer
        </button>
      </div>
    </div>
  );
}

export default Home;
