import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState("");

  const handleSaveBio = async () => {
    const token = localStorage.getItem("token");

    try {
      await fetch("http://localhost:8000/api/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bio: bio,
        }),
      });

      fetchUser(); // refresh
    } catch (error) {
      console.error(error);
    }
  };
  const fetchUser = () => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8000/api/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setBio(data.bio || "");
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchUser();

    const handleFocus = () => fetchUser();
    window.addEventListener("focus", handleFocus);

    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  if (!user) return <div className="text-white">Chargement...</div>;

  const level = user.level;
  const xpProgress = user.xpProgress;

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
      {/* LEFT */}
      <div className="md:col-span-2 space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <img
            src={`http://localhost:8000${user.avatar}`}
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover border border-[#2A2A2A]"
          />
          <input type="file" className="mt-3 text-sm" />
        </div>

        {/* XP */}
        <div>
          <div className="w-full bg-[#2A2A2A] rounded-full h-3">
            <div
              className="bg-[#E25822] h-3 rounded-full transition-all"
              style={{ width: `${xpProgress}%` }}
            />
          </div>

          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <span>Followers: {user.followers?.length || 0}</span>
            <span>Niveau: {level}</span>
          </div>

          <p className="text-xs text-gray-500 mt-1">{xpProgress} / 100 XP</p>
        </div>

        {/* Infos */}
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-gray-400">Email:</span>
            <span className="ml-2">{user.email}</span>
          </div>

          <div>
            <span className="text-gray-400">Rôle:</span>
            <span className="ml-2">{user.roles?.join(", ")}</span>
          </div>
        </div>

        {/* Bio */}
        <div>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full bg-[#121212] border border-[#2A2A2A] rounded-lg p-3 text-sm resize-none max-h-32"
            placeholder="Écris ta bio..."
          />

          <button
            onClick={handleSaveBio}
            className="mt-2 px-4 py-2 bg-[#E25822] rounded-lg text-white text-sm"
          >
            Sauvegarder
          </button>
        </div>
      </div>

      {/* RIGHT */}
      <div className="space-y-4">
        {/* Résumé */}
        <div className="bg-[#121212] border border-[#2A2A2A] p-4 rounded-xl">
          <h2 className="text-[#E25822] font-semibold mb-3">Résumé</h2>

          <p className="text-sm text-gray-400">
            Posts : {user.posts?.length || 0}
          </p>

          <p className="text-sm text-gray-400">
            Likes donnés : {user.reactions?.length || 0}
          </p>

          <p className="text-sm text-gray-400">
            Commentaires : {user.comments?.length || 0}
          </p>
        </div>

        {/* Réseau */}
        <div className="bg-[#121212] border border-[#2A2A2A] p-4 rounded-xl">
          <h2 className="text-[#E25822] font-semibold mb-3">Communauté</h2>

          <p className="text-sm text-gray-400">
            Followers : {user.followers?.length || 0}
          </p>

          <p className="text-sm text-gray-400">
            Following : {user.following?.length || 0}
          </p>
        </div>

        {/* Niveau */}
        <div className="bg-[#121212] border border-[#2A2A2A] p-4 rounded-xl">
          <h2 className="text-[#E25822] font-semibold mb-3">Progression</h2>

          <p className="text-sm text-gray-400">Niveau actuel : {level}</p>

          <p className="text-sm text-gray-400">
            XP restante : {100 - xpProgress}
          </p>
        </div>
      </div>
    </div>
  );
}
