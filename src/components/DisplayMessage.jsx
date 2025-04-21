import PropTypes from "prop-types";
import { parseTimestamp, safeParseArray } from "../utils/parse";
import { useAuth } from "../utils/authUtils";
import { FaQuoteRight, FaShare, FaTrash, FaUndo } from "react-icons/fa";
import { deleteMessage, revokeMessage } from "../services/messageService";
import { useEffect, useRef } from "react";
import { isShareModalOpenState } from "../recoil/leftPanelAtom";
import { selectedMessageState } from "../recoil/shareAtom";
import { useSetRecoilState } from "recoil";
import { IoDocuments } from "react-icons/io5";

const DisplayMessage = ({
  message,
  selectedMessageID,
  setSelectedMessageID,
  participantId,
  receiver,
  setReplyMessage,
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
  const imageTypes = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "webp",
    "bmp",
    "tiff",
    "svg",
  ];
  const videoTypes = ["mp4", "webm", "mov", "avi", "mkv", "flv", "wmv"];
  const audioTypes = ["mp3", "wav", "ogg", "aac", "flac", "m4a"];
  const documentTypes = [
    "pdf",
    "doc",
    "docx",
    "xls",
    "xlsx",
    "ppt",
    "pptx",
    "txt",
    "csv",
    "json",
  ];
  const archiveTypes = ["zip", "rar", "7z", "tar", "gz"];
  const renderMessageContent = () => {
    let urls = [];
    let types = [];
    let contents = [];

    try {
      urls = safeParseArray(message.messageUrl);
      types = safeParseArray(message.messageType);
      contents = safeParseArray(message.messageContent);
    } catch (error) {
      console.error("Lỗi parse message fields:", error);
    }

    const shouldDisplayMessageContent = (content) => {
      if (typeof content !== "string") return false;

      try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) return false;
      } catch {
        // Không phải JSON => tiếp tục
      }

      const lowerContent = content.toLowerCase();
      const allExtensions = [
        ...imageTypes,
        ...documentTypes,
        ...archiveTypes,
        ...videoTypes,
        ...audioTypes,
      ];

      return !allExtensions.some((ext) => lowerContent.endsWith(`.${ext}`));
    };

    const isDocumentReply = (replyText = "") => {
      const docExts = [
        ...documentTypes,
        ...archiveTypes,
        ...videoTypes,
        ...audioTypes,
      ];
      const lower = replyText.toLowerCase();
      return docExts.some((ext) => lower.endsWith(`.${ext}`));
    };

    return (
      <div className="px-2 pt-4">
        {message.reply && (
          <div className="border-l-4 border-blue-400 pl-2 mb-2 text-sm italic text-gray-700">
            {isDocumentReply(message.reply) ? (
              <div className="flex items-center gap-1 text-blue-500 font-medium">
                <IoDocuments size={18} />
                {message.reply}
              </div>
            ) : (
              <>
                <FaQuoteRight className="inline-block mr-1 text-blue-400" />
                {message.reply}
              </>
            )}
          </div>
        )}

        {shouldDisplayMessageContent(message?.messageContent) && (
          <p className="whitespace-pre-wrap mb-2">{message.messageContent}</p>
        )}

        {urls.length > 0 && (
          <div className="flex flex-wrap">
            {urls.map((url, index) => {
              const type = types[index]?.toLowerCase();
              const name = contents[index] || "File";

              if (imageTypes.includes(type)) {
                return (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-0.5 pt-0.5"
                  >
                    <img
                      src={url}
                      alt={name}
                      className="w-28 h-28 object-cover rounded-md"
                    />
                  </a>
                );
              }

              if (videoTypes.includes(type)) {
                return (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative w-40 h-28 px-0.5 pt-0.5"
                  >
                    <video
                      controls
                      src={url}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </a>
                );
              }

              if (audioTypes.includes(type)) {
                return (
                  <div key={index} className="w-full flex flex-col gap-1">
                    <audio controls className="w-full">
                      <source src={url} type={`audio/${type}`} />
                      Trình duyệt không hỗ trợ audio.
                    </audio>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 underline"
                    >
                      Nghe ở tab mới
                    </a>
                  </div>
                );
              }

              if (documentTypes.includes(type) || archiveTypes.includes(type)) {
                return (
                  <div key={index} className="block w-full">
                    {!message.reply && (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2 pt-4 font-[650] underline text-blue-500"
                      >
                        <IoDocuments size={48} color="#00aaff" /> {name}
                      </a>
                    )}
                  </div>
                );
              }

              return (
                <a
                  key={index}
                  href={url}
                  download={name}
                  className="text-blue-600 underline w-full"
                >
                  {name}
                </a>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const isSender = message?.senderID === userAuth?.userID;
  const isRevoked = message.revoke;
  const isDeletedBySender = message.senderDelete && isSender;

  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"} gap-2`}>
      {!isSender && receiver.avatar && (
        <img
          src={receiver.avatar}
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
        {isRevoked ? (
          <p className="text-gray-400 italic px-2 pt-4">
            Tin nhắn đã được thu hồi
          </p>
        ) : isDeletedBySender ? (
          <p className="text-gray-400 italic px-2 pt-4">
            Bạn đã xoá tin nhắn này
          </p>
        ) : (
          renderMessageContent()
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

DisplayMessage.propTypes = {
  message: PropTypes.object.isRequired,
  selectedMessageID: PropTypes.string,
  setSelectedMessageID: PropTypes.func.isRequired,
  participantId: PropTypes.string,
  receiver: PropTypes.object,
  setReplyMessage: PropTypes.func,
};

export default DisplayMessage;
