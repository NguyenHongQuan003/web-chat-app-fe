import PropTypes from "prop-types";
import { parseTimestamp } from "../utils/parse";
import { useAuth } from "../utils/authUtils";
import { FaShare, FaTrash, FaUndo } from "react-icons/fa";

const DisplayMessage = ({
  message,
  selectedMessageID,
  setSelectedMessageID,
}) => {
  const { user: userAuth } = useAuth();
  return (
    <div
      className={`flex ${
        message?.senderID === userAuth?.userID
          ? "justify-end "
          : "justify-start"
      }`}
    >
      <div
        onClick={() =>
          setSelectedMessageID(
            selectedMessageID === message.messageID ? null : message.messageID
          )
        }
        className={`relative max-w-[70%] rounded-2xl px-4 py-2 cursor-pointer shadow-2xl ${
          message.senderID === userAuth.userID
            ? "bg-blue-500 text-white"
            : "bg-gray-100"
        }`}
      >
        <p>{message?.messageContent}</p>
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
              onClick={() => {
                console.log("Delete message");
              }}
              className="hover:bg-gray-200 p-1 rounded-full cursor-pointer"
            >
              <FaTrash className="w-3 h-3 text-gray-400" />
            </button>
            <button
              onClick={() => {
                console.log("Undo message");
              }}
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
};

export default DisplayMessage;
