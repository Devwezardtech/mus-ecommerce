/*import React, { useState } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const botMessage = { sender: "gemini", text: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "gemini", text: "Failed to get response from Gemini AI." },
      ]);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h2>Gemini AI Chat</h2>
      <div style={{ border: "1px solid #ccc", padding: 10, height: 300, overflowY: "auto" }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.sender === "user" ? "right" : "left" }}>
            <p><strong>{msg.sender}:</strong> {msg.text}</p>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", marginTop: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{ flex: 1, padding: 10 }}
        />
        <button onClick={sendMessage} style={{ padding: "10px 20px" }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
*/