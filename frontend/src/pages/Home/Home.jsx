import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Mon Réseau Social</h1>

      <p>Partagez et découvrez des contenus.</p>

      <div>
        <button onClick={() => navigate("/login")}>Se connecter</button>

        <button onClick={() => navigate("/register")}>S'inscrire</button>
      </div>
    </div>
  );
}

export default Home;
