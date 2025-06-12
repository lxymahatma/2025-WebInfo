import { useState } from "react";

export default function AddPostPage() {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const postobj = {
      title: e.target.title.value,
      body: e.target.body.value,
    };
    const token = localStorage.getItem("token");
    fetch("http://localhost:3001/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(postobj),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage("A new post has been added successfully!");
        setTimeout(() => {
          setMessage("");
        }, 1000);
      });
  };

  return (
    <div>
      <form className="post-form" onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Title" required />
        <textarea name="body" placeholder="Body" required></textarea>
        <button type="submit">Add Post</button>
      </form>
      {message && <p className="success-message">{message}</p>}
    </div>
  );
}
