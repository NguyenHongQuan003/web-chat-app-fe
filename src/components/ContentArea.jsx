import { useRecoilState } from "recoil";
import {
  selectedMenuItemState,
  selectedConversationState,
} from "../recoil/leftPanelAtom";
import { useEffect } from "react";
import ChatWindow from "./ChatWindow";
import FriendList from "./FriendList";
import FriendRequestList from "./FriendRequestList";
import Welcome from "./Welcome";

const ContentArea = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useRecoilState(
    selectedMenuItemState
  );
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationState
  );

  // Reset selectedConversation khi selectedMenuItem thay đổi
  useEffect(() => {
    if (selectedMenuItem !== null && selectedConversation !== null) {
      setSelectedConversation(null);
    }
  }, [selectedMenuItem, selectedConversation, setSelectedConversation]);

  // Reset selectedMenuItem khi selectedConversation thay đổi
  useEffect(() => {
    if (selectedConversation !== null && selectedMenuItem !== null) {
      setSelectedMenuItem(null);
    }
  }, [selectedConversation, selectedMenuItem, setSelectedMenuItem]);

  const renderConversation = () => {
    if (selectedConversation) {
      return <ChatWindow currentChat={selectedConversation} />;
    }
    return null;
  };

  const renderMenuContent = () => {
    switch (selectedMenuItem) {
      case "friends":
        return <FriendList />;
      case "groups":
        return <div>Groups</div>;
      case "friendRequests":
        return <FriendRequestList />;
      case "groupInvites":
        return <div>Group Invites</div>;
      default:
        return <Welcome />;
    }
  };

  return (
    <>{selectedConversation ? renderConversation() : renderMenuContent()}</>
  );
};

export default ContentArea;
