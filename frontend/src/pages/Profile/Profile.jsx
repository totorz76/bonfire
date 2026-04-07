import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState(null);
  

  const fetchUser = () => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8000/api/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchUser();

    // refresh quand on revient sur l’onglet
    const handleFocus = () => {
      fetchUser();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  if (!user) return <div>Chargement...</div>;

  const xpProgress = user.xpProgress ?? 0;
  const level = user.level ?? 1;

  return (
    <div>
      <h2>Profil</h2>

      <p>Email : {user.email}</p>
      <p>ID : {user.id}</p>

      <h3>Niveau {level}</h3>

      {/* Barre XP */}
      <div
        style={{
          width: "300px",
          height: "20px",
          backgroundColor: "#ddd",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${xpProgress}%`,
            height: "100%",
            backgroundColor: "#4caf50",
            transition: "width 0.3s ease",
          }}
        />
      </div>

      <p>{xpProgress} / 100 XP</p>
    </div>
  );
}
