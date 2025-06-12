import { useState, useEffect } from "react";

function PostList() {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const postobj = {
      title: e.target.title.value,
      body: e.target.body.value,
    };
    fetch("http://localhost:9999/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postobj),
    })
      .then((res) => res.json())
      .then((data) => {
        setPosts((prevPosts) => [data, ...prevPosts]);
        e.target.reset();
        setMessage("A new post has been added successfully!");
        setTimeout(() => setMessage(""), 3000);
      });
  };

  function deletePost(postid) {
    fetch(`http://localhost:9999/posts/${postid}`, {
      method: "DELETE",
    }).then(() => {
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postid));
    });
  }

  useEffect(() => {
    fetch("http://localhost:9999/posts")
      .then((response) => response.json())
      .then((data) => setPosts(data.slice(0, 10)));
  }, []);

  return (
    <div>
      <h2>Posts</h2>
      <form className="post-form" onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Title" required />
        <textarea name="body" placeholder="Body" required></textarea>
        <button type="submit">Add Post</button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {posts.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
          <button className="delete-button" onClick={() => deletePost(post.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default PostList;
