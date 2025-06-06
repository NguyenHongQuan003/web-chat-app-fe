import { useEffect, useRef, useState } from "react";
import { useAuth } from "../utils/authUtils";
import { FaAddressBook, FaCommentDots, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaGear } from "react-icons/fa6";
import UserDropDown from "../components/UserDropDown";

import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { currentTabState } from "../recoil/sidebarAtom";
import {
  isProfileModalOpenState,
  isChangePasswordModalOpenState,
  typeContentState,
  isShareModalOpenState,
  isShareGroupModalOpenState,
} from "../recoil/leftPanelAtom";
import SearchTool from "../components/SearchTool";
import LeftPanel from "../components/LeftPanel";
import ContentArea from "../components/ContentArea";
import ProfileModal from "../components/ProfileModal";
import ChangePasswordModal from "../components/ChangePasswordModal";
import { useSocket } from "../context/SocketContext";
import useSocketOnlineStatus from "../hooks/useSocketOnlineStatus";
import { sentRequestListState } from "../recoil/sentRequestList";
import useFriendRequestSocket from "../hooks/useFriendRequestSocket";
import useConversationSocket from "../hooks/useConversationSocket";
import ShareModal from "../components/ShareModal";
import CreateGroupModal from "../components/CreateGroupModal";
import { isCreateGroupModalOpenState } from "../recoil/createGroupAtom";
import InviteIntoGroupModal from "../components/InviteIntoGroupModal";
import { isInviteIntoGroupModalOpenState } from "../recoil/inviteIntoGroupAtom";
import ShareGroupModal from "../components/ShareGroupModal";
import VideoCallModal from "../components/VideoCallModal";
import {
  isVideoCallModalOpenState,
  statusOfCallVideo,
  incomingCallState,
} from "../recoil/leftPanelAtom";
import useInComingCall from "../hooks/useInComingCall";
import IncomingCallNotification from "../components/IncomingCallNotification";

const Home = () => {
  const socket = useSocket();
  const { user, signOut } = useAuth();
  const userDropdownRef = useRef(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [currentTab, setCurrentTab] = useRecoilState(currentTabState);
  const [isProfileModalOpen, setIsProfileModalOpen] = useRecoilState(
    isProfileModalOpenState
  );
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useRecoilState(isChangePasswordModalOpenState);
  const [isShareModalOpen, setIsShareModalOpen] = useRecoilState(
    isShareModalOpenState
  );
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useRecoilState(
    isCreateGroupModalOpenState
  );
  const [isInviteIntoGroupModalOpen, setIsInviteIntoGroupModalOpen] =
    useRecoilState(isInviteIntoGroupModalOpenState);
  const [isShareGroupModalOpen, setIsShareGroupModalOpen] = useRecoilState(
    isShareGroupModalOpenState
  );
  const [isVideoCallOpen, setIsVideoCallOpen] = useRecoilState(
    isVideoCallModalOpenState
  );
  const setCallStatus = useSetRecoilState(statusOfCallVideo);
  const tabs = [
    { id: "chat", icon: FaCommentDots, label: "Tin nhắn" },
    { id: "contacts", icon: FaAddressBook, label: "Danh bạ" },
  ];

  useConversationSocket(socket, user?.userID);
  const onlineStatus = socket?.connected;
  useSocketOnlineStatus(socket, user?.userID);
  const setSentRequestListRecoil = useSetRecoilState(sentRequestListState);

  const { sentRequestList } = useFriendRequestSocket(socket, user?.userID);

  useEffect(() => {
    setSentRequestListRecoil(sentRequestList);
  }, [sentRequestList, setSentRequestListRecoil]);

  const typeContent = useRecoilValue(typeContentState);
  useEffect(() => {
    // console.log("typeContent", typeContent);
  }, [typeContent]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // notification for incoming call
  const [inComingCall, setInComingCall] = useRecoilState(incomingCallState);
  useInComingCall(socket, user?.userID);
  const handleAnswerCall = () => {
    setIsVideoCallOpen(true);
    setCallStatus("receiving");
    setInComingCall(null);
  };

  const handleRejectCall = () => {
    setInComingCall(null);
  };

  return (
    <div className=" flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="min-w-16 bg-[#005ae0] flex flex-col items-center py-4">
        <div className="text-white mb-6">
          {user ? (
            <div className="flex" ref={userDropdownRef}>
              <button
                className="relative flex items-center p-2 hover:cursor-pointer rounded-full "
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              >
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="h-12 w-12 rounded-full border-1 border-white object-cover"
                />
                <div
                  className={`absolute ${
                    onlineStatus ? "bg-green-500" : "bg-red-500"
                  } right-2 bottom-2 w-4 h-4 border-2 border-[#005ae0] rounded-full `}
                ></div>
              </button>
              {isUserDropdownOpen && (
                <UserDropDown user={user} signOut={signOut} />
              )}
            </div>
          ) : (
            <Link to="/login" className="relative flex items-center">
              <div className="p-2 hover:cursor-pointer rounded-full bg-white">
                <FaUser className="text-[#0078E8] h-5 w-5" />
              </div>
              <div
                className={`absolute ${
                  onlineStatus ? "bg-green-500" : "bg-red-500"
                } right-0 bottom-0 w-4 h-4 border-2 border-[#005ae0] rounded-full `}
              ></div>
            </Link>
          )}
        </div>
        <div className="space-y-2 text-white">
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
          <div className="rounded-md p-3 hover:bg-[#0043a8] flex">
            <FaGear className="w-6 h-6 cursor-pointer" />
          </div>
        </div>
      </div>

      <div className="flex flex-col h-full">
        <SearchTool />
        <LeftPanel />
      </div>
      <ContentArea />
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      />
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        s
      />
      <ShareGroupModal
        isOpen={isShareGroupModalOpen}
        onClose={() => setIsShareGroupModalOpen(false)}
      />
      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
      />
      <InviteIntoGroupModal
        isOpen={isInviteIntoGroupModalOpen}
        onClose={() => setIsInviteIntoGroupModalOpen(false)}
      />
      <VideoCallModal
        isOpen={isVideoCallOpen}
        onClose={() => setIsVideoCallOpen(false)}
      />
      {inComingCall !== null && !isVideoCallOpen && (
        <IncomingCallNotification
          callerID={inComingCall.from}
          onAnswer={handleAnswerCall}
          onReject={handleRejectCall}
        />
      )}
    </div>
  );
};

export default Home;
