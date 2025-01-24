"use client";

import { useState } from "react";

export default function QueryInterface() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "Here is the pic related to your query!" },
    ]);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === "user" ? "justify-end" : ""}`}
          >
            <div
              className={`p-3 rounded-lg ${
                msg.sender === "user"
                  ? "bg-teal-500 text-white"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <form
        className="flex md:p-4 bg-gray-800 sticky bottom-0 rounded-lg"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          className="flex-1 bg-gray-700 text-gray-200 p-3 rounded-l-lg focus:outline-none"
          placeholder="Type your query..."
          value={input}
          autoFocus
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 rounded-r-lg"
          onClick={sendMessage}
        >
          Send
        </button>
      </form>
    </div>
  );
}
