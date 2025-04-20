import { atom } from "recoil";

export const onlineUsersState = atom({
  key: "onlineUsersState",
  // default: [],
  default: new Set(),
});
