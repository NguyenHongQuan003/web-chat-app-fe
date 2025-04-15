import { useState } from "react";
import PropTypes from "prop-types";
import { IoSend, IoTrashOutline, IoReturnUpBackOutline } from "react-icons/io5";

const MessageOptions = ({ message, onDelete, onRevoke, onForward }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-white rounded-full shadow-lg p-1">
          <button
            onClick={() => onDelete(message.messageID)}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Xóa tin nhắn"
          >
            <IoTrashOutline className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => onRevoke(message.messageID)}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Thu hồi tin nhắn"
          >
            <IoReturnUpBackOutline className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => onForward(message.messageID)}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Chuyển tiếp tin nhắn"
          >
            <IoSend className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      )}
    </div>
  );
};

MessageOptions.propTypes = {
  message: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  onRevoke: PropTypes.func.isRequired,
  onForward: PropTypes.func.isRequired,
};

export default MessageOptions;
