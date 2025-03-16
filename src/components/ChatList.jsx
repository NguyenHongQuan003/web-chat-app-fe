// src/components/ChatList.jsx
import React from "react";

const ChatList = () => {
  const chats = [
    { id: 1, name: "Bạn A", lastMessage: "Xin chào!", time: "10:00 AM" },
    { id: 2, name: "Bạn B", lastMessage: "Hẹn gặp lại!", time: "9:45 AM" },
    { id: 3, name: "Bạn C", lastMessage: "Làm bài tập chưa?", time: "9:30 AM" },
    // Thêm các cuộc trò chuyện khác
  ];

  return (
    <div className="w-1/3 bg-white p-4 shadow-lg">
      <ul>
        {chats.map((chat) => (
          <li key={chat.id} className="mb-2">
            <div className="flex justify-start">
              <span className="w-10 h-10 rounded-full bg-blue-500 mr-2"></span>
              <div>
                <p>{chat.name}</p>
                <p className="text-sm text-gray-600">{chat.lastMessage}</p>
              </div>
              <span className="text-xs text-gray-500 ml-auto">{chat.time}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
