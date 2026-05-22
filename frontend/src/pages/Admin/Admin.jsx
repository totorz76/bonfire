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
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Chargement du panneau admin...
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#E25822] mb-2">
        Administration
      </h1>
      <p className="text-gray-400 mb-8">
        Gestion des utilisateurs et des publications
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
          <p className="text-gray-400 text-sm">Utilisateurs</p>
          <p className="text-3xl font-bold">{stats?.users ?? 0}</p>
        </div>
        <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6">
          <p className="text-gray-400 text-sm">Publications</p>
          <p className="text-3xl font-bold">{stats?.posts ?? 0}</p>
        </div>
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Utilisateurs</h2>
        <div className="overflow-x-auto rounded-xl border border-[#2A2A2A]">
          <table className="w-full text-sm">
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
                  <td className="p-3 text-gray-400">{user.email}</td>
                  <td className="p-3">
                    {user.roles?.join(", ") || "ROLE_USER"}
                  </td>
                  <td className="p-3">{user.xp}</td>
                  <td className="p-3 text-right">
                    <button
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
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Publications</h2>
        <div className="flex flex-col gap-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div>
                <p className="font-semibold">{post.title}</p>
                <p className="text-gray-400 text-sm">
                  par {post.user?.pseudo ?? "—"} ·{" "}
                  {post.created_at
                    ? new Date(post.created_at).toLocaleDateString("fr-FR")
                    : "—"}
                </p>
              </div>
              <button
                onClick={() => handleDeletePost(post.id)}
                className="text-red-400 hover:text-red-300 text-sm cursor-pointer self-start sm:self-center"
              >
                Supprimer
              </button>
            </div>
          ))}
          {posts.length === 0 && (
            <p className="text-gray-400">Aucune publication.</p>
          )}
        </div>
      </section>
    </div>
  );
}
