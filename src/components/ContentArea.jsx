import { useRecoilState } from "recoil";
import {
  selectedMenuItemState,
  selectedConversationState,
} from "../recoil/leftPanelAtom";
import { useEffect } from "react";
import ChatWindow from "./ChatWindow";

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
        return <div>Friends</div>;
      case "groups":
        return <div>Groups</div>;
      case "friendRequests":
        return <div>Friend Requests</div>;
      case "groupInvites":
        return <div>Group Invites</div>;
      default:
        return <div>Màn hình welcome</div>;
    }
  };

  return (
    <>{selectedConversation ? renderConversation() : renderMenuContent()}</>
  );
};

export default ContentArea;
