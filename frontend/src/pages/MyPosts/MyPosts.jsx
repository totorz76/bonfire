import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PostsModal from "../Feed/PostsModal/PostsModal";

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const token = localStorage.getItem("token");

  // 🔹 USER
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

  // 🔹 POSTS
  useEffect(() => {
    fetch("http://localhost:8000/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data.member || []))
      .catch((err) => console.error(err));
  }, []);

  // 🔹 DELETE
  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce post ?")) return;

    try {
      await fetch(`http://localhost:8000/api/posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // 🔹 FILTER
  const myPosts = user
    ? posts
        .filter((post) => post.user?.["@id"] === `/api/users/${user.id}`)
        .sort((a, b) => {
          if (sortOrder === "desc") {
            return new Date(b.created_at) - new Date(a.created_at);
          } else {
            return new Date(a.created_at) - new Date(b.created_at);
          }
        })
    : [];

  return (
    <div className="w-full max-w-6xl mx-auto p-6 text-white">
      {/* HEADER */}
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#E25822] shrink-0">
          Mes posts
        </h1>

        <div className="flex items-center gap-3 self-end sm:ml-auto">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-[#121212] border border-[#2A2A2A] text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-[#E25822]"
          >
            <option value="desc">Plus récents</option>
            <option value="asc">Plus anciens</option>
          </select>

          <Link to="/createpost">
            <button className="bg-[#E25822] px-4 py-2 rounded-lg text-white text-sm hover:opacity-90 transition cursor-pointer">
              + Créer un post
            </button>
          </Link>
        </div>
      </div>

      {/* EMPTY */}
      {myPosts.length === 0 ? (
        <div className="text-center text-gray-400 mt-10">
          <p>Aucun post pour le moment</p>
        </div>
      ) : (
        /* GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myPosts.map((post) => (
            <div
              key={post.id}
              className="bg-[#121212] border border-[#2A2A2A] rounded-xl overflow-hidden hover:border-[#E25822] transition"
            >
              {/* IMAGE */}
              {post.image && (
                <img
                  src={`http://localhost:8000${post.image}`}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              )}

              {/* CONTENT */}
              <div className="p-4 space-y-3">
                <h2 className="text-[#E25822] font-semibold">{post.title}</h2>

                <p className="text-gray-300 text-sm line-clamp-3">
                  {post.description}
                </p>

                {/* FOOTER */}
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {new Date(post.created_at).toLocaleDateString("fr-FR")}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedPost(post)}
                      className="px-3 py-1 text-xs border border-[#E25822] text-[#E25822] rounded-lg hover:bg-[#E25822] hover:text-white transition cursor-pointer"
                    >
                      Commentaires
                    </button>

                    <button
                      onClick={() => handleDelete(post.id)}
                      className="px-3 py-1 text-xs border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition cursor-pointer"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedPost && (
        <PostsModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </div>
  );
}

export default MyPosts;
