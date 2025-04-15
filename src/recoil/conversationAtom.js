import { atom } from "recoil";

export const conversationListState = atom({
  key: "conversationListState", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
