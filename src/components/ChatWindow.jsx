// src/components/ChatWindow.jsx
import { useState } from "react";
import ChatInfo from "./ChatInfo";
import PropTypes from "prop-types";

const ChatWindow = ({ currentChat }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: "Bạn A", text: "Xin chào!" },
    { id: 2, sender: "Bạn", text: "Chào bạn!" },
    { id: 3, sender: "Bạn A", text: "Xin chào!" },
    { id: 4, sender: "Bạn", text: "Chào bạn!" },
    { id: 5, sender: "Bạn A", text: "Xin chào!" },
    { id: 6, sender: "Bạn", text: "Chào bạn!" },
    { id: 7, sender: "Bạn A", text: "Xin chào!" },
    { id: 8, sender: "Bạn", text: "Chào bạn!" },
    { id: 9, sender: "Bạn A", text: "Xin chào!" },
    { id: 10, sender: "Bạn", text: "Chào bạn!" },
    { id: 11, sender: "Bạn A", text: "Xin chào!" },
    { id: 12, sender: "Bạn", text: "Chào bạn!" },
    { id: 13, sender: "Bạn A", text: "Xin chào!" },
    { id: 14, sender: "Bạn", text: "Chào bạn!" },
    { id: 15, sender: "Bạn A", text: "Xin chào!" },
    { id: 16, sender: "Bạn", text: "Chào bạn!" },
    { id: 17, sender: "Bạn A", text: "Xin chào!" },
    { id: 18, sender: "Bạn", text: "Chào bạn!" },
    { id: 19, sender: "Bạn A", text: "Xin chào!" },
    { id: 20, sender: "Bạn", text: "Chào bạn!" },
    { id: 21, sender: "Bạn A", text: "Xin chào!" },
    { id: 22, sender: "Bạn", text: "Chào bạn!" },
    { id: 23, sender: "Bạn A", text: "Xin chào!" },
    { id: 24, sender: "Bạn", text: "Chào bạn!" },
    { id: 25, sender: "Bạn A", text: "Xin chào!" },
    { id: 26, sender: "Bạn", text: "Chào bạn!" },
    { id: 27, sender: "Bạn A", text: "Xin chào!" },
    { id: 28, sender: "Bạn", text: "Chào bạn!" },
    { id: 29, sender: "Bạn A", text: "Xin chào!" },
    { id: 30, sender: "Bạn", text: "Chào bạn!" },
    { id: 31, sender: "Bạn A", text: "Xin chào!" },
    { id: 32, sender: "Bạn", text: "Chào bạn!" },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() !== "") {
      setMessages([
        ...messages,
        { id: messages.length + 1, sender: "Bạn", text: newMessage },
      ]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-grow">
      <div className=" bg-gray-100 flex flex-col flex-grow">
        <div className="flex-1 overflow-y-auto mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-2 mx-4 ${
                message.sender === "Bạn" ? "text-right" : "text-left"
              }`}
            >
              <strong>{message.sender}:</strong> <span>{message.text}</span>
            </div>
          ))}
          {currentChat?.id}
        </div>
        <form onSubmit={handleSendMessage} className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="flex-1 p-2 border border-gray-300 rounded-l"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded-r"
          >
            Gửi
          </button>
        </form>
      </div>

      <ChatInfo />
    </div>
  );
};

ChatWindow.propTypes = {
  currentChat: PropTypes.object,
};

export default ChatWindow;
