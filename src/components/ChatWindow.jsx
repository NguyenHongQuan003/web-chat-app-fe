import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  BsThreeDotsVertical,
  BsTelephone,
  BsCameraVideo,
} from "react-icons/bs";
import { IoMdImages } from "react-icons/io";
import { FaRegSmile } from "react-icons/fa";
import { IoNotifications, IoSend } from "react-icons/io5";
import { useRecoilState, useRecoilValue } from "recoil";
import { typeContentState } from "../recoil/leftPanelAtom";
import { onlineUsersState } from "../recoil/onlineUsersAtom";
import {
  getMessagesByConversation,
  sendTextMessage,
} from "../services/messageService";
import { useAuth } from "../utils/authUtils";
import { parseTimestamp } from "../utils/parse";
import { messageListState } from "../recoil/messageAtom";
import MessageInput from "./MessageInput";
import { hasNewMessageState } from "../recoil/hasNewMessageAtom";
const ChatWindow = () => {
  const typeContent = useRecoilValue(typeContentState);
  const { user: userAuth } = useAuth();
  const [receiverID, setReceiverID] = useState("");
  const [receiverOnline, setReceiverOnline] = useState(false);
  const onlineUsers = useRecoilValue(onlineUsersState);

  const [messages, setMessages] = useRecoilState(messageListState);

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
    console.log("messages", messages);
    const findIIdReceiver = messages.find(
      (item) => item.senderID !== userAuth.userID
    );
    console.log("findIIdReceiver", findIIdReceiver);
    if (findIIdReceiver) {
      setReceiverID(findIIdReceiver);
    }
  }, [messages, userAuth.userID]);

  useEffect(() => {
    const fetchedMessages = async () => {
      const conversationID =
        typeContent.conversation.conversation.conversationID;
      if (!conversationID) return;
      try {
        const fetchedMessages = await getMessagesByConversation(conversationID);
        const sortedMessages = fetchedMessages.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        setMessages(sortedMessages);
      } catch (err) {
        console.error("Lỗi khi lấy tin nhắn:", err);
        setMessages([]);
      }
    };
    fetchedMessages();
  }, [typeContent.conversation, setMessages]);

  useEffect(() => {
    if (onlineUsers.length > 0) {
      const isReceiverOnline = onlineUsers.some(
        (userID) => userID === receiverID.senderID
      );
      console.log("isReceiverOnline", isReceiverOnline);
      setReceiverOnline(isReceiverOnline);
    }
  }, [onlineUsers, receiverID]);

  const [newMessage, setNewMessage] = useState("");

  // const handleSendMessage = (e) => {
  //   e.preventDefault();
  //   if (newMessage.trim() !== "") {
  //     setMessages([
  //       ...messages,
  //       { id: messages.length + 1, sender: "Bạn", text: newMessage },
  //     ]);
  //     setNewMessage("");
  //   }
  // };
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await sendTextMessage(receiverID.senderID, newMessage);
      setNewMessage("");
    } catch (err) {
      console.error("Lỗi khi gửi tin nhắn:", err);
    }
  };

  // const handleFileChange = async (e) => {
  //   const files = Array.from(e.target.files);
  //   if (files.length === 0) return;

  //   try {
  //     const response = await sendFiles(receiver.userID, files);

  //     // Tùy vào response trả về, bạn có thể cập nhật tin nhắn
  //     // response.forEach((fileMsg) => {
  //     //   setMessages((prev) => [
  //     //     ...prev,
  //     //     {
  //     //       id: fileMsg.messageID,
  //     //       sender: "Bạn",
  //     //       text: `Đã gửi tệp: ${fileMsg.fileName || "File"}`,
  //     //     },
  //     //   ]);
  //     // });
  //   } catch (err) {
  //     console.error("Lỗi gửi file:", err);
  //   }
  // };

  // const handleRevoke = async (messageID) => {
  //   try {
  //     await revokeMessage(receiver.userID, messageID);
  //     setMessages((prev) =>
  //       prev.map((msg) =>
  //         msg.id === messageID ? { ...msg, text: "[Đã thu hồi]" } : msg
  //       )
  //     );
  //   } catch (err) {
  //     console.error("Lỗi thu hồi tin nhắn:", err);
  //   }
  // };
  // const handleDelete = async (messageID) => {
  //   try {
  //     await deleteMessage(messageID);
  //     setMessages((prev) => prev.filter((msg) => msg.id !== messageID));
  //   } catch (err) {
  //     console.error("Lỗi xoá tin nhắn:", err);
  //   }
  // };

  // const handleShare = async (messageID) => {
  //   const receiverIds = prompt("Nhập ID người nhận, cách nhau bởi dấu phẩy");
  //   if (!receiverIds) return;

  //   try {
  //     await shareMessage(messageID, receiverIds.split(","));
  //     alert("Chia sẻ thành công!");
  //   } catch (err) {
  //     console.error("Lỗi chia sẻ:", err);
  //   }
  // };

  return (
    <div className="flex flex-grow">
      <div className="bg-white flex flex-col flex-grow">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-300">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gray-300">
              <img
                src={typeContent.conversation.conversation?.conversationAvatar}
                alt="avatar"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold">
                {typeContent.conversation.conversation.conversationName ||
                  "Không có cuộc trò chuyện"}
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
            <BsTelephone className="w-5 h-5 cursor-pointer" />
            <BsCameraVideo className="w-5 h-5 cursor-pointer" />
            <BsThreeDotsVertical className="w-5 h-5 cursor-pointer" />
          </div>
        </div>

        {/* Messages */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {hasNewMessage && (
            <div className="absolute bottom-16 right-4">
              <button
                onClick={() => {
                  scrollToBottom();
                  setHasNewMessage(false);
                }}
                className="border border-gray-100 bg-amber-300 text-white p-2 rounded-full shadow-lg"
              >
                <IoNotifications className="w-6 h-6" />
              </button>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message?.messageID}
              className={`flex ${
                message.senderID === userAuth.userID
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
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
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-gray-300 p-3">
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-2"
          >
            <div className="flex items-center gap-2">
              <IoMdImages className="w-6 h-6 text-gray-500 cursor-pointer" />
              <FaRegSmile className="w-6 h-6 text-gray-500 cursor-pointer" />
            </div>
            <MessageInput
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onSend={handleSendMessage}
              placeholder="Nhập tin nhắn..."
              className="flex-1"
            />
            <button type="submit" className="text-blue-500 hover:text-blue-600">
              <IoSend className="w-6 h-6" />
            </button>
          </form>
        </div>
      </div>

      {/* <ChatInfo /> */}
    </div>
  );
};

ChatWindow.propTypes = {
  currentChat: PropTypes.object,
};

export default ChatWindow;
