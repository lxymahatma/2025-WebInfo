import React, { useState } from "react";
import Counter from "./Counter";

function Quote({ texten, textjp, textzh, author }) {
  const [language, setLanguage] = useState("en");

  const getQuoteText = () => {
    switch (language) {
      case "jp":
        return textjp;
      case "zh":
        return textzh;
      case "en":
      default:
        return texten;
    }
  };

  const getButtonStyle = (lang) => {
    return language === lang ? "language-button selected" : "language-button";
  };

  return (
    <div className="quote-card">
      <h1 className="quote-msg">"{getQuoteText()}"</h1>
      <p className="quote-source">— {author}</p>
      <div>
        <button className={getButtonStyle("en")} onClick={() => setLanguage("en")}>
          English
        </button>
        <button className={getButtonStyle("jp")} onClick={() => setLanguage("jp")}>
          日本語
        </button>
        <button className={getButtonStyle("zh")} onClick={() => setLanguage("zh")}>
          中文
        </button>
      </div>
      <Counter />
    </div>
  );
}

export default Quote;
