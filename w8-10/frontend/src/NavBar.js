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
    <nav className="navbar-container">
      <div className="navbar-links">
        <Link to="/">Login</Link> | <Link to="/posts">Posts</Link> | <Link to="/add">Add Post</Link>{" "}
        | <Link to="/chat">Chat</Link>
      </div>
      {username && (
        <div className="navbar-user">
          <span>
            Hello, <strong>{username}</strong>
          </span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}
