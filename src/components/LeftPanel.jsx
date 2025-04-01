// import React from "react";

import ConversationList from "./ConversationList";
import { useRecoilValue } from "recoil";
import { currentTabState } from "../recoil/sidebarAtom";
import SidebarContact from "./SidebarContact";

const LeftPanel = () => {
  const currentTab = useRecoilValue(currentTabState);
  const handleRender = () => {
    if (currentTab === "chat") {
      return <ConversationList />;
    } else if (currentTab === "contacts") {
      return <SidebarContact />;
    }
  };
  return <>{handleRender()}</>;
};

export default LeftPanel;
