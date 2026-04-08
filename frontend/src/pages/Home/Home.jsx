import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F1F1F1] flex flex-col justify-between items-center py-10 px-6">
      <h1 className="text-5xl  text-[#E25822]">BONFIRE</h1>

      <div className="flex-1 flex items-center justify-center">
        {/* <img
          src={}
          alt="Bonfire animation"
          className="max-w-xs md:max-w-md rounded-xl shadow-lg"
        /> */}
      </div>

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
