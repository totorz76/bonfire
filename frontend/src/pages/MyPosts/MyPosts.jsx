import { useEffect, useState } from "react";

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");

  // 🔹 Récupérer l'utilisateur connecté
  useEffect(() => {
    fetch("http://localhost:8000/api/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error(err));
  }, [token]);

  // 🔹 Récupérer tous les posts
  useEffect(() => {
    fetch("http://localhost:8000/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data.member || []))
      .catch((err) => console.error(err));
  }, []);

  // 🔹 Supprimer un post
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8000/api/posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // mettre à jour le state
      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression");
    }
  };

  // Filtrer les posts de l'utilisateur
  const myPosts = user
    ? posts.filter((post) => post.user === `/api/users/${user.id}`)
    : [];

  return (
    <div>
      <h1>Mes posts</h1>

      {myPosts.length === 0 ? (
        <p>Aucun post</p>
      ) : (
        myPosts.map((post) => (
          <div key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.description}</p>

            <button onClick={() => handleDelete(post.id)}>Supprimer</button>
          </div>
        ))
      )}
    </div>
  );
}

export default MyPosts;
