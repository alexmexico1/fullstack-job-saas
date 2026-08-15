import { useEffect, useState } from "react";
import { useAuth } from "../services/authService.jsx";

const PHOTO_KEY = "taskflow_profile_photo";

export default function Profile() {
  const { user, logout } = useAuth();
  const [photo, setPhoto] = useState("");

  useEffect(() => {
    setPhoto(localStorage.getItem(PHOTO_KEY) || "");
  }, []);

  const handlePhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Please choose an image smaller than 2MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const value = reader.result;
      localStorage.setItem(PHOTO_KEY, value);
      setPhoto(value);
    };

    reader.readAsDataURL(file);
  };

  const name = user?.name || "Alex";
  const email = user?.email || "";

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.avatarWrap}>
          {photo ? (
            <img src={photo} alt="Profile" style={styles.avatar} />
          ) : (
            <div style={styles.placeholder}>
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <label style={styles.upload}>
          Change photo
          <input
            type="file"
            accept="image/*"
            onChange={handlePhoto}
            style={{ display: "none" }}
          />
        </label>

        <h2>{name}</h2>
        <p>Job seeker</p>
        <p>{email}</p>

        <button onClick={logout} style={styles.button}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f8fafc",
    padding: "24px",
  },
  card: {
    width: "400px",
    maxWidth: "100%",
    background: "#fff",
    padding: "40px",
    textAlign: "center",
    borderRadius: "20px",
    boxShadow: "0 5px 20px rgba(0,0,0,.08)",
  },
  avatarWrap: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "14px",
  },
  avatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #eef2ff",
  },
  placeholder: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#4f46e5",
    color: "#fff",
    fontSize: "42px",
    fontWeight: "700",
  },
  upload: {
    display: "inline-block",
    padding: "9px 15px",
    borderRadius: "9px",
    background: "#eef2ff",
    color: "#4338ca",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "12px",
  },
  button: {
    marginTop: "20px",
    padding: "12px 20px",
    border: "none",
    background: "#ef4444",
    color: "#fff",
    borderRadius: "10px",
    cursor: "pointer",
  },
};
