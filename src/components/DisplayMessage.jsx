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

  const renderMessageContent = () => {
    const imageTypes = ["jpg", "jpeg", "png", "gif", "webp"];
    const videoTypes = ["mp4", "webm", "mov"];
    const isImage = imageTypes.includes(message.messageType?.toLowerCase());
    const isVideo = videoTypes.includes(message.messageType?.toLowerCase());
    const isPDF = message.messageType?.toLowerCase() === "pdf";

    if (isImage && message.messageUrl) {
      return (
        <img
          src={message.messageUrl}
          alt={message.messageContent}
          className="rounded-lg max-w-full max-h-60 object-cover"
        />
      );
    }

    if (isVideo && message.messageUrl) {
      return (
        <video
          controls
          src={message.messageUrl}
          className="rounded-lg max-w-full max-h-60"
        />
      );
    }

    if (isPDF && message.messageUrl) {
      return (
        <a
          href={message.messageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          📄 {message.messageContent}
        </a>
      );
    }

    // Default fallback: text
    return <p>{message?.messageContent}</p>;
  };

  const isSender = message?.senderID === userAuth?.userID;
  const isRevoked = message.revoke;
  const isDeletedBySender = message.senderDelete && isSender;

  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
      <div
        ref={messageRef}
        onClick={() => {
          if (isRevoked || isDeletedBySender) return;
          setSelectedMessageID(
            selectedMessageID === message.messageID ? null : message.messageID
          );
        }}
        className={`relative max-w-[70%] rounded-2xl px-4 py-2 cursor-pointer shadow-2xl ${
          isSender ? "bg-blue-500 text-white" : "bg-gray-100"
        }`}
      >
        {isRevoked ? (
          <p className="text-gray-400 italic">Tin nhắn đã được thu hồi</p>
        ) : isDeletedBySender ? (
          <p className="text-gray-400 italic">Bạn đã xoá tin nhắn này</p>
        ) : (
          renderMessageContent()
        )}

        <div
          className={`text-sm ${isSender ? "text-gray-300" : "text-gray-500"}`}
        >
          {parseTimestamp(message?.createdAt)}
        </div>

        {selectedMessageID === message.messageID && (
          <div
            className={`absolute top-0 flex gap-x-6 cursor-default ${
              isSender ? "-left-28" : "-right-28"
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
  participantId: PropTypes.string,
};

export default DisplayMessage;
