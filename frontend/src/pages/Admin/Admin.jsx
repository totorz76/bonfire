import { useEffect, useState } from "react";
import { adminFetch } from "../../utils/auth";

export default function Admin() {
  const token = localStorage.getItem("token");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [statsRes, usersRes, postsRes] = await Promise.all([
        adminFetch("/stats", token),
        adminFetch("/users", token),
        adminFetch("/posts", token),
      ]);

      if (!statsRes.ok || !usersRes.ok || !postsRes.ok) {
        setError("Accès refusé ou erreur serveur");
        return;
      }

      setStats(await statsRes.json());
      setUsers(await usersRes.json());
      setPosts(await postsRes.json());
    } catch {
      setError("Impossible de charger les données admin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeletePost = async (id) => {
    if (!confirm("Supprimer ce post ?")) return;

    const res = await adminFetch(`/posts/${id}`, token, { method: "DELETE" });
    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      setStats((prev) => (prev ? { ...prev, posts: prev.posts - 1 } : prev));
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm("Supprimer cet utilisateur et tout son contenu ?")) return;

    const res = await adminFetch(`/users/${id}`, token, { method: "DELETE" });
    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Erreur lors de la suppression");
      return;
    }

    setUsers((prev) => prev.filter((u) => u.id !== id));
    setStats((prev) => (prev ? { ...prev, users: prev.users - 1 } : prev));
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 px-4 text-center">
        Chargement du panneau admin...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-400 px-4 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 min-w-0">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#E25822] mb-1 sm:mb-2">
          Administration
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Gestion des utilisateurs et des publications
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-10">
        <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-4 sm:p-6">
          <p className="text-gray-400 text-xs sm:text-sm">Utilisateurs</p>
          <p className="text-2xl sm:text-3xl font-bold mt-1">
            {stats?.users ?? 0}
          </p>
        </div>
        <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-4 sm:p-6">
          <p className="text-gray-400 text-xs sm:text-sm">Publications</p>
          <p className="text-2xl sm:text-3xl font-bold mt-1">
            {stats?.posts ?? 0}
          </p>
        </div>
      </div>

      <section className="mb-8 sm:mb-10">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
          Utilisateurs
        </h2>

        {users.length === 0 ? (
          <p className="text-gray-400 text-sm">Aucun utilisateur.</p>
        ) : (
          <>
            {/* Mobile : cartes */}
            <div className="flex flex-col gap-3 md:hidden">
              {users.map((user) => (
                <article
                  key={user.id}
                  className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold truncate">{user.pseudo}</p>
                      <p className="text-gray-400 text-sm break-all">
                        {user.email}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteUser(user.id)}
                      className="shrink-0 text-red-400 hover:text-red-300 text-sm cursor-pointer px-2 py-1 border border-red-500/40 rounded-lg"
                    >
                      Supprimer
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-400">
                    <span>
                      <span className="text-gray-500">XP :</span> {user.xp}
                    </span>
                    <span className="break-all">
                      <span className="text-gray-500">Rôles :</span>{" "}
                      {user.roles?.join(", ") || "ROLE_USER"}
                    </span>
                  </div>
                </article>
              ))}
            </div>

            {/* Desktop : tableau */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-[#2A2A2A]">
              <table className="w-full text-sm min-w-[640px]">
                <thead className="bg-[#121212] text-gray-400">
                  <tr>
                    <th className="text-left p-3">Pseudo</th>
                    <th className="text-left p-3">Email</th>
                    <th className="text-left p-3">Rôles</th>
                    <th className="text-left p-3">XP</th>
                    <th className="text-right p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-t border-[#2A2A2A] hover:bg-[#121212]/50"
                    >
                      <td className="p-3">{user.pseudo}</td>
                      <td className="p-3 text-gray-400 max-w-[200px] truncate">
                        {user.email}
                      </td>
                      <td className="p-3 text-gray-400">
                        {user.roles?.join(", ") || "ROLE_USER"}
                      </td>
                      <td className="p-3">{user.xp}</td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-400 hover:text-red-300 cursor-pointer"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      <section>
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
          Publications
        </h2>
        <div className="flex flex-col gap-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <p className="font-semibold break-words">{post.title}</p>
                <p className="text-gray-400 text-sm mt-1">
                  par {post.user?.pseudo ?? "—"} ·{" "}
                  {post.created_at
                    ? new Date(post.created_at).toLocaleDateString("fr-FR")
                    : "—"}
                </p>
                {post.description && (
                  <p className="text-gray-500 text-sm mt-2 line-clamp-2 sm:line-clamp-1">
                    {post.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleDeletePost(post.id)}
                className="w-full sm:w-auto shrink-0 text-center text-red-400 hover:text-red-300 text-sm cursor-pointer px-3 py-2 border border-red-500/40 rounded-lg sm:border-0 sm:px-0 sm:py-0"
              >
                Supprimer
              </button>
            </article>
          ))}
          {posts.length === 0 && (
            <p className="text-gray-400 text-sm">Aucune publication.</p>
          )}
        </div>
      </section>
    </div>
  );
}
