import React from "react";

function Blog(props) {
  return (
    <div className="blogStyle">
      <p className="blogAuthor">{props.author}</p>
      <p className="blogDate">{props.date}</p>
      <p className="blogContent">{props.children}</p>
    </div>
  );
}

export default Blog;
