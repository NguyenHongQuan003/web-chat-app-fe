import { useState } from "react";
import Conversation from "./Conversation";
import { conversationListState } from "../recoil/conversationAtom";
import { useRecoilState } from "recoil";
import {
  getConversationNoSeen,
  getConversations,
} from "../services/conversationService";

const ConversationList = () => {
  const [conversationList, setConversationList] = useRecoilState(
    conversationListState
  );
  const [filtered, setFiltered] = useState("Tất cả");
  const [noSeenConversations, setNoSeenConversations] = useState([]);
  const choices = ["Tất cả", "Chưa đọc"];

  const fetchNoSeenConversations = async () => {
    try {
      const response = await getConversationNoSeen();
      console.log("Danh sách conversation chưa đọc:", response);
      setNoSeenConversations(response);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách conversation chưa đọc:", error);
    }
  };

  const fetchConversationList = async () => {
    try {
      const results = await getConversations();
      setConversationList(results);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const handleFilterClick = (choice) => {
    setFiltered(choice);
    if (choice === "Chưa đọc") {
      fetchNoSeenConversations();
    }
    if (choice === "Tất cả") {
      fetchConversationList();
    }
  };

  const isActiveFilter = (choice) => {
    return filtered === choice
      ? "relative px-2 py-1 text-[#005ae0] cursor-pointer after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#005ae0] after:transform after:scale-x-100 after:origin-center after:transition-transform after:duration-500 after:ease-in-out"
      : "relative px-2 py-1 cursor-pointer after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#005ae0] after:transform after:scale-x-0 after:origin-center after:transition-transform after:duration-500 after:ease-in-out";
  };

  const filteredConversations =
    filtered === "Chưa đọc"
      ? conversationList.filter((conv) =>
          noSeenConversations.some(
            (noSeen) =>
              noSeen.conversation.conversationID ===
              conv.conversation.conversationID
          )
        )
      : conversationList;

  return (
    <div className="bg-white border-r min-w-86 max-w-86 border-gray-300">
      {/* Filter */}
      <div className="text-[14px] px-4 text-gray-600 font-[600] flex gap-4">
        {choices.map((choice) => (
          <button
            key={choice}
            className={isActiveFilter(choice)}
            onClick={() => handleFilterClick(choice)}
          >
            {choice}
          </button>
        ))}
      </div>

      {/* List */}
      <ul className="overflow-y-auto h-[calc(100vh-97px)]">
        {filteredConversations.map((obj) => (
          <Conversation key={obj.conversation.conversationID} obj={obj} />
        ))}
      </ul>
    </div>
  );
};

export default ConversationList;
