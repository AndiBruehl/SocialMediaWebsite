import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProfileEdit = () => {
  const { userId } = useParams();
  const testUserId = "685edfa69d8de17c6b7a0b07";
  const effectiveUserId = userId || testUserId;

  const [userData, setUserData] = useState({
    name: "",
    location: "",
    origin: "",
    bio: "",
    profilePicture: "",
    coverPicture: "",
  });

  // JWT aus localStorage holen
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/${effectiveUserId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = res.data;

        setUserData({
          name: data.name || "",
          location: data.location || "",
          origin: data.origin || "",
          bio: data.bio || "",
          profilePicture: data.profilePicture || "",
          coverPicture: data.coverPicture || "",
        });
      } catch (err) {
        console.error("Fehler beim Laden des Profils:", err);
      }
    };

    fetchUser();
  }, [effectiveUserId, token]);

  const handleChange = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/users/${effectiveUserId}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Profil erfolgreich aktualisiert!");
    } catch (err) {
      console.error("Fehler beim Aktualisieren:", err);
      alert("Aktualisierung fehlgeschlagen!");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Profil bearbeiten
      </h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Ort</label>
          <input
            type="text"
            name="location"
            value={userData.location}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Herkunft</label>
          <input
            type="text"
            name="origin"
            value={userData.origin}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Beschreibung</label>
          <input
            type="text"
            name="bio"
            value={userData.bio}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Coverbild-URL</label>
          <input
            type="text"
            name="coverPicture"
            value={userData.coverPicture}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Profilbild-URL</label>
          <input
            type="text"
            name="profilePicture"
            value={userData.profilePicture}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="col-span-2 text-center mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Speichern
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;
