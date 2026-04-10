import { useEffect, useState } from "react";

function PostsModal({ post, onClose }) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔄 Charger les commentaires
  const fetchComments = async () => {
    if (!post) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/comments?post=/api/posts/${post.id}`,
      );

      const data = await res.json();
      setComments(data.member || []);
    } catch (err) {
      console.error("Erreur fetch comments:", err);
    }
  };

  // 🔁 Recharge quand post change
  useEffect(() => {
    if (!post) return;
    setNewComment("");
    fetchComments();
  }, [post]);

  // 📩 Envoyer commentaire
  const handleComment = async () => {
    try {
      const content = newComment.trim();

      if (!content || !post) return;

      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Pas de token !");
        return;
      }

      setLoading(true);

      const res = await fetch("http://localhost:8000/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/ld+json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content,
          post: `/api/posts/${post.id}`,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Erreur lors de l'envoi");
      }

      setNewComment("");
      await fetchComments();
    } catch (err) {
      console.error("Erreur POST comment:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!post) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#121212] w-full max-w-2xl p-6 rounded-xl border border-[#2A2A2A] relative">
        {/* Close */}
        <button onClick={onClose} className="absolute top-3 right-3 text-white">
          ✕
        </button>

        {/* Image */}
        {post.image && (
          <img
            src={`http://localhost:8000${post.image}`}
            className="w-full h-64 object-cover rounded-lg mb-4"
            alt=""
          />
        )}

        {/* Title */}
        <h2 className="text-xl font-bold text-[#E25822] mb-2">{post.title}</h2>

        {/* Description */}
        <p className="text-gray-300 mb-4">{post.description}</p>

        <div className="text-sm text-gray-500 mb-6">{post.user?.pseudo}</div>

        {/* Comments section */}
        <div className="border-t border-[#2A2A2A] pt-4">
          {/* Input */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Écrire un commentaire..."
              className="w-full px-3 py-2 bg-[#121212] border border-[#2A2A2A] rounded-lg text-white"
            />

            <button
              onClick={handleComment}
              disabled={loading}
              className="px-3 py-2 bg-[#E25822] text-white rounded-lg disabled:opacity-50"
            >
              {loading ? "..." : "Envoyer"}
            </button>
          </div>

          {/* List */}
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-sm">Aucun commentaire</p>
            ) : (
              comments.map((c) => (
                <div
                  key={c.id}
                  className="bg-[#0A0A0A] border border-[#2A2A2A] p-2 rounded-lg"
                >
                  <p className="text-sm text-white">{c.content}</p>
                  <small className="text-xs text-gray-500">
                    {c.user?.pseudo}
                  </small>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostsModal;
