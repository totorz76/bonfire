import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostImage from "../../components/PostImage/PostImage";
import YoutubeEmbed from "../../components/YoutubeEmbed/YoutubeEmbed";
import { isValidYoutubeUrl, toYoutubeEmbedUrl } from "../../utils/youtube";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeError, setYoutubeError] = useState("");
  const [mediaError, setMediaError] = useState("");

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const youtubeEmbedPreview = toYoutubeEmbedUrl(youtubeUrl);
  const hasImage = !!file;
  const hasYoutube = !!youtubeUrl.trim();

  const clearImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const clearYoutube = () => {
    setYoutubeUrl("");
    setYoutubeError("");
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      return;
    }

    if (hasYoutube) {
      setMediaError("Retirez le lien YouTube avant d'ajouter une image.");
      e.target.value = "";
      return;
    }

    if (selectedFile.type.startsWith("video/")) {
      alert("Les fichiers vidéo ne sont pas autorisés. Utilisez un lien YouTube.");
      e.target.value = "";
      return;
    }

    setMediaError("");
    clearImage();
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleYoutubeChange = (e) => {
    const value = e.target.value;

    if (value.trim() && hasImage) {
      clearImage();
    }

    setYoutubeUrl(value);
    setMediaError("");

    if (!value.trim()) {
      setYoutubeError("");
      return;
    }

    setYoutubeError(
      isValidYoutubeUrl(value)
        ? ""
        : "Lien YouTube invalide (watch, youtu.be ou shorts)",
    );
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setMediaError("");

    if (hasImage && hasYoutube) {
      setMediaError("Choisissez une image ou un lien YouTube, pas les deux.");
      return;
    }

    if (hasYoutube && !isValidYoutubeUrl(youtubeUrl)) {
      setYoutubeError("Lien YouTube invalide");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const meResponse = await fetch("http://localhost:8000/api/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = await meResponse.json();

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("user", `/api/users/${user.id}`);

      if (file) {
        formData.append("file", file);
      }

      if (hasYoutube) {
        formData.append("youtubeUrl", youtubeUrl.trim());
      }

      const res = await fetch("http://localhost:8000/api/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Erreur lors de la création");
        return;
      }

      navigate("/myposts");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la création");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold text-[#E25822] mb-6">Créer un post</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form
          onSubmit={handleCreate}
          className="bg-[#121212] border border-[#2A2A2A] p-6 rounded-xl space-y-4"
        >
          <div>
            <label className="text-sm text-gray-400">Titre</label>
            <input
              type="text"
              placeholder="Titre"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 p-2 rounded-lg bg-[#1a1a1a] border border-[#2A2A2A] text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Description</label>
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full mt-1 p-2 rounded-lg bg-[#1a1a1a] border border-[#2A2A2A] text-sm resize-none"
            />
          </div>

          <p className="text-xs text-gray-500">
            Média optionnel : une image <span className="text-[#E25822]">ou</span>{" "}
            un lien YouTube (un seul choix).
          </p>

          {mediaError && (
            <p className="text-red-500 text-sm">{mediaError}</p>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400">Image</label>

            <div className="flex gap-2">
              <div
                onClick={() => !hasYoutube && fileInputRef.current?.click()}
                className={`flex-1 bg-[#1a1a1a] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-gray-300 transition ${
                  hasYoutube
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:border-[#E25822]"
                }`}
              >
                {file ? file.name : "Choisir une image"}
              </div>

              {hasImage && (
                <button
                  type="button"
                  onClick={clearImage}
                  className="shrink-0 px-3 py-2 text-sm border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 transition cursor-pointer"
                >
                  Retirer
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={hasYoutube}
              className="hidden"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Lien YouTube</label>

            <div className="flex gap-2 mt-1">
              <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={handleYoutubeChange}
                disabled={hasImage}
                className={`flex-1 p-2 rounded-lg bg-[#1a1a1a] border border-[#2A2A2A] text-sm ${
                  hasImage ? "opacity-50 cursor-not-allowed" : ""
                }`}
              />

              {hasYoutube && (
                <button
                  type="button"
                  onClick={clearYoutube}
                  className="shrink-0 px-3 py-2 text-sm border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 transition cursor-pointer"
                >
                  Retirer
                </button>
              )}
            </div>

            {youtubeError && (
              <p className="text-red-500 text-xs mt-1">{youtubeError}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#E25822] py-2 rounded-lg text-white text-sm hover:opacity-90 transition cursor-pointer"
          >
            Publier
          </button>
        </form>

        <div className="bg-[#121212] border border-[#2A2A2A] p-4 rounded-xl max-w-full overflow-hidden">
          {youtubeEmbedPreview ? (
            <YoutubeEmbed embedUrl={youtubeEmbedPreview} variant="preview" />
          ) : (
            preview &&
            file?.type.startsWith("image") && (
              <PostImage src={preview} alt="Aperçu" variant="preview" />
            )
          )}

          <div className="p-4">
            <h2 className="text-[#E25822] font-semibold mb-2">
              {title || "Titre du post"}
            </h2>

            <p className="text-gray-300 mt-2 break-words whitespace-pre-line">
              {description || "Description du post"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
