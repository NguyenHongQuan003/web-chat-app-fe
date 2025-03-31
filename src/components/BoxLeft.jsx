// src/components/ChatList.jsx

import { useState } from "react";
import { FaSearch, FaUserPlus } from "react-icons/fa";
import AddFriendModal from "./AddFriendModel";
import Conversation from "./Conversation";
import PropTypes from "prop-types";

const BoxLeft = ({ tab, onChatChange }) => {
  const [filtered, setFiltered] = useState("Tất cả");
  const [currentChat, setCurrentChat] = useState(null);

  const handleClick = (chatID) => {
    setCurrentChat(chatID);
    onChatChange(chatID);
  };

  const choices = ["Tất cả", "Chưa đọc"];
  const isActiveFilter = (choice) => {
    return filtered === choice
      ? "relative px-2 py-1 text-[#005ae0] cursor-pointer after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#005ae0] after:transform after:scale-x-100 after:origin-center after:transition-transform after:duration-500 after:ease-in-out"
      : "relative px-2 py-1 cursor-pointer after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#005ae0] after:transform after:scale-x-0 after:origin-center after:transition-transform after:duration-500 after:ease-in-out";
  };

  const chats = [
    { id: 1, name: "Bạn A", lastMessage: "Xin chào!", time: "10:00 AM" },
    { id: 2, name: "Bạn B", lastMessage: "Hẹn gặp lại!", time: "9:45 AM" },
    { id: 3, name: "Bạn C", lastMessage: "Làm bài tập chưa?", time: "9:30 AM" },
  ];

  const [isAddFriendModalOpen, setAddFriendModalOpen] = useState(false);

  return (
    <>
      <div className="min-w-86 border-r border-gray-300 bg-white">
        {/* Search bar */}
        <div className="p-4 flex justify-between items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm"
              className="px-8 text-[15px] w-full p-1 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0068ff] 
            placeholder:text-gray-400 placeholder:font-medium
            bg-[#ebecf0]"
            />
            <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-600" />
          </div>

          <button
            onClick={() => setAddFriendModalOpen(true)}
            className="cursor-pointer rounded-md hover:bg-gray-200 p-2"
          >
            <FaUserPlus color="#5c6b82" />
          </button>
        </div>
        {/* Filter */}
        <div className="text-[14px] px-4 text-gray-600 font-[600] border-b border-gray-300">
          {choices.map((choice) => (
            <button
              key={choice}
              className={isActiveFilter(choice)}
              onClick={() => setFiltered(choice)}
            >
              {choice}
            </button>
          ))}
        </div>
        {/* List chat or friend */}
        {tab === "chat" ? (
          <ul>
            {chats.map((chat) => (
              <Conversation
                key={chat.id}
                chat={chat}
                currentChat={currentChat}
                onChatChange={handleClick}
              />
            ))}
          </ul>
        ) : (
          <div>Friend</div>
        )}

        <AddFriendModal
          isOpen={isAddFriendModalOpen}
          onClose={() => setAddFriendModalOpen(false)}
        />
      </div>
    </>
  );
};

BoxLeft.propTypes = {
  tab: PropTypes.string.isRequired,
  onChatChange: PropTypes.func.isRequired,
};

export default BoxLeft;
