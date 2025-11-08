import StudyingMarker from "@/assets/images/LoadingLion.svg";
import EatingMarker from "@/assets/images/LoadingLion.svg";

export const getMarkerImage = (status: string) => {
  switch (status) {
    case "studying":
      return StudyingMarker;
    case "eating":
      return EatingMarker;
  }
};
