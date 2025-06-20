import { Link, useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <nav style={{ padding: "1rem", background: "#eee" }}>
      <Link to="/">Login</Link> | <Link to="/posts">Posts</Link> | <Link to="/add">Add Post</Link> |{" "}
      <Link to="/chat">Chat</Link>
      {username && (
        <>
          <span style={{ marginLeft: "1rem" }}>
            Hello, <strong>{username}</strong>
          </span>
          <button style={{ marginLeft: "1rem" }} onClick={handleLogout}>
            Logout
          </button>
        </>
      )}
    </nav>
  );
}
