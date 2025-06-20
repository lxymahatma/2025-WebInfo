import { useEffect, useState } from "react";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const userid = parseInt(localStorage.getItem("userid"));

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

  const deletePost = (postid) => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:3001/posts/${postid}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    }).then(() => {
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postid));
    });
  };

  return (
    <div>
      <h2>Posts</h2>
      <ul>
        {posts.map((post) => (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            {post.userId === userid && (
              <button className="delete-button" onClick={() => deletePost(post.id)}>
                Delete
              </button>
            )}
          </div>
        ))}
      </ul>
    </div>
  );
}
