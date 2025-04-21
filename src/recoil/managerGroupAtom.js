import { atom } from "recoil";

export const isManagerGroupState = atom({
  key: "isManagerGroupState",
  default: false,
});

export const membersOfGroupState = atom({
  key: "membersOfGroupState",
  default: [],
});
