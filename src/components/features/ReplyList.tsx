import React from "react";
import styled from "styled-components";
import ReplySpan from "./ReplySpan";
import ReplyInput from "./ReplyInput";
import type { Reply } from "@/types";

interface ReplyListProps {
    replies: Reply[];
    meetingDate: Date | string;
    likesPressed: boolean[]; // 각 댓글별 좋아요 상태
    onLikeToggle: (index: number) => void;
    onReplySubmit: (text: string) => void;
}

function ReplyList({
    replies,
    meetingDate,
    likesPressed,
    onLikeToggle,
    onReplySubmit
  }: ReplyListProps) {

    return (
      <ReplyLayout>
        <Title>댓글</Title>
        <Replies>
          {replies.length === 0 ? (
            <EmptyText>아직 댓글이 없습니다.</EmptyText>
          ) : (
            replies.map((reply) => (
              <ReplySpan
                key={reply.id}
                reply={reply}
                pressedLike={likesPressed[reply.id]}
                onLikeClick={() => onLikeToggle(reply.id)}
              />
            ))
          )}
        </Replies>
        <ReplyInputWrapper>
          <ReplyInput
            meetingDate={meetingDate}
            onSubmit={onReplySubmit}
          />
        </ReplyInputWrapper>
      </ReplyLayout>
    );
  }

export default ReplyList;

const ReplyLayout = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
`;

const Title = styled.div`
    align-self: stretch;
    color: #000;
    font-family: dongleRegular;
    font-size: 30px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`;

const Replies = styled.div`
  display: flex;
  flex-direction: column;
//   gap: 10px;
  width: 100%;
  align-items: flex-start;
`;

const EmptyText = styled.div`
    color: #767676;
    font-family: dongleRegular;
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;

    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    padding: 50px 0px;
`;

const ReplyInputWrapper = styled.div`
    width: 100%;
    margin-top: 4px;
`;