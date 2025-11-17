import type { UserLocation } from "@/api/UserLocation";
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
  key: "recoil-map",
  storage: localStorage,
});

export const shareLocationState = atom<boolean>({
  key: "shareLocationState",
  default: false,
  effects_UNSTABLE: [persistAtom],
});

export const selectedStatusState = atom<NonNullable<UserLocation["status"]>>({
  key: "selectedStatusState",
  default: "nothing",
  effects_UNSTABLE: [persistAtom],
});

export const statusMessageState = atom<string>({
  key: "statusMessageState",
  default: "",
  effects_UNSTABLE: [persistAtom],
});
