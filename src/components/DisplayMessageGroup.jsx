import PropTypes from "prop-types";
import { parseTimestamp } from "../utils/parse";
import { useAuth } from "../utils/authUtils";
import { FaQuoteRight, FaShare, FaTrash, FaUndo } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { isShareGroupModalOpenState } from "../recoil/leftPanelAtom";
import { selectedMessageState } from "../recoil/shareAtom";
import { useSetRecoilState } from "recoil";
import { deleteMessage, revokeMessage } from "../services/groupService";
import RenderMessageContent from "./RenderMessageContent";
import { getMessageByID } from "../services/messageService";
import { getUserById } from "../services/userService";

const DisplayMessageGroup = ({
  message,
  selectedMessageID,
  setSelectedMessageID,
  setReplyMessage,
  members,
}) => {
  const { user: userAuth } = useAuth();
  const messageRef = useRef(null);
  const setIsShareGroupModalOpen = useSetRecoilState(
    isShareGroupModalOpenState
  );
  const setSelectedMessage = useSetRecoilState(selectedMessageState);
  const [sender, setSender] = useState(null);

  useEffect(() => {
    const fetchSender = async () => {
      try {
        const senderId = message?.senderID;
        const senderData = members.find(
          (member) => member.userInfo.userID === senderId
        );
        console.log("Sender data:", senderData.userInfo);
        if (senderData) {
          setSender(senderData.userInfo);
        }
      } catch (error) {
        console.error("Error fetching sender data:", error);
      }
    };

    fetchSender();
  }, [message?.senderID, members]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (messageRef.current && !messageRef.current.contains(event.target)) {
        setSelectedMessageID(null);
      }
    };

    if (selectedMessageID === message.messageID) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedMessageID, message.messageID, setSelectedMessageID]);

  const [replyTo, setReplyTo] = useState(null);
  useEffect(() => {
    if (message.reply !== null && message.reply !== undefined) {
      try {
        const getMessageReply = async () => {
          const replyTo = await getMessageByID(
            message.reply,
            message.conversationID
          );
          setReplyTo(replyTo);
        };
        getMessageReply();
      } catch (error) {
        console.log("Error getting message reply:", error);
        setReplyTo(null);
      }
    }
  }, [message]);

  const [senderName, setSenderName] = useState({});
  useEffect(() => {
    if (replyTo !== null) {
      const getSenderName = async () => {
        try {
          const response = await getUserById(replyTo.senderID);
          setSenderName(response.data);
        } catch (error) {
          console.log("Error getting sender:", error);
          setSenderName(null);
        }
      };
      getSenderName();
    }
  }, [replyTo]);

  const handleRevokeMessage = async () => {
    try {
      await revokeMessage(message.messageID, message.conversationID);
    } catch (error) {
      console.log("Error revoking message:", error);
    }
  };

  const handleDeleteMessage = async () => {
    try {
      await deleteMessage(message.messageID, message.conversationID);
    } catch (error) {
      console.log("Error deleting message:", error);
    }
  };

  const handleShareMessage = () => {
    setSelectedMessage({ message });
    setIsShareGroupModalOpen(true);
  };

  const isSender = message?.senderID === userAuth?.userID;
  const isRevoked = message.revoke;
  const isDeletedBySender = message.senderDelete && isSender;

  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"} gap-2`}>
      {!isSender && sender?.avatar && (
        <img
          src={sender?.avatar}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
      )}

      <div
        ref={messageRef}
        onClick={() => {
          if (isRevoked || isDeletedBySender) return;
          setSelectedMessageID(
            selectedMessageID === message.messageID ? null : message.messageID
          );
        }}
        className={`relative max-w-[70%] rounded-md cursor-pointer shadow-2xl ${
          isSender ? "bg-[#dbf8fe]" : "bg-white"
        }`}
      >
        {!isSender && (
          <p className="px-2 pt-1 text-gray-500 text-[14px]">
            {sender?.fullName}
          </p>
        )}
        {isRevoked ? (
          <p className="text-gray-400 italic px-2 pt-4">
            Tin nhắn đã được thu hồi
          </p>
        ) : isDeletedBySender ? (
          <p className="text-gray-400 italic px-2 pt-4">
            Bạn đã xoá tin nhắn này
          </p>
        ) : (
          <>
            {replyTo !== null && (
              <div className="bg-gray-100 border-l-4 border-blue-400 text-sm px-3 py-2 mx-2 mt-2 rounded-md">
                <div className="flex items-center gap-x-2">
                  <FaQuoteRight color="#0078E8" />
                  <p className="font-bold">
                    {senderName.userID === message.senderID
                      ? "Bạn"
                      : senderName.fullName}
                  </p>
                </div>
                <div className="text-gray-700">
                  <RenderMessageContent message={replyTo} />
                </div>
              </div>
            )}
            <RenderMessageContent message={message} />
          </>
        )}

        <div className="text-xs text-gray-500 px-2 pt-2 pb-4">
          {parseTimestamp(message?.createdAt)}
        </div>

        {selectedMessageID === message.messageID && (
          <div
            className={`absolute top-0 w-max flex gap-x-3 z-10 ${
              isSender ? "-left-32" : "-right-16"
            }`}
          >
            {isSender && (
              <>
                <button
                  onClick={handleDeleteMessage}
                  className="hover:bg-white p-1 rounded-full cursor-pointer"
                  title="Xoá ở phía bạn"
                >
                  <FaTrash className="w-3 h-3 text-gray-400" />
                </button>
                <button
                  onClick={handleRevokeMessage}
                  className="hover:bg-white p-1 rounded-full cursor-pointer"
                  title="Thu hồi"
                >
                  <FaUndo className="w-3 h-3 text-gray-400" />
                </button>
              </>
            )}
            <button
              onClick={handleShareMessage}
              className="hover:bg-white p-1 rounded-full cursor-pointer"
              title="Chia sẻ"
            >
              <FaShare className="w-3 h-3 text-gray-400" />
            </button>
            <button
              onClick={() => setReplyMessage(message)}
              title="Trả lời"
              className="hover:bg-white p-1 rounded-full cursor-pointer"
            >
              <FaQuoteRight className="w-3 h-3 text-gray-400" />
            </button>
          </div>
        )}
        <div></div>
      </div>
    </div>
  );
};

DisplayMessageGroup.propTypes = {
  message: PropTypes.object.isRequired,
  selectedMessageID: PropTypes.string,
  setSelectedMessageID: PropTypes.func.isRequired,
  participantId: PropTypes.string,
  receiver: PropTypes.object,
  setReplyMessage: PropTypes.func,
  members: PropTypes.array,
};

export default DisplayMessageGroup;
