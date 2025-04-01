import { useState } from "react";
import Conversation from "./Conversation";

const ConversationList = () => {
  const [filtered, setFiltered] = useState("Tất cả");
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
    { id: 4, name: "Bạn D", lastMessage: "Làm bài tập chưa?", time: "9:30 AM" },
    { id: 5, name: "Bạn E", lastMessage: "Làm bài tập chưa?", time: "9:30 AM" },
    { id: 6, name: "Bạn F", lastMessage: "Làm bài tập chưa?", time: "9:30 AM" },
    { id: 7, name: "Bạn G", lastMessage: "Làm bài tập chưa?", time: "9:30 AM" },
    { id: 8, name: "Bạn H", lastMessage: "Làm bài tập chưa?", time: "9:30 AM" },
    { id: 9, name: "Bạn I", lastMessage: "Làm bài tập chưa?", time: "9:30 AM" },
    {
      id: 10,
      name: "Bạn J",
      lastMessage: "Làm bài tập chưa?",
      time: "9:30 AM",
    },
    {
      id: 11,
      name: "Bạn K",
      lastMessage: "Làm bài tập chưa?",
      time: "9:30 AM",
    },
    {
      id: 12,
      name: "Bạn L",
      lastMessage: "Làm bài tập chưa?",
      time: "9:30 AM",
    },
    {
      id: 13,
      name: "Bạn M",
      lastMessage: "Làm bài tập chưa?",
      time: "9:30 AM",
    },
  ];
  return (
    <div className="bg-white border-r border-gray-300">
      {/* Filter */}
      <div className=" text-[14px] px-4 text-gray-600 font-[600]">
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
      <ul className=" overflow-y-auto h-[calc(100vh-6rem)]">
        {chats.map((chat) => (
          <Conversation key={chat.id} chat={chat} />
        ))}
      </ul>
    </div>
  );
};

export default ConversationList;
