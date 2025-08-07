import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/api/axiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProfile = () => {
  const { userId } = useParams();
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
  const [saving, setSaving] = useState(false);

  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const [localUser] = useState(() => {
    const raw = localStorage.getItem("user");
    try {
      const parsed = JSON.parse(raw);
      return parsed?.user || parsed || null;
    } catch {
      return null;
    }
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!localUser || localUser._id !== userId) {
      toast.error("Unberechtigter Zugriff.");
      navigate("/");
      return;
    }
    setFormData({
      username: localUser.username || "",
      desc: localUser.desc || "",
      location: localUser.location || "",
      from: localUser.from || "",
      relationship: Number(localUser.relationship) || 1,
    });
  }, [userId, navigate, localUser]);

  useEffect(() => {
    return () => {
      if (profilePreview) URL.revokeObjectURL(profilePreview);
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [profilePreview, coverPreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "relationship" ? Number(value) : value,
    }));
  };

  const handleProfileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const clearProfileImage = () => {
    setProfileFile(null);
    if (profilePreview) URL.revokeObjectURL(profilePreview);
    setProfilePreview(null);
    if (profileInputRef.current) profileInputRef.current.value = "";
  };

  const clearCoverImage = () => {
    setCoverFile(null);
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverPreview(null);
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);

    const data = new FormData();
    data.append("username", formData.username.trim());
    data.append("desc", formData.desc);
    data.append("location", formData.location);
    data.append("from", formData.from);
    data.append("relationship", String(formData.relationship));
    if (profileFile) data.append("profilePicture", profileFile);
    if (coverFile) data.append("coverPicture", coverFile);

    try {
      const res = await axiosInstance.put(`/users/${userId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Profil aktualisiert.");
      localStorage.setItem("user", JSON.stringify(res.data.user || res.data));
      navigate(`/profile/${userId}`);
    } catch (err) {
      console.error(
        "❌ Fehler beim Update:",
        err?.response?.data || err.message
      );
      toast.error(
        `Update fehlgeschlagen: ${err?.response?.data?.message || err.message}`
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-200 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-slate-800/70 backdrop-blur border border-slate-700 rounded-2xl shadow-xl p-6 md:p-8">
        <h2 className="text-2xl font-bold tracking-tight mb-6">
          Profil bearbeiten
        </h2>

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Left column — text fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1">
                Username
              </label>
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Dein Benutzername"
                className="block w-full rounded-xl border border-slate-600 bg-slate-700/60 text-slate-100 placeholder-slate-400 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">
                  Location
                </label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Berlin, DE"
                  className="block w-full rounded-xl border border-slate-600 bg-slate-700/60 text-slate-100 placeholder-slate-400 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">
                  From
                </label>
                <input
                  name="from"
                  value={formData.from}
                  onChange={handleChange}
                  placeholder="Herkunft"
                  className="block w-full rounded-xl border border-slate-600 bg-slate-700/60 text-slate-100 placeholder-slate-400 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-1">Bio</label>
              <textarea
                name="desc"
                value={formData.desc}
                onChange={handleChange}
                rows={4}
                placeholder="Erzähl etwas über dich…"
                className="block w-full rounded-xl border border-slate-600 bg-slate-700/60 text-slate-100 placeholder-slate-400 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-1">
                Relationship
              </label>
              <select
                name="relationship"
                value={formData.relationship}
                onChange={handleChange}
                className="block w-full rounded-xl border border-slate-600 bg-slate-700/60 text-slate-100 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={1}>Single</option>
                <option value={2}>In a relationship</option>
                <option value={3}>Married</option>
                <option value={4}>It's complicated</option>
              </select>
            </div>
          </div>

          {/* Right column — images */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-slate-300 mb-1">
                Profilbild
              </label>
              <input
                type="file"
                accept="image/*"
                ref={profileInputRef}
                onChange={handleProfileChange}
                className="block w-full rounded-xl border border-slate-600 bg-transparent text-slate-200 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border file:border-slate-600 file:bg-slate-700 file:text-slate-200 hover:file:bg-slate-600"
              />
              <p className="text-slate-400 text-xs mt-2">
                PNG/JPG, max. ein Bild auswählen
              </p>
              {profilePreview && (
                <div className="mt-3 space-y-2">
                  <img
                    src={profilePreview}
                    alt="Profilbild-Vorschau"
                    className="w-full rounded-xl border border-slate-600"
                  />
                  <button
                    type="button"
                    onClick={clearProfileImage}
                    className="inline-flex items-center justify-center rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-100 hover:border-blue-500 transition"
                  >
                    Entfernen
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-1">
                Coverbild
              </label>
              <input
                type="file"
                accept="image/*"
                ref={coverInputRef}
                onChange={handleCoverChange}
                className="block w-full rounded-xl border border-slate-600 bg-transparent text-slate-200 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border file:border-slate-600 file:bg-slate-700 file:text-slate-200 hover:file:bg-slate-600"
              />
              <p className="text-slate-400 text-xs mt-2">
                Breites Bild empfohlen (z. B. 1500×500)
              </p>
              {coverPreview && (
                <div className="mt-3 space-y-2">
                  <img
                    src={coverPreview}
                    alt="Coverbild-Vorschau"
                    className="w-full rounded-xl border border-slate-600"
                  />
                  <button
                    type="button"
                    onClick={clearCoverImage}
                    className="inline-flex items-center justify-center rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-100 hover:border-blue-500 transition"
                  >
                    Entfernen
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="md:col-span-2 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center rounded-xl border border-slate-600 px-4 py-2 font-semibold text-slate-100 hover:border-blue-500 transition"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed px-4 py-2 font-semibold text-white shadow"
            >
              {saving ? "Speichern…" : "Speichern"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
