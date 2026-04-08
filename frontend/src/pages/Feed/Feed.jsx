import { useEffect, useState } from "react";
import PostsSlider from "./PostsSlider/PostsSlider";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const postsPerPage = 6;

  useEffect(() => {
    fetch("http://localhost:8000/api/posts")
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
    return (
      <div className="text-center mt-10 text-white">
        Chargement des posts...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500">Erreur : {error}</div>
    );
  }

  const featuredPosts = [...posts]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase()),
  );
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F1F1F1] px-6 py-6">
      <h1 className="text-3xl font-bold text-[#E25822] mb-8 text-center">
        Feed
      </h1>

      <div className="max-w-3xl mx-auto mb-10">
        <PostsSlider posts={featuredPosts} />
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
          currentPosts.map((post) => (
            <div
              key={post.id}
              className="bg-[#121212] border border-[#2A2A2A] rounded-xl overflow-hidden hover:border-[#E25822] hover:scale-[1.02] transition duration-200"
            >
              {post.image && (
                <img
                  src={`http://localhost:8000${post.image}`}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-4">
                <h2 className="text-lg font-semibold text-[#E25822] mb-2">
                  {post.title}
                </h2>

                <p className="text-gray-300 text-sm mb-3">{post.description}</p>

                <small className="text-gray-500 text-xs">
                  {post.created_at
                    ? new Date(post.created_at).toLocaleString("fr-FR", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "Date inconnue"}
                </small>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          className="px-3 py-1 border border-[#2A2A2A] rounded-lg hover:border-[#E25822] transition cursor-pointer"
        >
          Prev
        </button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 border rounded-lg transition cursor-pointer ${
              currentPage === page
                ? "bg-[#E25822] text-white border-[#E25822]"
                : "border-[#2A2A2A] hover:border-[#E25822] text-gray-300"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((p) => (p < totalPages ? p + 1 : p))}
          className="px-3 py-1 border border-[#2A2A2A] rounded-lg hover:border-[#E25822] transition cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Feed;
