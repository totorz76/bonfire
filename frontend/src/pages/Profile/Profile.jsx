import { useEffect, useState, useRef } from "react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState("");
  const [posts, setPosts] = useState([]);
  const fileInputRef = useRef(null);

  // ---------------- FETCH USER ----------------
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

  // ---------------- FETCH POSTS ----------------
  useEffect(() => {
    fetch("http://localhost:8000/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data.member || []))
      .catch((err) => console.error(err));
  }, []);

  // ---------------- FILTER USER POSTS ----------------
  const myPosts = posts.filter((post) => {
    if (!user) return false;
    return post.user?.["@id"] === `/api/users/${user.id}`;
  });

  const postCount = myPosts.length;

  const likeCount = myPosts.reduce(
    (total, post) => total + (post.reactions?.length || 0),
    0,
  );

  const commentCount = myPosts.reduce(
    (total, post) => total + (post.comments?.length || 0),
    0,
  );

  // ---------------- BIO SAVE ----------------
  const handleSaveBio = async () => {
    const token = localStorage.getItem("token");

    try {
      await fetch("http://localhost:8000/api/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bio }),
      });

      fetchUser();
    } catch (error) {
      console.error(error);
    }
  };

  // ---------------- AVATAR ----------------
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      await fetch("http://localhost:8000/api/me/avatar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      fetchUser(); // refresh user
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) return <div className="text-white">Chargement...</div>;

  const level = user.level;
  const xpProgress = user.xpProgress;
  const currentTitleName = user.currentTitle?.nom ?? "—";
  const nextTitle = user.nextTitle;

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
      {/* LEFT */}
      <div className="md:col-span-2 space-y-6">
        {/* AVATAR */}
        <div className="flex flex-col items-center gap-2">
          <img
            src={
              user.avatar
                ? `http://localhost:8000${user.avatar}`
                : "http://localhost:8000/uploads/default-avatar.png"
            }
            alt="avatar"
            onClick={handleImageClick}
            className="w-24 h-24 rounded-full object-cover border border-[#2A2A2A] cursor-pointer hover:opacity-80 transition"
          />

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />

          {/* PSEUDO */}
          <h2 className="text-lg font-semibold text-[#E25822]">
            {user.pseudo}
          </h2>

          {/* TITRE RPG */}
          <span className="text-xs bg-[#1a1a1a] border border-[#2A2A2A] px-3 py-1 rounded-full text-gray-300">
            {currentTitleName}
          </span>
        </div>

        {/* XP BAR */}
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

        {/* INFOS */}
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-gray-400">Email:</span>
            <span className="ml-2">{user.email}</span>
          </div>

          <div>
            <span className="text-gray-400">Titre:</span>
            <span className="ml-2 text-[#E25822]">
              {currentTitleName}
            </span>
          </div>
        </div>

        {/* BIO */}
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
            className="mt-2 px-4 py-2 bg-[#E25822] rounded-lg text-white text-sm hover:opacity-90 transition cursor-pointer"
          >
            Sauvegarder
          </button>
        </div>
      </div>

      {/* RIGHT */}
      <div className="space-y-4">
        {/* ACTIVITÉ */}
        <div className="bg-[#121212] border border-[#2A2A2A] p-4 rounded-xl">
          <h2 className="text-[#E25822] font-semibold mb-3">Activité</h2>

          <p className="text-sm text-gray-400">Posts : {postCount}</p>
          <p className="text-sm text-gray-400">Likes reçus : {likeCount}</p>
          <p className="text-sm text-gray-400">Commentaires : {commentCount}</p>
        </div>

        {/* COMMUNAUTÉ */}
        <div className="bg-[#121212] border border-[#2A2A2A] p-4 rounded-xl">
          <h2 className="text-[#E25822] font-semibold mb-3">Communauté</h2>

          <p className="text-sm text-gray-400">
            Followers : {user.followers?.length || 0}
          </p>

          <p className="text-sm text-gray-400">
            Following : {user.following?.length || 0}
          </p>
        </div>

        {/* PROGRESSION */}
        <div className="bg-[#121212] border border-[#2A2A2A] p-4 rounded-xl">
          <h2 className="text-[#E25822] font-semibold mb-3">Progression</h2>

          <p className="text-sm text-gray-400">Niveau actuel : {level}</p>

          {nextTitle ? (
            <p className="text-sm text-gray-400">
              Prochain titre :{" "}
              <span className="text-[#E25822]">{nextTitle.nom}</span> (niveau{" "}
              {nextTitle.niveau_min})
            </p>
          ) : (
            <p className="text-sm text-yellow-400">🎉 Niveau max atteint</p>
          )}
        </div>
      </div>
    </div>
  );
}
