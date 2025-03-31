'use client';
import { useState } from "react";
import axios from "axios";
import { FaUser, FaRobot } from "react-icons/fa";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const aiMessage = { sender: "ai", text: "Thinking..." };
    setMessages((prev) => [...prev, aiMessage]);

    try {
      const response = await axios.get(`http://localhost:8002/client/chat?promt=${input}`, {
        headers: { "Content-Type": "application/json" },
      });
      
      const data = response.data;
      const lastAiMessage = data.split("AI:").pop().trim();
      setMessages((prev) => prev.slice(0, -1).concat({ sender: "ai", text: lastAiMessage }));
    } catch (error) {
      setMessages((prev) => prev.slice(0, -1).concat({ sender: "ai", text: "Error getting response." }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center p-4 bg-gray-100">
      <div className="flex-1 w-full max-w-2xl overflow-y-auto bg-white p-4 rounded-lg shadow flex flex-col">
        {messages.map((msg, index) => (
          <div key={index} className={`flex w-full mb-2 items-center ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            {msg.sender === "ai" && <FaRobot className="mr-2 text-gray-500" />}
            <div className={`p-3 max-w-[75%] rounded-lg ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}>
              {msg.text}
            </div>
            {msg.sender === "user" && <FaUser className="ml-2 text-blue-500" />}
          </div>
        ))}
      </div>
      <div className="mt-4 flex w-full max-w-2xl">
        <input
          className="flex-1 p-2 border rounded-lg"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
        />
        <button
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
