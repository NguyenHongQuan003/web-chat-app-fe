import { useEffect, useRef, useState } from "react";
import {
  BsThreeDotsVertical,
  BsTelephone,
  BsCameraVideo,
  BsLayoutSidebarInsetReverse,
  BsLayoutSidebarReverse,
} from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import { typeContentState } from "../recoil/leftPanelAtom";
// import { onlineUsersState } from "../recoil/onlineUsersAtom";
import {
  getMessagesByConversation,
  // sendFiles,
  // sendTextMessage,
} from "../services/messageService";

import { useSocket } from "../context/SocketContext";
import MessageInput from "./MessageInput";
import { hasNewMessageState } from "../recoil/hasNewMessageAtom";
// import { getReceiver } from "../services/conversationService";
import useMessageSocket from "../hooks/useMessageSocket";
import { useAuth } from "../utils/authUtils";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {
  getGroupInfo,
  sendFiles,
  sendMessage,
  sendReplyMessage,
} from "../services/groupService";
import { FaChevronDown, FaUser } from "react-icons/fa";
import ManagerGroup from "./ManagerGroup";
import { isManagerGroupState } from "../recoil/managerGroupAtom";
import useMemberOfGroupSocket from "../hooks/useMemberOfGroupSocket.js";
import DisplayMessageGroup from "./DisplayMessageGroup.jsx";
const ChatGroupWindow = () => {
  const socket = useSocket();
  const { user } = useAuth();
  const typeContent = useRecoilValue(typeContentState);
  const [selectedMessageID, setSelectedMessageID] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const pickerRef = useRef(null);
  const [groupInfo, setGroupInfo] = useState("");
  const [members, setMembers] = useState([]);
  const [selectedReplyMessage, setSelectedReplyMessage] = useState(null);
  const [isManagerGroupOpen, setIsManagerGroupOpen] =
    useRecoilState(isManagerGroupState);

  useMemberOfGroupSocket(socket, user?.userID, setMembers);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [messages, setMessages] = useState([]);
  useMessageSocket(socket, user?.userID, messages, setMessages);

  const [hasNewMessage, setHasNewMessage] = useRecoilState(hasNewMessageState);
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    if (messages.length > 0) {
      const container = scrollContainerRef.current;
      const isAtBottom =
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + 50;

      if (isAtBottom) {
        scrollToBottom();
        setHasNewMessage(false);
      } else {
        setHasNewMessage(true);
      }
    }
  }, [messages, setHasNewMessage]);

  useEffect(() => {
    // console.log("typeContent", typeContent);
    const fetchInfoGroup = async () => {
      const conversationID =
        typeContent.conversation?.conversation?.conversationID;
      if (!conversationID) return;
      try {
        const groupInfo = await getGroupInfo(conversationID);
        // console.log("groupInfo", groupInfo.data);
        setGroupInfo(groupInfo.data);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin nhóm:", err);
      }
    };
    fetchInfoGroup();

    const fetchedMessages = async () => {
      try {
        const conversationID =
          typeContent.conversation.conversation.conversationID;
        const fetchedMessages = await getMessagesByConversation(conversationID);
        const sortedMessages = fetchedMessages.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        // console.log("sortedMessages", sortedMessages);
        setMessages(sortedMessages);
      } catch {
        setMessages([]);
      }
    };
    fetchedMessages();
  }, [typeContent.conversation, setMessages, typeContent]);

  const [newMessage, setNewMessage] = useState("");

  const handleSend = async (e, files = [], replyMessage = null) => {
    e.preventDefault();
    const hasText = newMessage.trim() !== "";
    const hasFiles = files.length > 0;

    if (!hasText && !hasFiles) return;
    setIsSending(true);
    try {
      if (replyMessage !== null) {
        await handleSendReplyMessage(e, replyMessage);
        setSelectedReplyMessage(null);
      } else {
        // Gửi text (nếu có)
        if (hasText) {
          await handleSendTextMessage(e);
          setNewMessage(""); // reset input
        }

        // // Gửi file trước (nếu có)
        if (hasFiles) {
          await sendFiles(groupInfo?.groupID, files);
        }
      }
    } catch (err) {
      console.error("Lỗi khi gửi tin nhắn:", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendReplyMessage = async (e, replyMessage) => {
    e.preventDefault();
    if (replyMessage === null) return;
    try {
      await sendReplyMessage(
        newMessage,
        replyMessage.messageID,
        groupInfo?.groupID
      );
      setNewMessage("");
    } catch (err) {
      console.error("Lỗi khi gửi tin nhắn:", err);
    }
  };

  const handleSendTextMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await sendMessage(newMessage, groupInfo?.groupID);
      setNewMessage("");
    } catch (err) {
      console.error("Lỗi khi gửi tin nhắn:", err);
    }
  };
  return (
    <>
      <div className="flex flex-grow">
        <div className="relative bg-white flex flex-col flex-grow">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-300">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gray-300">
                <img
                  src={groupInfo?.groupAvatar || ""}
                  alt="avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold">
                  {groupInfo?.groupName || "Không có cuộc trò chuyện"}
                </h3>

                <button
                  onClick={() => setIsManagerGroupOpen(true)}
                  className="text-sm py-1 text-gray-500 flex items-center gap-1 cursor-pointer hover:text-blue-500"
                >
                  <div>
                    <FaUser />
                  </div>
                  {members?.length + " thành viên"}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-0.5 text-gray-600">
              {/* <button className="cursor-pointer hover:bg-gray-200 p-1.5 rounded-xs">
                <BsTelephone className="w-5 h-5 cursor-pointer" />
              </button> */}
              {/* <button className="cursor-pointer hover:bg-gray-200 p-1.5 rounded-xs">
                <BsCameraVideo className="w-5 h-5 cursor-pointer" />
              </button> */}
              {/* <button className="cursor-pointer hover:bg-gray-200 p-1.5 rounded-xs">
                <BsThreeDotsVertical className="w-5 h-5 cursor-pointer" />
              </button> */}
              <button
                onClick={() => setIsManagerGroupOpen(!isManagerGroupOpen)}
                className={`cursor-pointer hover:bg-gray-200 p-1.5 rounded-xs`}
              >
                {isManagerGroupOpen ? (
                  <BsLayoutSidebarInsetReverse
                    color="#0078E8"
                    className="w-5 h-5 "
                  />
                ) : (
                  <BsLayoutSidebarReverse className="w-5 h-5 " />
                )}
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 overflow-x-hidden bg-[#ebecf0]"
          >
            {messages.map((message) => (
              <DisplayMessageGroup
                key={message.messageID}
                message={message}
                selectedMessageID={selectedMessageID}
                setSelectedMessageID={setSelectedMessageID}
                setReplyMessage={setSelectedReplyMessage}
                members={members}
              />
            ))}
            {hasNewMessage && (
              <div className="absolute bottom-16 right-4">
                <button
                  onClick={() => {
                    scrollToBottom();
                    setHasNewMessage(false);
                  }}
                  className="border border-gray-100 bg-amber-300 text-white p-2 rounded-full shadow-lg"
                >
                  <FaChevronDown className="w-6 h-6" />
                </button>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="relative border-t border-gray-300 p-3">
            <div ref={pickerRef}>
              {showPicker && (
                <div className="absolute bottom-24 right-12">
                  <Picker
                    data={data}
                    onEmojiSelect={(emoji) => {
                      setNewMessage((prev) => prev + emoji.native);
                    }}
                  />
                </div>
              )}
            </div>
            <form className="flex items-center gap-2">
              <MessageInput
                isSending={isSending}
                value={newMessage}
                replyMessage={selectedReplyMessage}
                setReplyMessage={setSelectedReplyMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onSend={handleSend}
                onShowPicker={() => setShowPicker(!showPicker)}
                placeholder="Nhập tin nhắn..."
                className="flex-1"
              />
            </form>
          </div>
        </div>
      </div>
      <ManagerGroup members={members} />
    </>
  );
};

export default ChatGroupWindow;
