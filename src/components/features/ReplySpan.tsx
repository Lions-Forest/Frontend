import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { MdFavorite as FilledLike} from "react-icons/md";
import { MdFavoriteBorder as EmptyLike } from "react-icons/md";
import type { Reply } from "@/types";
import { fetchLikeState } from "@/api/meeting/replyApi";
import defaultProfile from '../../assets/icons/lionHead.png'

interface ReplyProps {
    reply: Reply;
    pressedLike: boolean; // 현재 유저가 좋아요 눌렀는지
    onLikeClick?: () => void;
}

function ReplySpan({ reply, onLikeClick }: ReplyProps){
  const [pressedLike, setPressedLike] = useState(false);

  useEffect (() => {
    const checkPressedLike = async (id : number) => {
      const result = await fetchLikeState(id);
      console.log("좋아요 눌렀음??: ", result);
      setPressedLike(result.liked);
    }
    checkPressedLike(reply.id);
  }, [reply]);

    return(
        <ReplyLayout>
          <ReplySection>
            <ProfileImg src={defaultProfile} />
            <DetailSection>
              <ProfileName>{reply.userNickname}</ProfileName>
              <ReplyDetail>{reply.detail}</ReplyDetail>
            </DetailSection>
          </ReplySection>
          <LikeSection>
            <LikeIcon onClick={onLikeClick} pressed={pressedLike}>
              {pressedLike
                ? <FilledLike size={18} color="#FF2370" />
                : <EmptyLike size={18} color="#B5B5B5" />
              }
            </LikeIcon>
            <LikeNum pressed={pressedLike}>{reply.likes}</LikeNum>
          </LikeSection>
      </ReplyLayout>
    )
}

export default ReplySpan;

const ReplyLayout = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    align-self: stretch;
    padding: 15px 0px;
`;

const ReplySection = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 16px;
    width: 95%;
`;

const ProfileImg = styled.img`
    width: 32px;
    height: 32px;
    border-radius: 4px;
    background: #fff;
    object-fit: scale-down;
`;

const DetailSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const ProfileName = styled.div`
    align-self: stretch;
    color: #000;

    /* Body2-B/12 */
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
`;

const ReplyDetail = styled.div`
    align-self: stretch;
    color: #000;
    word-wrap: break-word;
    overflow-wrap: break-word;

    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px; /* 166.667% */
`;

const LikeSection = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    gap: 0.5px;
`;

const LikeIcon = styled.div<{ pressed?: boolean }>`
  width: 18px;
  height: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LikeNum = styled.div<{ pressed?: boolean }>`
    color: ${({ pressed }) => (pressed ? "#FF2370" : "#2D2D2D")};
    font-family: Pretendard;
    font-size: 8px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
`;