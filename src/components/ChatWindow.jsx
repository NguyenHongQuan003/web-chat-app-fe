import { useEffect, useRef, useState } from "react";
import {
  // BsThreeDotsVertical,
  // BsTelephone,
  BsCameraVideo,
} from "react-icons/bs";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { typeContentState } from "../recoil/leftPanelAtom";
import { onlineUsersState } from "../recoil/onlineUsersAtom";
import {
  getMessagesByConversation,
  sendFiles,
  sendTextMessage,
  sendReplyMessage,
} from "../services/messageService";

import { useSocket } from "../context/SocketContext";
import MessageInput from "./MessageInput";
import { hasNewMessageState } from "../recoil/hasNewMessageAtom";
import { getReceiver } from "../services/conversationService";
import DisplayMessage from "./DisplayMessage";
import useMessageSocket from "../hooks/useMessageSocket";
import { useAuth } from "../utils/authUtils";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { FaChevronDown } from "react-icons/fa";
import {
  isVideoCallModalOpenState,
  infoChatVideoState,
} from "../recoil/leftPanelAtom";

const ChatWindow = () => {
  const socket = useSocket();
  const { user } = useAuth();
  const typeContent = useRecoilValue(typeContentState);
  const [receiver, setReceiver] = useState("");
  const [selectedMessageID, setSelectedMessageID] = useState(null);
  const [receiverOnline, setReceiverOnline] = useState(false);
  const onlineUsers = useRecoilValue(onlineUsersState);
  const [showPicker, setShowPicker] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [selectedReplyMessage, setSelectedReplyMessage] = useState(null);
  const pickerRef = useRef(null);
  const setIsVideoCallOpen = useSetRecoilState(isVideoCallModalOpenState);
  const setInfoChatVideo = useSetRecoilState(infoChatVideoState);
  const infoChatVideo = useRecoilValue(infoChatVideoState);

  useEffect(() => {
    // console.log("replyMessage", selectedReplyMessage);
  }, [selectedReplyMessage]);

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
    const fetchReceiver = async () => {
      try {
        const conversationID =
          typeContent.conversation.conversation.conversationID;
        const receiver = await getReceiver(conversationID);
        setReceiver(receiver);
      } catch {
        setReceiver(typeContent.receiver);
      }
    };
    fetchReceiver();
    const fetchedMessages = async () => {
      try {
        const conversationID =
          typeContent.conversation.conversation.conversationID;
        const fetchedMessages = await getMessagesByConversation(conversationID);
        const sortedMessages = fetchedMessages.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        setMessages(sortedMessages);
      } catch {
        setMessages([]);
      }
    };
    fetchedMessages();
  }, [typeContent.conversation, setMessages, typeContent.receiver]);

  useEffect(() => {
    if (onlineUsers.size > 0) {
      const isReceiverOnline = onlineUsers.has(receiver.userID);
      // console.log("isReceiverOnline", isReceiverOnline);
      setReceiverOnline(isReceiverOnline);
    }
  }, [onlineUsers, receiver]);

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
          await sendFiles(receiver.userID, files);
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
        receiver.userID,
        newMessage,
        replyMessage.messageID,
        replyMessage.conversationID
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
      await sendTextMessage(receiver.userID, newMessage);
      setNewMessage("");
    } catch (err) {
      console.error("Lỗi khi gửi tin nhắn:", err);
    }
  };
  const handleOpenVideoCall = () => {
    if (!receiver || !receiver.userID) return;
    setInfoChatVideo({
      conversationID: typeContent.conversation.conversation.conversationID,
      receiver: receiver,
      isGroup:
        typeContent.conversation.conversation.conversationType === "group",
    });
    setIsVideoCallOpen(true);
  };

  useEffect(() => {
    // console.log("infoChatVideo", infoChatVideo);
  }, [infoChatVideo]);
  return (
    <div className="flex flex-grow">
      <div className="bg-white flex flex-col flex-grow">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-300">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gray-300">
              <img
                src={receiver?.avatar || ""}
                alt="avatar"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold">
                {receiver?.fullName || "Không có cuộc trò chuyện"}
              </h3>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <div
                  className={`${
                    receiverOnline ? "bg-green-500" : "bg-red-500"
                  } right-0 bottom-0 w-2 h-2 rounded-full `}
                ></div>
                {receiverOnline ? "Đang hoạt động" : "Không hoạt động"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-gray-600">
            {/* <BsTelephone className="w-5 h-5 cursor-pointer" /> */}
            <BsCameraVideo
              className="w-5 h-5 cursor-pointer hover:text-blue-500"
              onClick={handleOpenVideoCall}
            />
            {/* <BsThreeDotsVertical className="w-5 h-5 cursor-pointer" /> */}
          </div>
        </div>

        {/* Messages */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-3 overflow-x-hidden bg-[#ebecf0]"
        >
          {messages.map((message) => (
            <DisplayMessage
              key={message.messageID}
              message={message}
              selectedMessageID={selectedMessageID}
              setSelectedMessageID={setSelectedMessageID}
              participantId={receiver?.userID}
              receiver={receiver}
              setReplyMessage={setSelectedReplyMessage}
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
  );
};

export default ChatWindow;
