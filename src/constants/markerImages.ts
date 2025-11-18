import eatingLion from "@/assets/lion/eatingLion.svg";
import studyingLion from "@/assets/lion/studyingLion.svg";
import workingLion from "@/assets/lion/workingLion.svg";
import relaxingLion from "@/assets/lion/relaxingLion.svg";
import boringLion from "@/assets/lion/boringLion.svg";
import playingLion from "@/assets/lion/playingLion.svg";
import hungryLion from "@/assets/lion/hungryLion.svg";
import nothingLion from "@/assets/lion/nothingLion.svg";
import eatingMarker from "@/assets/marker/eatingMarker.png";
import studyingMarker from "@/assets/marker/studyingMarker.png";
import workingMarker from "@/assets/marker/workingMarker.png";
import relaxingMarker from "@/assets/marker/relaxingMarker.png";
import boringMarker from "@/assets/marker/boringMarker.png";
import playingMarker from "@/assets/marker/playingMarker.png";
import hungryMarker from "@/assets/marker/hungryMarker.png";
import nothingMarker from "@/assets/marker/nothingMarker.png";

export const getMarkerImage = (status: string, isMe = false) => {
  if (isMe) {
    switch (status) {
      case "eating":
        return eatingLion;
      case "studying":
        return studyingLion;
      case "working":
        return workingLion;
      case "relaxing":
        return relaxingLion;
      case "boring":
        return boringLion;
      case "playing":
        return playingLion;
      case "hungry":
        return hungryLion;
      case "nothing":
        return nothingLion;
    }
  } else {
    switch (status) {
      case "eating":
        return eatingMarker;
      case "studying":
        return studyingMarker;
      case "working":
        return workingMarker;
      case "relaxing":
        return relaxingMarker;
      case "boring":
        return boringMarker;
      case "playing":
        return playingMarker;
      case "hungry":
        return hungryMarker;
      case "nothing":
        return nothingMarker;
    }
  }
};
