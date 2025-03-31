import PropTypes from "prop-types";

const Conversation = ({ chat, currentChat, onChatChange }) => {
  return (
    <div
      className={`px-4 py-4 cursor-pointer ${
        currentChat === chat.id ? "bg-blue-100" : "hover:bg-gray-100"
      }`}
      onClick={() => onChatChange(chat.id)}
    >
      <div className="flex justify-start">
        <span className="w-12 h-12 rounded-full bg-blue-500 mr-2"></span>
        <div>
          <p>{chat.name}</p>
          <p className="text-sm text-gray-600">{chat.lastMessage}</p>
        </div>
        <span className="text-xs text-gray-500 ml-auto">{chat.time}</span>
      </div>
    </div>
  );
};

Conversation.propTypes = {
  chat: PropTypes.object.isRequired,
  currentChat: PropTypes.number.isRequired,
  onChatChange: PropTypes.func.isRequired,
};

export default Conversation;
