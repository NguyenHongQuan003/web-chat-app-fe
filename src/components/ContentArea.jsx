import { useRecoilValue } from "recoil";
import { typeContentState } from "../recoil/leftPanelAtom";

import ChatWindow from "./ChatWindow";
import FriendList from "./FriendList";
import FriendRequestList from "./FriendRequestList";
import Welcome from "./Welcome";

const ContentArea = () => {
  const typeContent = useRecoilValue(typeContentState);

  const renderContent = () => {
    if (typeContent.contentName === "conversation") {
      return <ChatWindow currentChat={typeContent.chat} />;
    }
    if (typeContent.contentName === "friends") {
      return <FriendList />;
    }
    if (typeContent.contentName === "groups") {
      return <div>Groups</div>;
    }
    if (typeContent.contentName === "friendRequests") {
      return <FriendRequestList />;
    }
    if (typeContent.contentName === "groupInvites") {
      return <div>Group Invites</div>;
    }
    return <Welcome />;
  };

  return <>{renderContent()}</>;
};

export default ContentArea;
