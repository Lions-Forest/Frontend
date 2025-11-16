import { db } from "@/firebase/firebase";
import { doc, increment, updateDoc } from "firebase/firestore";

export function useLocationActions() {
  const likeUser = async (likedUserId: string) => {
    const likedUserDocRef = doc(db, "locations", likedUserId);
    try {
      await updateDoc(likedUserDocRef, {
        likeCount: increment(1),
      });
    } catch (error) {
      console.error("좋아요 업데이트 실패: ", error);
    }
  };
  return { likeUser };
}
