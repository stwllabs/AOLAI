"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "../_components/navbar";
import {
  FaRobot,
  FaUser,
  FaPaperPlane,
  FaSpinner,
  FaInfoCircle,
} from "react-icons/fa";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hello 👋 I am TBEarly AI Assistant. You can ask me anything about Tuberculosis (TB), symptoms, prevention, or next steps.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      const botMessage: Message = {
        sender: "bot",
        text: data.reply || "Sorry, I couldn't understand that.",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Server error. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-20 p-4">
        <div className="max-w-3xl mx-auto">

          {/* HEADER */}
          <div className="bg-white p-6 rounded-xl shadow-xl mb-6 border-b-4 border-blue-600">
            <FaRobot className="text-5xl text-blue-600 mb-3" />
            <h1 className="text-3xl font-extrabold text-gray-900">
              TBEarly AI Chatbot
            </h1>
            <p className="text-gray-600 mt-2">
              Ask anything about TB symptoms, prevention, or health guidance.
            </p>
          </div>

          {/* DISCLAIMER */}
          <div className="mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded-lg flex items-start text-sm text-yellow-800">
            <FaInfoCircle className="mr-3 mt-1" />
            <p>
              This chatbot is a supporting educational tool, not a medical
              diagnosis. Always consult a healthcare professional.
            </p>
          </div>

          {/* CHAT BOX */}
          <div className="bg-white rounded-xl shadow-xl p-4 h-[500px] flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] p-4 rounded-xl shadow-md ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-100 text-gray-900 rounded-bl-none"
                    }`}
                  >
                    <div className="flex items-center mb-1 text-xs opacity-80">
                      {msg.sender === "user" ? (
                        <>
                          <FaUser className="mr-1" /> You
                        </>
                      ) : (
                        <>
                          <FaRobot className="mr-1" /> TBEarly AI
                        </>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-xl flex items-center text-sm text-gray-700 shadow">
                    <FaSpinner className="animate-spin mr-2" />
                    AI is typing...
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* INPUT */}
            <div className="mt-4 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your question here..."
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
