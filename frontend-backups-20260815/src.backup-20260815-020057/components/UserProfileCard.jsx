export default function UserProfileCard() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  return (
    <div style={styles.card}>
      <h3>Profile</h3>

      <p>
        <strong>Name:</strong>{" "}
        {user?.name}
      </p>

      <p>
        <strong>Email:</strong>{" "}
        {user?.email}
      </p>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.08)",
  },
};