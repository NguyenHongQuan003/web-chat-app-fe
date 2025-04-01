import { useEffect, useRef, useState } from "react";
import BoxLeft from "../components/BoxLeft";
import { useAuth } from "../utils/authUtils";
import { FaAddressBook, FaCommentDots, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaGear } from "react-icons/fa6";
import UserDropDown from "../components/UserDropDown";
import ChatWindow from "../components/ChatWindow";
import { useRecoilState } from "recoil";
import { currentTabState } from "../recoil/sidebarAtom";
import SearchTool from "../components/SearchTool";
import LeftPanel from "../components/LeftPanel";
import ContentArea from "../components/ContentArea";

const Home = () => {
  const [currentTab, setCurrentTab] = useRecoilState(currentTabState);
  const tabs = [
    { id: "chat", icon: FaCommentDots, label: "Tin nhắn" },
    { id: "contacts", icon: FaAddressBook, label: "Danh bạ" },
  ];
  const { user, signOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);

  const [tab, setTab] = useState("chat");

  const handleTabChange = (tabName) => {
    setTab(tabName);
  };

  const [currentChat, setCurrentChat] = useState(null);
  const handleChatChange = (chatID) => {
    setCurrentChat(chatID);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className=" flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="min-w-16 bg-[#005ae0] flex flex-col items-center py-4">
        <div className="text-white mb-6">
          {user ? (
            <div className="flex" ref={userDropdownRef}>
              <button
                className="flex items-center p-2 hover:cursor-pointer rounded-full "
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="h-12 w-12 rounded-full border-1 border-white object-cover"
                />
              </button>
              {isDropdownOpen && <UserDropDown user={user} signOut={signOut} />}
            </div>
          ) : (
            <Link to="/login" className="flex items-center">
              <div className="p-2 hover:cursor-pointer rounded-full bg-white">
                <FaUser className="text-[#0078E8] h-5 w-5" />
              </div>
            </Link>
          )}
        </div>
        <div className="space-y-2 text-white">
          {/* <div
            className={`${
              tab === "chat" ? "bg-[#0043a8]" : ""
            } rounded-md p-3 hover:bg-[#0043a8]`}
            onClick={() => handleTabChange("chat")}
          >
            <FaCommentDots className="w-6 h-6 cursor-pointer" />
          </div>
          <div
            className={`${
              tab === "friend" ? "bg-[#0043a8]" : ""
            } rounded-md p-3 hover:bg-[#0043a8]`}
            onClick={() => handleTabChange("friend")}
          >
            <FaAddressBook className="w-6 h-6 cursor-pointer" />
          </div> */}
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`p-3 rounded-lg ${
                currentTab === tab.id ? "bg-[#0043a8]" : "hover:bg-[#0043a8]"
              }`}
            >
              <tab.icon className="w-6 h-6 text-white" />
            </div>
          ))}
        </div>
        <div className="mt-auto space-y-2 text-white">
          <div className="rounded-md p-3 hover:bg-[#0043a8]">
            <FaGear className="w-6 h-6 cursor-pointer" />
          </div>
        </div>
      </div>

      <div className="flex flex-col h-full">
        <SearchTool />
        <LeftPanel />
      </div>
      <ContentArea />

      {/* Chat List */}
      {/* <BoxLeft tab={tab} onChatChange={handleChatChange} /> */}
      {/* Chat Window */}
      {/* <ChatWindow currentChat={currentChat} /> */}
    </div>
  );
};

export default Home;
