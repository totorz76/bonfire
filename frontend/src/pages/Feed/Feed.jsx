import { useEffect, useState } from "react";
import PostsSlider from "./PostsSlider/PostsSlider";
import { useNavigate } from "react-router-dom";
import PostsModal from "./PostsModal/PostsModal";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedPosts, setExpandedPosts] = useState({});
  const postsPerPage = 9;
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setSelectedPost(null);
    setIsModalOpen(false);
  };

  const openPost = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };
  const toggleDescription = (postId) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };
  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/posts");
      if (!res.ok) {
        throw new Error("Erreur lors du chargement des posts");
      }
      const data = await res.json();
      setPosts(data?.member || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8000/api/posts/${postId}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) return;

      const updatedPostRes = await fetch(
        `http://localhost:8000/api/posts/${postId}`,
      );
      const updatedPost = await updatedPostRes.json();

      setPosts((prevPosts) =>
        prevPosts.map((post) => (post.id === postId ? updatedPost : post)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Chargement...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-400">
        {error}
      </div>
    );
  }

  const sortedPosts = [...posts].sort((a, b) =>
    sortOrder === "desc"
      ? new Date(b.created_at) - new Date(a.created_at)
      : new Date(a.created_at) - new Date(b.created_at),
  );

  const filteredPosts = sortedPosts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const indexOfLastPost = currentPage * postsPerPage;
  const currentPosts = filteredPosts.slice(
    indexOfLastPost - postsPerPage,
    indexOfLastPost,
  );

  const featuredPosts = [...posts]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return (
    <div className="bg-[#0A0A0A] text-[#F1F1F1] px-6 py-6">
      <h1 className="text-3xl font-bold text-[#E25822] mb-8 text-center">
        Feed
      </h1>

      <div className="max-w-3xl mx-auto mb-10">
        <PostsSlider posts={featuredPosts} onViewPost={openPost} />
      </div>

      <div className="flex gap-4 mb-6 justify-center">
        <button
          onClick={() => {
            setSortOrder("desc");
            setCurrentPage(1);
          }}
          className={`px-4 py-2 rounded-lg border cursor-pointer hover:bg-[#0a0a0a] ${
            sortOrder === "desc"
              ? "bg-[#E25822] text-white border-[#E25822]"
              : "border-[#2A2A2A]"
          }`}
        >
          Récent
        </button>

        <button
          onClick={() => {
            setSortOrder("asc");
            setCurrentPage(1);
          }}
          className={`px-4 py-2 rounded-lg border cursor-pointer hover:bg-[#E25822] ${
            sortOrder === "asc"
              ? "bg-[#E25822] text-white border-[#E25822]"
              : "border-[#2A2A2A]"
          }`}
        >
          Ancien
        </button>
      </div>

      <input
        type="text"
        placeholder="Rechercher un post..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        className="w-full max-w-xl mx-auto block mb-8 px-4 py-2 bg-[#121212] border border-[#2A2A2A] rounded-lg text-white focus:outline-none focus:border-[#E25822]"
      />

      <div className="grid gap-6 max-w-6xl mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {currentPosts.length === 0 ? (
          <p className="text-center text-gray-400 col-span-full">
            Aucun post trouvé
          </p>
        ) : (
          currentPosts.map((post) => {
            const isLiked = post.reactions?.some((reaction) => {
              if (typeof reaction.user === "string") {
                return reaction.user === `/api/users/${userId}`;
              }
              if (typeof reaction.user === "object") {
                return reaction.user.id === Number(userId);
              }
              return false;
            });

            return (
              <div
                key={post.id}
                className="bg-[#121212] border border-[#2A2A2A] rounded-xl overflow-hidden hover:border-[#E25822] transition"
              >
                {post.image && (
                  <img
                    src={`http://localhost:8000${post.image}`}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}

                <div className="p-4">
                  <h2 className="text-[#E25822] font-semibold mb-2">
                    {post.title}
                  </h2>

                  <p
                    className={`text-gray-300 text-sm mb-3 ${
                      expandedPosts[post.id]
                        ? "whitespace-normal break-words"
                        : "line-clamp-3"
                    }`}
                  >
                    {post.description}
                  </p>

                  {post.description.length > 50 && (
                    <button
                      onClick={() => toggleDescription(post.id)}
                      className="text-xs text-[#E25822] hover:underline mb-3"
                    >
                      {expandedPosts[post.id] ? "Voir moins" : "Voir la suite"}
                    </button>
                  )}

                  <div className="text-sm text-gray-500 mb-2">
                    {post.user?.pseudo}
                  </div>

                  {/* 🔥 NOUVEAU LAYOUT PROPRE */}
                  <div className="flex flex-col gap-3">
                    {/* DATE EN HAUT */}
                    <small className="text-gray-500 text-xs">
                      {new Date(post.created_at).toLocaleString("fr-FR")}
                    </small>

                    {/* ACTIONS EN BAS */}
                    <div className="flex items-center justify-between">
                      {/* LIKE */}
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-lg border transition-all duration-200 cursor-pointer ${
                          isLiked
                            ? "bg-[#E25822] text-white border-[#E25822] scale-105"
                            : "bg-transparent text-gray-400 border-[#2A2A2A] hover:border-[#E25822] hover:text-white"
                        }`}
                      >
                        <span
                          className={`${isLiked ? "text-white" : "text-gray-400"}`}
                        >
                          🔥
                        </span>
                        {post.reactions?.length || 0}
                      </button>

                      {/* BUTTON MODAL */}
                      <button
                        onClick={() => openPost(post)}
                        className="px-3 py-1 text-sm border border-[#E25822] text-[#E25822] rounded-lg hover:bg-[#E25822] hover:text-white transition cursor-pointer"
                      >
                        Voir le post
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
        <button
          onClick={() => {
            setCurrentPage((p) => Math.max(p - 1, 1));
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="px-3 py-1 border border-[#2A2A2A] rounded-lg hover:border-[#E25822]"
        >
          Prev
        </button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`px-3 py-1 rounded-lg ${
              currentPage === page
                ? "bg-[#E25822] text-white"
                : "border border-[#2A2A2A]"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => {
            setCurrentPage((p) =>
              indexOfLastPost < filteredPosts.length ? p + 1 : p,
            );
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="px-3 py-1 border border-[#2A2A2A] rounded-lg hover:border-[#E25822]"
        >
          Next
        </button>
      </div>

      <PostsModal post={selectedPost} onClose={closeModal} />
    </div>
  );
}

export default Feed;
