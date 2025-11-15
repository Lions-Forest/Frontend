import Heart from "@/assets/icons/heart.svg";
import EmptyHeart from "@/assets/icons/emptyHeart.svg";
import styled from "styled-components";
import { CustomOverlayMap } from "react-kakao-maps-sdk";
import { useState } from "react";

interface Props {
  user: {
    latitude: number;
    longitude: number;
    message: string;
    userId: string;
  };
  likeCount: number;
  onLike: (userId: string) => void;
}

export default function StatusMessage({
  user,
  likeCount: initialLikeCount,
  onLike,
}: Props) {
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  const handleLike = () => {
    const newCount = likeCount + 1;
    setLikeCount(newCount);
    onLike(user.userId);
  };

  return (
    <CustomOverlayMap
      position={{
        lat: user.latitude,
        lng: user.longitude,
      }}
      yAnchor={1.2}
    >
      <MessageWrapper>
        <LikeButton onClick={handleLike}>
          <img
            src={likeCount > 0 ? Heart : EmptyHeart}
            alt="좋아요"
            width={35}
            height={35}
          />
          {likeCount > 0 && <LikeCount>{likeCount}</LikeCount>}
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
  height: 19px;
  background: #ffffff;
  padding: 0 4px;
  border-radius: 4px;
  color: #00b353;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LikeButton = styled.button`
  position: relative;
  //   transform: translate(-50%, -50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  width: 35px;
  height: 35px;
  cursor: pointer;
  //   z-index: 10;
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
