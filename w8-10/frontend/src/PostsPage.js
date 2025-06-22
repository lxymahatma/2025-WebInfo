import { useEffect, useState } from "react";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", body: "" });
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

  const startEdit = (post) => {
    setEditingPostId(post.id);
    setEditForm({ title: post.title, body: post.body });
  };

  const cancelEdit = () => {
    setEditingPostId(null);
    setEditForm({ title: "", body: "" });
  };

  const handleEditSubmit = (e, postId) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    fetch(`http://localhost:3001/posts/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(editForm),
    })
      .then((res) => res.json())
      .then((updatedPost) => {
        setPosts((prevPosts) => prevPosts.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
        setEditingPostId(null);
        setEditForm({ title: "", body: "" });
      });
  };

  return (
    <div className="posts-container">
      <h2 className="posts-title">Posts</h2>
      <div>
        {posts.map((post) => (
          <div className="post-card" key={post.id}>
            {editingPostId === post.id ? (
              <form onSubmit={(e) => handleEditSubmit(e, post.id)}>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  required
                />
                <textarea
                  value={editForm.body}
                  onChange={(e) => setEditForm({ ...editForm, body: e.target.value })}
                  required
                />
                <button type="submit" className="save-button">
                  Save
                </button>
                <button type="button" className="cancel-button" onClick={cancelEdit}>
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <h3>{post.title}</h3>
                <p>{post.body}</p>
                {post.userId === userid && (
                  <div className="post-actions">
                    <button className="edit-button" onClick={() => startEdit(post)}>
                      Edit
                    </button>
                    <button className="delete-button" onClick={() => deletePost(post.id)}>
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
