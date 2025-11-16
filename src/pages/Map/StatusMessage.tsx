import Heart from "@/assets/icons/heart.svg";
import EmptyHeart from "@/assets/icons/emptyHeart.svg";
import styled from "styled-components";
import { CustomOverlayMap } from "react-kakao-maps-sdk";

interface Props {
  user: {
    latitude: number;
    longitude: number;
    message: string;
    userId: string;
  };
  likedBy: string[];
  currentUserId: string;
  onLike: () => void;
  isMe: boolean;
}

export default function StatusMessage({
  user,
  likedBy,
  currentUserId,
  onLike,
  isMe,
}: Props) {
  const totalLikes = likedBy.length;
  const iLiked = likedBy.includes(currentUserId);
  const anchor = { x: 0, y: 1 };
  const transform = isMe
    ? "translateX(35px) translateY(-130px)"
    : "translateX(65px) translateY(0px)";

  const handleLike = () => {
    onLike();
  };

  return (
    <CustomOverlayMap
      position={{
        lat: user.latitude,
        lng: user.longitude,
      }}
      xAnchor={anchor.x}
      yAnchor={anchor.y}
    >
      <MessageWrapper style={{ transform: transform }}>
        <LikeButton onClick={handleLike}>
          <img
            src={iLiked ? Heart : EmptyHeart}
            alt="좋아요"
            width={35}
            height={35}
          />
          {totalLikes > 0 && <LikeCount>{totalLikes}</LikeCount>}
        </LikeButton>
        <Message>{user.message}</Message>
      </MessageWrapper>
    </CustomOverlayMap>
  );
}

const MessageWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const Message = styled.div`
  min-height: 24px;
  background: #ffffff;
  padding: 4px 8px;
  border-radius: 4px;
  color: #00b353;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LikeButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(60%, -50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  width: 35px;
  height: 35px;
  cursor: pointer;
  z-index: 10;
`;

const LikeCount = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: Pretendard;
  font-size: 12px;
  font-weight: 500;
  color: #ffffff;
  pointer-events: none;
`;
