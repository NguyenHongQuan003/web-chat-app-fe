import { atom } from "recoil";

export const selectedConversationState = atom({
  key: "selectedConversationState",
  default: null,
});

export const selectedMenuItemState = atom({
  key: "selectedMenuItemState",
  default: null,
});

export const isProfileModalOpenState = atom({
  key: "isProfileModalOpenState",
  default: false,
});

export const isChangePasswordModalOpenState = atom({
  key: "isChangePasswordModalOpenState",
  default: false,
});

export const isShareModalOpenState = atom({
  key: "isShareModalOpenState",
  default: false,
});

export const typeContentState = atom({
  key: "typeContentState",
  default: {
    contentName: null,
    conversation: null,
  },
});

export const isShareGroupModalOpenState = atom({
  key: "isShareGroupModalOpenState",
  default: false,
});

export const isVideoCallModalOpenState = atom({
  key: "isVideoCallModalOpenState",
  default: false,
});

export const incomingCallState = atom({
  key: "incomingCallState",
  default: null,
});

export const statusOfCallVideo = atom({
  key: "statusOfCallVideo",
  default: "idle", // idle, calling, receiving, connected
});

export const infoChatVideoState = atom({
  key: "infoChatVideoState",
  default: {
    conversationID: null,
    receiver: null,
    isGroup: false,
  },
});
