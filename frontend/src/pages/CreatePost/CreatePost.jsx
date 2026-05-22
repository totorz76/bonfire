import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PostImage from "../../components/PostImage/PostImage";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();

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

      await fetch("http://localhost:8000/api/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      navigate("/myposts");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la création");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold text-[#E25822] mb-6">Créer un post</h1>

      {/* GRID RESPONSIVE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* FORMULAIRE */}
        <form
          onSubmit={handleCreate}
          className="bg-[#121212] border border-[#2A2A2A] p-6 rounded-xl space-y-4"
        >
          {/* TITLE */}
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

          {/* DESCRIPTION */}
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

          {/* FILE */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400">Fichier</label>

            <div
              onClick={() => document.getElementById("fileInput").click()}
              className="w-full bg-[#1a1a1a] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-gray-300 cursor-pointer hover:border-[#E25822] transition"
            >
              {file ? file.name : "Choisir une image ou une vidéo"}
            </div>

            <input
              id="fileInput"
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-[#E25822] py-2 rounded-lg text-white text-sm hover:opacity-90 transition"
          >
            Publier
          </button>
        </form>

        {/* PREVIEW */}
        <div className="bg-[#121212] border border-[#2A2A2A] p-4 rounded-xl max-w-full overflow-hidden">
          {preview && file?.type.startsWith("image") && (
            <PostImage src={preview} alt="Aperçu" variant="preview" />
          )}

          {preview && file?.type.startsWith("video") && (
            <video
              controls
              className="w-full h-48 max-h-48 object-contain bg-[#0A0A0A] rounded-lg"
            >
              <source src={preview} />
            </video>
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
