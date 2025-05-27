import PropTypes from "prop-types";
import { useRecoilState } from "recoil";
import { typeContentState } from "../recoil/leftPanelAtom";
import { useEffect, useState } from "react";
import { getReceiver, updateStateSeen } from "../services/conversationService";
import { parseTimestamp, safeParseArray } from "../utils/parse";
import { useAuth } from "../utils/authUtils";
import { getGroupInfo } from "../services/groupService";
// import { parseTimestamp } from "../utils/parse";
const Conversation = ({ obj }) => {
  const [typeContent, setTypeContent] = useRecoilState(typeContentState);
  const [receiver, setReceiver] = useState("");
  const [groupInfo, setGroupInfo] = useState("");
  const [isSeen, setIsSeen] = useState(obj?.conversation?.isSeenMessage);
  const { user: userAuth } = useAuth();

  useEffect(() => {
    setIsSeen(obj?.conversation?.isSeenMessage);
  }, [obj?.conversation?.isSeenMessage]);

  useEffect(() => {
    // console.log("obj", obj);
    const fetchReceiver = async () => {
      const conversationID = obj?.conversation?.conversationID;
      if (!conversationID) return;
      try {
        const receiver = await getReceiver(conversationID);
        setReceiver(receiver);
      } catch (err) {
        console.error("Lỗi khi lấy người nhận:", err);
      }
    };

    const fetchInfoGroup = async () => {
      const conversationID = obj?.conversation?.conversationID;
      if (!conversationID) return;
      try {
        const groupInfo = await getGroupInfo(conversationID);
        // console.log("groupInfo", groupInfo.data);
        setGroupInfo(groupInfo.data);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin nhóm:", err);
      }
    };

    if (obj?.conversation?.conversationType === "single") {
      fetchReceiver();
    }
    if (obj?.conversation?.conversationType === "group") {
      fetchReceiver();
      fetchInfoGroup();
    }
  }, [obj.conversation.conversationType, obj.conversation.conversationID]);
  const handleClick = async () => {
    const conversationID = obj?.conversation?.conversationID;
    if (conversationID === "" || conversationID === null) return;
    try {
      await updateStateSeen(conversationID);
      setIsSeen(true);
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái đã xem:", err);
    }
    setTypeContent({
      contentName: "conversation",
      conversation: obj,
    });
  };
  const isSender = obj.lastMessage?.senderID === userAuth?.userID;

  const handleRenderConversation = () => {
    if (obj?.conversation?.conversationType === "single") {
      return (
        <div
          className={`px-4 py-4 cursor-pointer ${
            typeContent.conversation?.conversation?.conversationID ===
            obj?.conversation?.conversationID
              ? "bg-blue-100"
              : "hover:bg-gray-100"
          }`}
          onClick={() => handleClick()}
        >
          <div className="flex justify-start">
            <div className="flex items-center">
              <span className="w-12 h-12 rounded-full bg-blue-500 mr-2">
                <img
                  src={receiver?.avatar}
                  alt="avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              </span>
              <div className={`space-y-1 ${isSeen ? "" : "font-bold"}`}>
                <p>{receiver?.fullName}</p>
                <p className="text-sm truncate max-w-[180px]">
                  {isSender ? "Bạn: " : `${receiver?.fullName}: `}
                  {(() => {
                    if (obj?.lastMessage?.messageType === "text") {
                      return obj?.lastMessage?.messageContent;
                    }
                    const parsedContent = safeParseArray(
                      obj?.lastMessage?.messageContent
                    );
                    return Array.isArray(parsedContent)
                      ? `${parsedContent.length} file${
                          parsedContent.length > 1 ? "s" : ""
                        }`
                      : obj?.lastMessage?.messageContent;
                  })()}
                </p>
              </div>
            </div>

            <span
              className={`text-xs ${
                isSeen ? "text-gray-500" : "font-bold text-black"
              } ml-auto`}
            >
              {parseTimestamp(obj?.lastMessage?.updatedAt)}
            </span>
          </div>
        </div>
      );
    }
    if (obj?.conversation?.conversationType === "group") {
      return (
        <div
          className={`px-4 py-4 cursor-pointer ${
            typeContent.conversation?.conversation?.conversationID ===
            obj?.conversation?.conversationID
              ? "bg-blue-100"
              : "hover:bg-gray-100"
          }`}
          onClick={() => handleClick()}
        >
          <div className="flex justify-start">
            <div className="flex items-center">
              <span className="w-12 h-12 rounded-full bg-blue-500 mr-2">
                <img
                  src={groupInfo?.groupAvatar}
                  alt="avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              </span>
              <div className={`space-y-1 ${isSeen ? "" : "font-bold"}`}>
                <p>{groupInfo?.groupName}</p>
                <p className="text-sm truncate max-w-[180px]">
                  {obj?.lastMessage?.messageContent ? (
                    <>
                      {obj?.lastMessage?.messageType === "system" ? (
                        obj?.lastMessage?.messageContent
                      ) : (
                        <>
                          {isSender ? "Bạn: " : `${receiver?.fullName}: `}
                          {(() => {
                            if (obj?.lastMessage?.messageType === "text") {
                              return obj?.lastMessage?.messageContent;
                            }

                            const parsedContent = safeParseArray(
                              obj?.lastMessage?.messageContent
                            );
                            return Array.isArray(parsedContent)
                              ? `${parsedContent.length} file${
                                  parsedContent.length > 1 ? "s" : ""
                                }`
                              : obj?.lastMessage?.messageContent;
                          })()}
                        </>
                      )}
                    </>
                  ) : (
                    "" // nếu không có messageContent hợp lệ, hiển thị rỗng
                  )}
                </p>
              </div>
            </div>

            <span
              className={`text-xs ml-auto ${
                isSeen ? "text-gray-500" : "font-bold text-black"
              }`}
            >
              {parseTimestamp(obj?.lastMessage?.updatedAt)}
            </span>
          </div>
        </div>
      );
    }
  };
  return <>{handleRenderConversation()}</>;
};

Conversation.propTypes = {
  obj: PropTypes.object.isRequired,
};

export default Conversation;
