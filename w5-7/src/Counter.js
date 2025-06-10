import React, { useState } from "react";

function Counter() {
  const [likes, setLikes] = useState(0);

  const handleLike = () => setLikes(likes + 1);
  const handleDislike = () => setLikes(likes - 1);

  return (
    <div>
      <p className="counter-value">Likes: {likes}</p>
      <button className="counter-button increment-button" onClick={handleLike}>
        ❤️ Like
      </button>
      <button className="counter-button decrement-button" onClick={handleDislike}>
        👎 Dislike
      </button>
    </div>
  );
}

export default Counter;
