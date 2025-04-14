// src/components/ChatWindow.jsx
import { useEffect, useState } from "react";
import ChatInfo from "./ChatInfo";
import PropTypes from "prop-types";
import {
  BsThreeDotsVertical,
  BsTelephone,
  BsCameraVideo,
} from "react-icons/bs";
import { IoMdImages } from "react-icons/io";
import { FaRegSmile } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { useRecoilValue } from "recoil";
import { typeContentState } from "../recoil/leftPanelAtom";

const ChatWindow = () => {
  const typeContent = useRecoilValue(typeContentState);
  const currentChat = typeContent.chat.currentChat;
  const [receiver, setReceiver] = useState({});

  useEffect(() => {
    console.log("typeContent.chat.receiver", typeContent.chat.receiver);
    setReceiver(typeContent.chat.receiver);
  }, [typeContent.chat.receiver]);
  const [messages, setMessages] = useState([
    { id: 1, sender: "Bạn A", text: "Xin chào!" },
    { id: 2, sender: "Bạn", text: "Chào bạn!" },
    { id: 3, sender: "Bạn A", text: "Xin chào!" },
    { id: 4, sender: "Bạn", text: "Chào bạn!" },
    { id: 5, sender: "Bạn A", text: "Xin chào!" },
    { id: 6, sender: "Bạn", text: "Chào bạn!" },
    { id: 7, sender: "Bạn A", text: "Xin chào!" },
    { id: 8, sender: "Bạn", text: "Chào bạn!" },
    { id: 9, sender: "Bạn A", text: "Xin chào!" },
    { id: 10, sender: "Bạn", text: "Chào bạn!" },
    { id: 11, sender: "Bạn A", text: "Xin chào!" },
    { id: 12, sender: "Bạn", text: "Chào bạn!" },
    { id: 13, sender: "Bạn A", text: "Xin chào!" },
    { id: 14, sender: "Bạn", text: "Chào bạn!" },
    { id: 15, sender: "Bạn A", text: "Xin chào!" },
    { id: 16, sender: "Bạn", text: "Chào bạn!" },
    { id: 17, sender: "Bạn A", text: "Xin chào!" },
    { id: 18, sender: "Bạn", text: "Chào bạn!" },
    { id: 19, sender: "Bạn A", text: "Xin chào!" },
    { id: 20, sender: "Bạn", text: "Chào bạn!" },
    { id: 21, sender: "Bạn A", text: "Xin chào!" },
    { id: 22, sender: "Bạn", text: "Chào bạn!" },
    { id: 23, sender: "Bạn A", text: "Xin chào!" },
    { id: 24, sender: "Bạn", text: "Chào bạn!" },
    { id: 25, sender: "Bạn A", text: "Xin chào!" },
    { id: 26, sender: "Bạn", text: "Chào bạn!" },
    { id: 27, sender: "Bạn A", text: "Xin chào!" },
    { id: 28, sender: "Bạn", text: "Chào bạn!" },
    { id: 29, sender: "Bạn A", text: "Xin chào!" },
    { id: 30, sender: "Bạn", text: "Chào bạn!" },
    { id: 31, sender: "Bạn A", text: "Xin chào!" },
    { id: 32, sender: "Bạn", text: "Chào bạn!" },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() !== "") {
      setMessages([
        ...messages,
        { id: messages.length + 1, sender: "Bạn", text: newMessage },
      ]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-grow">
      <div className="bg-white flex flex-col flex-grow">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-300">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gray-300">
              <img
                src={receiver?.avatar}
                alt="avatar"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold">
                {receiver?.fullName || "Không có cuộc trò chuyện"}
              </h3>
              <span className="text-sm text-gray-500">
                {currentChat?.status || "Offline"}
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
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "Bạn" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                  message.sender === "Bạn"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                <p>{message.text}</p>
              </div>
            </div>
          ))}
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
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Aa"
              className="flex-1 p-2 rounded-full bg-gray-100 focus:outline-none"
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
