import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

export default function ChatPage() {
  const [welcomeMsg, setWelcomeMsg] = useState("");
  const [reply, setReply] = useState("");

  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [chatLog, setChatLog] = useState([]);

  useEffect(() => {
    socket.on("welcome", (data) => setWelcomeMsg(data));
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
    if (msg.trim() !== "" && name.trim() !== "") {
      socket.emit("send_message", { name, message: msg });
      setMsg("");
    }
  };

  return (
    <div className="chat-container">
      <h2 className="chat-title">Chat</h2>
      <div className="chat-section">
        <p>
          <strong>Server says on connect:</strong>{" "}
          <span className="chat-server-msg">{welcomeMsg}</span>
        </p>
        <button className="chat-btn" onClick={handleClick}>
          Send Hello
        </button>
        <p>
          <strong>Server replied:</strong> <span className="chat-server-reply">{reply}</span>
        </p>
      </div>
      <hr className="chat-divider" />
      <div className="chat-section">
        <h3 className="chat-subtitle">Named Chat</h3>
        <div className="chat-form">
          <input
            className="chat-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
          <input
            className="chat-input"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />
          <button className="chat-btn" onClick={sendMessage}>
            Send
          </button>
        </div>
        <ul className="chat-log">
          {chatLog.map((item, idx) => (
            <li className="chat-log-item" key={idx}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
