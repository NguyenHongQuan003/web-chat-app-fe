import { useRecoilValue } from "recoil";
import { typeContentState } from "../recoil/leftPanelAtom";

import ChatWindow from "./ChatWindow";
import FriendList from "./FriendList";
import FriendRequestList from "./FriendRequestList";
import Welcome from "./Welcome";
import ChatGroupWindow from "./ChatGroupWindow";
import GroupList from "./GroupList";

const ContentArea = () => {
  const typeContent = useRecoilValue(typeContentState);

  const renderContent = () => {
    if (
      typeContent.contentName === "conversation" &&
      (typeContent?.conversation?.conversation?.conversationType === "single" ||
        !(
          "conversationType" in (typeContent?.conversation?.conversation || {})
        ))
    ) {
      // console.log("Mở chat cá nhân:", typeContent);
      return <ChatWindow />;
    }

    if (
      typeContent.contentName === "conversation" &&
      typeContent.conversation.conversation.conversationType === "group"
    ) {
      // console.log("Mở chat nhóm:", typeContent);
      return <ChatGroupWindow />;
    }
    if (typeContent.contentName === "friends") {
      return <FriendList />;
    }
    if (typeContent.contentName === "groups") {
      return <GroupList />;
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
