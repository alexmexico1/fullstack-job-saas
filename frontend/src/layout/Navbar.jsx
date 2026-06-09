export default function Navbar() {
  return (
    <div style={styles.nav}>
      <div>
        <h2>Welcome Back 👋</h2>
      </div>

      <div style={styles.profile}>
        <img
          src="https://i.pravatar.cc/150?img=12"
          alt=""
          style={styles.avatar}
        />

        <div>
          <h4>Alex</h4>
          <p style={{ margin: 0 }}>
            Software Engineer
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },

  profile: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  avatar: {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
  },
};