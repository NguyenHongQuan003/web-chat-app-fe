import { atom } from "recoil";

export const selectedMessageState = atom({
  key: "selectedMessageState",
  default: null,
});

export const selectedReceiversState = atom({
  key: "selectedReceiversState",
  default: [],
});
