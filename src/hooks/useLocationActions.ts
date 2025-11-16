import { db } from "@/firebase/firebase";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  increment,
  updateDoc,
} from "firebase/firestore";

export function useLocationActions() {
  const likeUser = async (likedUserId: string, currentUserId: string) => {
    const likedUserDocRef = doc(db, "locations", likedUserId);

    try {
      const docSnap = await getDoc(likedUserDocRef);
      if (!docSnap.exists()) return;

      const data = docSnap.data();
      const likedByArray = data.likedBy || [];

      const alreadyLiked = likedByArray.includes(currentUserId);

      if (alreadyLiked) {
        await updateDoc(likedUserDocRef, {
          likedBy: arrayRemove(currentUserId),
        });
      } else {
        await updateDoc(likedUserDocRef, {
          likedBy: arrayUnion(currentUserId),
        });
      }
    } catch (error) {
      console.error("좋아요 업데이트 실패: ", error);
    }
  };
  return { likeUser };
}
