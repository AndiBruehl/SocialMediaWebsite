import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/api/axiosInstance"; // ⬅️ oder je nach Pfad

import "./ProfileEdit.css";

const EditProfile = () => {
  const { userId } = useParams(); // userId aus der URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    desc: "",
    location: "",
    from: "",
    relationship: 1,
  });

  const [profilePreview, setProfilePreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const profileInputRef = useRef();
  const coverInputRef = useRef();

  const [localUser] = useState(() => {
    const raw = localStorage.getItem("user");
    try {
      const parsed = JSON.parse(raw);
      return parsed?.user || parsed || null;
    } catch {
      return null;
    }
  });

  console.log("📦 userId from URL:", userId);
  console.log("🧠 localUser._id from localStorage:", localUser?._id);

  const token = localStorage.getItem("token");

  // Beim ersten Mount: Zugriffsprüfung und Daten vorbefüllen
  // useEffect(() => {
  //   if (!localUser || localUser._id !== userId) {
  //     alert("Unberechtigter Zugriff.");
  //     navigate("/");
  //     return;
  //   }

  //   setFormData({
  //     username: localUser.username || "",
  //     desc: localUser.desc || "",
  //     location: localUser.location || "",
  //     from: localUser.from || "",
  //     relationship: localUser.relationship || 1,
  //   });
  // }, [userId, navigate, localUser]);

  useEffect(() => {
    if (!localUser || localUser._id !== userId) {
      alert("Unberechtigter Zugriff.");
      navigate("/");
      return;
    }

    setFormData({
      username: localUser.username || "",
      desc: localUser.desc || "",
      location: localUser.location || "",
      from: localUser.from || "",
      relationship: localUser.relationship || 1,
    });
  }, [userId, navigate, localUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("username", formData.username);
    data.append("desc", formData.desc);
    data.append("location", formData.location);
    data.append("from", formData.from);
    data.append("relationship", formData.relationship);

    if (profileFile) data.append("profilePicture", profileFile);
    if (coverFile) data.append("coverPicture", coverFile);

    try {
      const res = await axiosInstance.put(`/users/${userId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profil aktualisiert.");
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate(`/profile/${userId}`);
    } catch (err) {
      console.error(
        "❌ Fehler beim Update:",
        err?.response?.data || err.message
      );
      alert(
        `Update fehlgeschlagen: ${err?.response?.data?.message || err.message}`
      );
    }
  };

  return (
    <div className="edit-profile-page">
      <h2>Profil bearbeiten</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>Username:</label>
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <label>Bio:</label>
        <textarea name="desc" value={formData.desc} onChange={handleChange} />

        <label>Location:</label>
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
        />

        <label>From:</label>
        <input name="from" value={formData.from} onChange={handleChange} />

        <label>Relationship:</label>
        <select
          name="relationship"
          value={formData.relationship}
          onChange={handleChange}
        >
          <option value={1}>Single</option>
          <option value={2}>In a relationship</option>
          <option value={3}>It's complicated</option>
        </select>

        <div>
          <label>Profilbild:</label>
          <input
            type="file"
            accept="image/*"
            ref={profileInputRef}
            onChange={handleProfileChange}
          />
          {profilePreview && (
            <img src={profilePreview} alt="Preview" height="100" />
          )}
        </div>

        <div>
          <label>Coverbild:</label>
          <input
            type="file"
            accept="image/*"
            ref={coverInputRef}
            onChange={handleCoverChange}
          />
          {coverPreview && (
            <img src={coverPreview} alt="Preview" height="100" />
          )}
        </div>

        <button type="submit">Speichern</button>
      </form>
    </div>
  );
};

export default EditProfile;
