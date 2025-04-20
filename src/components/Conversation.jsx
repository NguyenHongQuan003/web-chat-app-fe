import PropTypes from "prop-types";
import { useRecoilState } from "recoil";
import { typeContentState } from "../recoil/leftPanelAtom";
import { useEffect, useState } from "react";
import { getReceiver } from "../services/conversationService";
import { parseTimestamp, safeParseArray } from "../utils/parse";
import { useAuth } from "../utils/authUtils";
// import { parseTimestamp } from "../utils/parse";
const Conversation = ({ obj }) => {
  const [typeContent, setTypeContent] = useRecoilState(typeContentState);
  const [receiver, setReceiver] = useState("");
  const { user: userAuth } = useAuth();

  useEffect(() => {
    console.log("obj", obj);
    const fetchReceiver = async () => {
      const conversationID = obj?.conversation?.conversationID;
      if (!conversationID) return;
      try {
        const receiver = await getReceiver(conversationID);
        setReceiver(receiver);
      } catch (err) {
        console.error("Lỗi khi lấy người nhận:", err);
      }
    };
    fetchReceiver();
  }, [obj]);
  const handleClick = () => {
    setTypeContent({
      contentName: "conversation",
      conversation: obj,
    });
    console.log("obj", obj);
  };
  const isSender = obj.lastMessage?.senderID === userAuth?.userID;
  return (
    <div
      className={`px-4 py-4 cursor-pointer ${
        typeContent.conversation?.conversation?.conversationID ===
        obj?.conversation?.conversationID
          ? "bg-blue-100"
          : "hover:bg-gray-100"
      }`}
      onClick={() => handleClick()}
    >
      <div className="flex justify-start items-center">
        <span className="w-12 h-12 rounded-full bg-blue-500 mr-2">
          <img
            src={receiver?.avatar}
            alt="avatar"
            className="w-full h-full rounded-full object-cover"
          />
        </span>
        <div className="space-y-1">
          <p>{receiver?.fullName}</p>
          <p className="text-sm text-gray-600">
            {isSender ? "Bạn: " : `${receiver?.fullName}: `}
            {(() => {
              const parsedContent = safeParseArray(
                obj?.lastMessage?.messageContent
              );
              return Array.isArray(parsedContent)
                ? `${parsedContent.length} file${
                    parsedContent.length > 1 ? "s" : ""
                  }`
                : obj?.lastMessage?.messageContent;
            })()}
          </p>
        </div>

        <span className="text-xs text-gray-500 ml-auto">
          {parseTimestamp(obj?.lastMessage?.updatedAt)}
        </span>
      </div>
    </div>
  );
};

Conversation.propTypes = {
  obj: PropTypes.object.isRequired,
};

export default Conversation;
