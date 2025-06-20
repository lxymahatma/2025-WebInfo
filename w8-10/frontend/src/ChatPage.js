import { useState, useEffect } from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:3001");

export default function ChatPage() {
  const [msg, setMsg] = useState("");
  const [reply, setReply] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.on("welcome", (data) => setMsg(data));
    socket.on("response", (data) => setReply(data));
    socket.on("receive_message", (data) => {
      setChatLog((prev) => [...prev, data]);
    });
    return () => {
      socket.off("welcome");
      socket.off("response");
      socket.off("receive_message");
    };
  }, []);
  const handleClick = () => {
    socket.emit("hello");
  };
  const sendMessage = () => {
    if (input.trim() !== "") {
      socket.emit("send_message", input);
      setInput("");
    }
  };
  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2>Chat</h2>
      <p>
        <strong>Server says on connect:</strong>
        {msg}
      </p>
      <button onClick={handleClick}>Send Hello</button>
      <p>
        <strong>Server replied:</strong> {reply}
      </p>
      <hr />
      <h3>Anonymous Chat</h3>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
      <ul>
        {chatLog.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
