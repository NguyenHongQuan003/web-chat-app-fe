// src/components/ChatList.jsx

import { useState } from "react";
import { FaSearch } from "react-icons/fa";

const ChatList = () => {
  const [search, setSearch] = useState("Tất cả");
  const chats = [
    { id: 1, name: "Bạn A", lastMessage: "Xin chào!", time: "10:00 AM" },
    { id: 2, name: "Bạn B", lastMessage: "Hẹn gặp lại!", time: "9:45 AM" },
    { id: 3, name: "Bạn C", lastMessage: "Làm bài tập chưa?", time: "9:30 AM" },
    // Thêm các cuộc trò chuyện khác
  ];

  return (
    <div className="min-w-86 border-r border-gray-300 bg-white px-4 shadow-lg">
      <div className="relative py-4">
        <input
          type="text"
          placeholder="Tìm kiếm"
          className="px-8 text-[15px] w-full p-1 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0068ff] 
            placeholder:text-gray-400 placeholder:font-medium
            bg-[#ebecf0]"
        />
        <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-600" />
      </div>
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
