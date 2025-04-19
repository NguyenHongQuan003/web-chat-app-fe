import PropTypes from "prop-types";
import { parseTimestamp } from "../utils/parse";
import { useAuth } from "../utils/authUtils";

const ImageGroup = ({ messages }) => {
  const { user: userAuth } = useAuth();
  const isSender = messages[0]?.senderID === userAuth?.userID;

  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"} my-2`}>
      <div
        className={`grid grid-cols-2 gap-2 p-2 rounded-2xl shadow-md max-w-[70%] ${
          isSender ? "bg-[#dbf8fe]" : "bg-gray-100"
        }`}
      >
        {messages.map((msg) => (
          <img
            key={msg.messageID}
            src={msg.messageUrl}
            alt={msg.messageContent}
            className="rounded-xl w-full max-h-40 object-cover"
          />
        ))}
        <div className="col-span-2 text-right text-sm text-gray-400">
          {parseTimestamp(messages[messages.length - 1].createdAt)}
        </div>
      </div>
    </div>
  );
};

ImageGroup.propTypes = {
  messages: PropTypes.array.isRequired,
};

export default ImageGroup;
