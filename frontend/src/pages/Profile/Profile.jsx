import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8000/api/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setUser(data));
  }, []);

  if (!user) return <div>Chargement...</div>;

  return (
    <div>
      <h1>Profil</h1>
      <p>Email : {user.email}</p>
      <p>ID : {user.id}</p>
    </div>
  );
}