import { useEffect, useState } from "react";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const userid = parseInt(localStorage.getItem("userId"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3001/posts", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  const deletePost = (postId) => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:3001/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    }).then(() => {
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    });
  };

  return (
    <div className="posts-container">
      <h2 className="posts-title">Posts</h2>
      <div>
        {posts.map((post) => (
          <div className="post-card" key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            {post.userId === userid && (
              <button className="delete-button" onClick={() => deletePost(post.id)}>
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
