import PropTypes from "prop-types";
import { parseTimestamp } from "../utils/parse";
import { useAuth } from "../utils/authUtils";
import { FaFile, FaShare, FaTrash, FaUndo } from "react-icons/fa";
import { deleteMessage, revokeMessage } from "../services/messageService";
import { useEffect, useRef } from "react";
import { isShareModalOpenState } from "../recoil/leftPanelAtom";
import { selectedMessageState } from "../recoil/shareAtom";
import { useSetRecoilState } from "recoil";

const DisplayMessage = ({
  message,
  selectedMessageID,
  setSelectedMessageID,
  participantId,
}) => {
  const { user: userAuth } = useAuth();
  const messageRef = useRef(null);
  const setIsShareModalOpen = useSetRecoilState(isShareModalOpenState);
  const setSelectedMessage = useSetRecoilState(selectedMessageState);

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

  const handleShareMessage = () => {
    setSelectedMessage({ message });
    setIsShareModalOpen(true);
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
          className="underline"
        >
          <div className="flex items-center gap-x-2">
            <FaFile color="#ccc" /> {message.messageContent}
          </div>
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
          isSender ? "bg-[#dbf8fe] " : "bg-gray-100"
        }`}
      >
        {isRevoked ? (
          <p className="text-gray-400 italic">Tin nhắn đã được thu hồi</p>
        ) : isDeletedBySender ? (
          <p className="text-gray-400 italic">Bạn đã xoá tin nhắn này</p>
        ) : (
          renderMessageContent()
        )}

        <div className={`text-sm text-gray-500`}>
          {parseTimestamp(message?.createdAt)}
        </div>

        {selectedMessageID === message.messageID && (
          <div
            className={`absolute top-0 w-max flex gap-x-3 z-10 ${
              isSender ? "-left-24" : "-right-8"
            }`}
          >
            {isSender && (
              <>
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
              </>
            )}
            <button
              onClick={handleShareMessage}
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
