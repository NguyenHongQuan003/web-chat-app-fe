import PropTypes from "prop-types";
import { useRecoilState } from "recoil";
import { typeContentState } from "../recoil/leftPanelAtom";
// import { parseTimestamp } from "../utils/parse";
const Conversation = ({ obj }) => {
  const [typeContent, setTypeContent] = useRecoilState(typeContentState);
  const handleClick = () => {
    setTypeContent({
      contentName: "conversation",
      conversation: obj,
    });
    console.log("obj", obj);
  };
  return (
    <div
      className={`px-4 py-4 cursor-pointer ${
        typeContent.conversation?.conversation?.conversationName ===
        obj?.conversation?.conversationName
          ? "bg-blue-100"
          : "hover:bg-gray-100"
      }`}
      onClick={() => handleClick()}
    >
      <div className="flex justify-start items-center">
        <span className="w-12 h-12 rounded-full bg-blue-500 mr-2">
          <img
            src={obj?.conversation?.conversationAvatar}
            alt="avatar"
            className="w-full h-full rounded-full object-cover"
          />
        </span>
        <div className="space-y-1">
          <p>{obj.conversation.conversationName}</p>
          <p className="text-sm text-gray-600">
            {obj?.lastMessage?.messageContent}
          </p>
        </div>
        <span className="text-xs text-gray-500 ml-auto">
          {/* {parseTimestamp(obj?.lastMessage?.updatedAt)} */}
        </span>
      </div>
    </div>
  );
};

Conversation.propTypes = {
  obj: PropTypes.object.isRequired,
};

export default Conversation;
