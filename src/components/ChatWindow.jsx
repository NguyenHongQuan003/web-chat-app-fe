// src/components/ChatWindow.jsx
import { useState } from "react";
import ChatInfo from "./ChatInfo";
import PropTypes from "prop-types";

const ChatWindow = ({ currentChat }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: "Bạn A", text: "Xin chào!" },
    { id: 2, sender: "Bạn", text: "Chào bạn!" },
    // Thêm các tin nhắn khác
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
    <>
      <div className="w-3/4 bg-gray-100 p-4 flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4">
          {messages.map((message) => (
            <div key={message.id} className="mb-2">
              <strong>{message.sender}:</strong> <span>{message.text}</span>
            </div>
          ))}
          {currentChat}
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
    </>
  );
};

ChatWindow.propTypes = {
  currentChat: PropTypes.object,
};

export default ChatWindow;
