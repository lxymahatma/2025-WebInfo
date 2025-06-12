import { Link, useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav style={{ padding: "1rem", background: "#eee" }}>
      <Link to="/">Login</Link> | <Link to="/posts">Posts</Link> | <Link to="/add">Add Post</Link>
      <button style={{ marginLeft: "1rem" }} onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}
