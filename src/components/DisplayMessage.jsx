import PropTypes from "prop-types";
import { parseTimestamp } from "../utils/parse";
import { useAuth } from "../utils/authUtils";
import { FaShare, FaTrash, FaUndo } from "react-icons/fa";
import { deleteMessage, revokeMessage } from "../services/messageService";
import { useEffect, useRef } from "react";

const DisplayMessage = ({
  message,
  selectedMessageID,
  setSelectedMessageID,
  participantId,
}) => {
  const { user: userAuth } = useAuth();
  const messageRef = useRef(null);

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

  const handleRevokeMessage = async () => {
    try {
      await revokeMessage(
        participantId,
        message.messageID,
        message.conversationID
      );
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
  return (
    <div
      className={`flex ${
        message?.senderID === userAuth?.userID
          ? "justify-end "
          : "justify-start"
      }`}
    >
      <div
        ref={messageRef}
        onClick={() => {
          if (
            message.revoke ||
            (message.senderDelete && message.senderID === userAuth.userID)
          )
            return;
          setSelectedMessageID(
            selectedMessageID === message.messageID ? null : message.messageID
          );
        }}
        className={`relative max-w-[70%] rounded-2xl px-4 py-2 cursor-pointer shadow-2xl ${
          message.senderID === userAuth.userID
            ? "bg-blue-500 text-white"
            : "bg-gray-100"
        }`}
      >
        {message.revoke ? (
          <p className="text-gray-400 italic">Tin nhắn đã được thu hồi</p>
        ) : message.senderDelete && message.senderID === userAuth.userID ? (
          <p className="text-gray-400 italic">Bạn đã xoá tin nhắn này</p>
        ) : (
          <p>{message?.messageContent}</p>
        )}
        <div
          className={`text-sm ${
            message.senderID === userAuth.userID
              ? "text-gray-300"
              : "text-gray-500"
          }`}
        >
          {parseTimestamp(message?.createdAt)}
        </div>
        {selectedMessageID === message.messageID && (
          <div
            className={`absolute top-0 flex gap-x-6 cursor-default
                ${
                  message.senderID === userAuth.userID
                    ? "-left-28"
                    : "-right-28"
                }`}
          >
            <button
              onClick={handleDeleteMessage}
              className="hover:bg-gray-200 p-1 rounded-full cursor-pointer"
            >
              <FaTrash className="w-3 h-3 text-gray-400" />
            </button>
            <button
              onClick={handleRevokeMessage}
              className="hover:bg-gray-200 p-1 rounded-full cursor-pointer"
            >
              <FaUndo className="w-3 h-3 text-gray-400" />
            </button>
            <button
              onClick={() => {
                console.log("Share message");
              }}
              className="hover:bg-gray-200 p-1 rounded-full cursor-pointer"
            >
              <FaShare className="w-3 h-3 text-gray-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

DisplayMessage.propTypes = {
  message: PropTypes.object.isRequired,
  selectedMessageID: PropTypes.string,
  setSelectedMessageID: PropTypes.func.isRequired,
  participantId: PropTypes.string.isRequired,
};

export default DisplayMessage;
