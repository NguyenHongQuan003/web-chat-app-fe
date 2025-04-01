import { atom } from "recoil";

export const selectedConversationState = atom({
  key: "selectedConversationState",
  default: null,
});

export const selectedMenuItemState = atom({
  key: "selectedMenuItemState",
  default: null,
});
