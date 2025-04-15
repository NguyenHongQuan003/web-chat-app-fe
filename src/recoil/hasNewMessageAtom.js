import { atom } from "recoil";

export const hasNewMessageState = atom({
  key: "hasNewMessageState",
  default: false,
});
