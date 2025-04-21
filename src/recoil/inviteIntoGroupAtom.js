import { atom } from "recoil";

export const isInviteIntoGroupModalOpenState = atom({
  key: "isInviteIntoGroupModalOpenState",
  default: false,
});

export const membersInviteState = atom({
  key: "membersInviteState",
  default: [],
});
