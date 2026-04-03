import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      // récupérer user connecté
      const meResponse = await fetch("http://localhost:8000/api/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!meResponse.ok) {
        throw new Error("Erreur récupération user");
      }

      const user = await meResponse.json();

      // FormData pour upload fichier
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("user", `/api/users/${user.id}`);

      if (file) {
        formData.append("file", file);
      }

      const response = await fetch("http://localhost:8000/api/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création");
      }

      navigate("/myposts");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div>
      <h1>Créer un post</h1>

      <div style={{ display: "flex", gap: "20px" }}>
        {/* FORMULAIRE */}
        <form onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
          />

          <button type="submit">Publier</button>
        </form>

        {/* PREVIEW */}
        <div
          style={{ border: "1px solid #ccc", padding: "10px", width: "300px" }}
        >
          <h3>Prévisualisation</h3>

          <h2>{title || "Titre du post"}</h2>
          <p>{description || "Description du post"}</p>

          {preview && (
            <>
              {file && file.type.startsWith("image") && (
                <img src={preview} alt="preview" style={{ maxWidth: "100%" }} />
              )}

              {file && file.type.startsWith("video") && (
                <video controls style={{ maxWidth: "100%" }}>
                  <source src={preview} />
                </video>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
