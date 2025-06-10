import React, { useState } from "react";
import "./App.css";
import Quote from "./Quote";
import PostList from "./PostList";
import QuizMonitor from "./QuizMonitor";

function App() {
  return (
    <div className="container">
      <h1>Quote App</h1>
      <h3>Student: LIU XINYU | ID: 26002304812 | Group: 5090XT</h3>
      <Quote
        texten="The only way to do great work is to love what you do."
        textjp="偉大な仕事を成し遂げるただ一つの方法は、自分のしていることを愛することだ。"
        textzh="做出伟大工作的唯一方法就是热爱你所做的事情。"
        author="Steve Jobs"
      />
      <Quote
        texten="In the middle of every difficulty lies opportunity."
        textjp="困難の中に、機会がある。"
        textzh="一切困境都蕴含机遇。"
        author="Albert Einstein"
      />
      <Quote
        texten="Be yourself; everyone else is already taken."
        textjp="自分らしくいなさい。他の誰かはすでに存在しているのだから。"
        textzh="做你自己，其他人都已经有人扮演了。"
        author="Oscar Wilde"
      />
      <Quote
        texten="The purpose of our lives is to be happy."
        textjp="私たちの人生の目的は幸せであることです。"
        textzh="我们生活的目的就是要快乐。"
        author="Dalai Lama"
      />

      <h2>Post Section</h2>
      <PostList />

      <h2>Group Component Demo: Quiz Monitor</h2>
      <QuizMonitor />
    </div>
  );
}

export default App;
