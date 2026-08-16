import { useEffect, useRef, useState } from "react";
import Sidebar from "../layout/Sidebar";
import Navbar from "../layout/Navbar";
import API from "../services/api";
import { useAuth } from "../services/authService.jsx";
import { FiCamera, FiSave, FiUser } from "react-icons/fi";
import toast from "react-hot-toast";

const FALLBACK_PROFILE_PHOTO = "/profile.jpg";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const inputRef = useRef(null);
  const [name, setName] = useState(user?.name || "");
  const [photo, setPhoto] = useState(user?.profilePhoto || FALLBACK_PROFILE_PHOTO);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(user?.name || "");
    setPhoto(user?.profilePhoto || FALLBACK_PROFILE_PHOTO);
  }, [user]);

  const resizePhoto = (file) =>
    new Promise((resolve, reject) => {
      if (!file.type.startsWith("image/")) {
        reject(new Error("Please choose an image file."));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const image = new Image();
        image.onload = () => {
          const max = 512;
          const scale = Math.min(1, max / Math.max(image.width, image.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(image.width * scale));
          canvas.height = Math.max(1, Math.round(image.height * scale));
          const ctx = canvas.getContext("2d");
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.82));
        };
        image.onerror = () => reject(new Error("Could not read the image."));
        image.src = reader.result;
      };
      reader.onerror = () => reject(new Error("Could not read the file."));
      reader.readAsDataURL(file);
    });

  const handlePhoto = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const nextPhoto = await resizePhoto(file);
      setPhoto(nextPhoto);
    } catch (error) {
      toast.error(error.message);
    } finally {
      event.target.value = "";
    }
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const { data } = await API.put("/auth/profile", {
        name: name.trim(),
        profilePhoto: photo,
      });
      updateUser(data);
      toast.success("Profile saved");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="tf-app-shell">
      <Sidebar />
      <main className="tf-main">
        <Navbar />
        <section className="tf-page-header">
          <div>
            <span className="tf-eyebrow">ACCOUNT</span>
            <h1>Your profile</h1>
            <p>Keep your professional identity current across your job-search workspace.</p>
          </div>
        </section>

        <section className="tf-profile-card">
          <form onSubmit={saveProfile}>
            <div className="tf-profile-photo-area">
              <button type="button" className="tf-profile-photo" onClick={() => inputRef.current?.click()}>
                {photo ? <img src={photo} alt="Profile" /> : <FiUser size={42} />}
                <span><FiCamera size={15} /></span>
              </button>
              <input ref={inputRef} type="file" accept="image/*" onChange={handlePhoto} hidden />
              <div>
                <h2>Professional profile</h2>
                <p>Use a clear headshot so your workspace is ready for real applications.</p>
                <button type="button" className="tf-secondary-button" onClick={() => inputRef.current?.click()}>
                  <FiCamera size={15} /> Choose photo
                </button>
              </div>
            </div>

            <div className="tf-profile-fields">
              <label>
                Full name
                <input value={name} onChange={(e) => setName(e.target.value)} required />
              </label>
              <label>
                Email
                <input value={user?.email || ""} disabled />
              </label>
            </div>

            <div className="tf-profile-actions">
              <button className="tf-primary-button" disabled={saving}>
                <FiSave size={16} />
                {saving ? "Saving..." : "Save profile"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
