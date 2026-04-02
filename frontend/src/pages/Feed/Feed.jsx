import { useEffect, useState } from "react";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8000/api/posts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erreur lors du chargement des posts");
        }
        return res.json();
      })
      .then((data) => {
        setPosts(data?.member || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Chargement des posts...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }
  return (
    <div>
      <h1>Feed</h1>

      {posts.length === 0 ? (
        <p>Aucun post disponible</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            style={{
              border: "1px solid #ccc",
              marginBottom: "10px",
              padding: "10px",
            }}
          >
            <h2>{post.title}</h2>
            <p>{post.description}</p>
            <small>
              {post.created_at
                ? new Date(post.created_at).toLocaleString()
                : "Date inconnue"}
            </small>
          </div>
        ))
      )}
    </div>
  );
}

export default Feed;
