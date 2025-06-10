import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav style={{ padding: "1rem", background: "#eee" }}>
      <Link to="/">Login</Link> | <Link to="/posts">Posts</Link> | <Link to="/add">Add Post</Link>
    </nav>
  );
}
