import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const API_URL = "http://localhost:8000/api";

export default function Profile() {
  const { userId: userIdParam } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState("");
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [followLoading, setFollowLoading] = useState(false);
  const fileInputRef = useRef(null);

  const isOwnProfile =
    Boolean(currentUser) &&
    (!userIdParam || Number(userIdParam) === Number(currentUser.id));

  const fetchUser = async () => {
    if (!currentUser) return;

    const token = localStorage.getItem("token");
    const ownProfile =
      !userIdParam || Number(userIdParam) === Number(currentUser.id);
    const url = ownProfile
      ? `${API_URL}/me`
      : `${API_URL}/users/${userIdParam}/profile`;

    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        setUser(null);
        setError("Profil introuvable.");
        return;
      }

      setError(null);

      const data = await res.json();
      setUser(data);
      setBio(data.bio || "");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!currentUser) return;

    setUser(null);
    setError(null);
    fetchUser();
  }, [userIdParam, currentUser?.id]);

  useEffect(() => {
    fetch(`${API_URL}/posts`)
      .then((res) => res.json())
      .then((data) => setPosts(data.member || []))
      .catch((err) => console.error(err));
  }, []);

  const userPosts = posts.filter((post) => {
    if (!user) return false;
    const postUserId =
      post.user?.id ?? Number(post.user?.["@id"]?.split("/").pop());
    return postUserId === user.id;
  });

  const postCount = userPosts.length;
  const likeCount = userPosts.reduce(
    (total, post) => total + (post.reactions?.length || 0),
    0,
  );
  const commentCount = userPosts.reduce(
    (total, post) => total + (post.comments?.length || 0),
    0,
  );

  const handleSaveBio = async () => {
    const token = localStorage.getItem("token");

    try {
      await fetch(`${API_URL}/me`, {
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

  const handleImageClick = () => {
    if (!isOwnProfile) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      await fetch(`${API_URL}/me/avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      fetchUser();
    } catch (error) {
      console.error(error);
    }
  };

  const handleFollow = async () => {
    if (isOwnProfile || !user) return;

    const token = localStorage.getItem("token");
    setFollowLoading(true);

    try {
      const res = await fetch(`${API_URL}/users/${user.id}/follow`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Erreur");
        return;
      }

      setUser((prev) => ({
        ...prev,
        isFollowing: data.following,
        followersCount: data.followersCount,
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setFollowLoading(false);
    }
  };

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4">
        <p>{error}</p>
        <button
          type="button"
          onClick={() => navigate("/feed")}
          className="text-[#E25822] hover:underline cursor-pointer"
        >
          Retour au feed
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Chargement...
      </div>
    );
  }

  const level = user.level;
  const xpProgress = user.xpProgress;
  const currentTitleName = user.currentTitle?.nom ?? "—";
  const nextTitle = user.nextTitle;
  const followersCount =
    user.followersCount ?? user.followers?.length ?? 0;
  const followingCount =
    user.followingCount ?? user.following?.length ?? 0;

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
      <div className="md:col-span-2 space-y-6">
        <div className="flex flex-col items-center gap-2">
          <img
            src={
              user.avatar
                ? `http://localhost:8000${user.avatar}`
                : "http://localhost:8000/uploads/default-avatar.png"
            }
            alt="avatar"
            onClick={handleImageClick}
            className={`w-24 h-24 rounded-full object-cover border border-[#2A2A2A] ${
              isOwnProfile
                ? "cursor-pointer hover:opacity-80 transition"
                : ""
            }`}
          />

          {isOwnProfile && (
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          )}

          <h2 className="text-lg font-semibold text-[#E25822]">
            {user.pseudo}
          </h2>

          <span className="text-xs bg-[#1a1a1a] border border-[#2A2A2A] px-3 py-1 rounded-full text-gray-300">
            {currentTitleName}
          </span>

          {!isOwnProfile && (
            <button
              type="button"
              onClick={handleFollow}
              disabled={followLoading}
              className={`mt-2 px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer disabled:opacity-50 ${
                user.isFollowing
                  ? "border border-[#2A2A2A] text-gray-300 hover:border-red-500 hover:text-red-400"
                  : "bg-[#E25822] text-white hover:opacity-90"
              }`}
            >
              {followLoading
                ? "..."
                : user.isFollowing
                  ? "Ne plus suivre"
                  : "Suivre"}
            </button>
          )}
        </div>

        <div>
          <div className="w-full bg-[#2A2A2A] rounded-full h-3">
            <div
              className="bg-[#E25822] h-3 rounded-full transition-all"
              style={{ width: `${xpProgress}%` }}
            />
          </div>

          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <span>Followers: {followersCount}</span>
            <span>Niveau: {level}</span>
          </div>

          <p className="text-xs text-gray-500 mt-1">{xpProgress} / 100 XP</p>
        </div>

        <div className="space-y-2 text-sm">
          {isOwnProfile && user.email && (
            <div>
              <span className="text-gray-400">Email:</span>
              <span className="ml-2">{user.email}</span>
            </div>
          )}

          <div>
            <span className="text-gray-400">Titre:</span>
            <span className="ml-2 text-[#E25822]">{currentTitleName}</span>
          </div>
        </div>

        <div>
          {isOwnProfile ? (
            <>
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
            </>
          ) : (
            <p className="text-gray-300 text-sm whitespace-pre-line">
              {user.bio || "Aucune bio pour le moment."}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-[#121212] border border-[#2A2A2A] p-4 rounded-xl">
          <h2 className="text-[#E25822] font-semibold mb-3">Activité</h2>
          <p className="text-sm text-gray-400">Posts : {postCount}</p>
          <p className="text-sm text-gray-400">Likes reçus : {likeCount}</p>
          <p className="text-sm text-gray-400">
            Commentaires : {commentCount}
          </p>
        </div>

        <div className="bg-[#121212] border border-[#2A2A2A] p-4 rounded-xl">
          <h2 className="text-[#E25822] font-semibold mb-3">Communauté</h2>
          <p className="text-sm text-gray-400">
            Followers : {followersCount}
          </p>
          <p className="text-sm text-gray-400">
            Following : {followingCount}
          </p>
        </div>

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
            <p className="text-sm text-yellow-400">Niveau max atteint</p>
          )}
        </div>
      </div>
    </div>
  );
}
