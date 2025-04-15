import { useState } from "react";
import Conversation from "./Conversation";
import { conversationListState } from "../recoil/conversationAtom";
import { useRecoilValue } from "recoil";

const ConversationList = () => {
  const conversationList = useRecoilValue(conversationListState);
  const [filtered, setFiltered] = useState("Tất cả");
  const choices = ["Tất cả", "Chưa đọc"];
  const isActiveFilter = (choice) => {
    return filtered === choice
      ? "relative px-2 py-1 text-[#005ae0] cursor-pointer after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#005ae0] after:transform after:scale-x-100 after:origin-center after:transition-transform after:duration-500 after:ease-in-out"
      : "relative px-2 py-1 cursor-pointer after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#005ae0] after:transform after:scale-x-0 after:origin-center after:transition-transform after:duration-500 after:ease-in-out";
  };

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
        {conversationList.map((obj) => (
          <Conversation key={obj.conversation.conversationID} obj={obj} />
        ))}
      </ul>
    </div>
  );
};

export default ConversationList;
