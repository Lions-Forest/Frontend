import React from "react";
import styled from "styled-components";
import ReviewCard from "./ReviewCard";
import type { Review } from "@/types";
import CircleArrow from "../common/CircleArrow";

interface ReviewListProps {
    reviews: Review[];
    onPrev?: () => void;
    onNext?: () => void;
}

function ReviewList({ reviews, onPrev, onNext }: ReviewListProps) {
    return (
        <ReviewLayout>
          <ReviewTitle>모임 후기</ReviewTitle>
          <ListLayout>
            <ArrowWrapperLeft onClick={onPrev}>
              <CircleArrow direction="left" />
            </ArrowWrapperLeft>
            <CardSection>
              {reviews.map(review => (
                <ReviewCard key={review.meeting.id + "-" + review.writer.id} review={review} />
              ))}
            </CardSection>
            <ArrowWrapperRight onClick={onNext}>
              <CircleArrow direction="right" />
            </ArrowWrapperRight>
          </ListLayout>
        </ReviewLayout>
    )
}

export default ReviewList;

const ReviewLayout = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
`;

const ReviewTitle = styled.div`
    color: #000;
    font-family: dongleRegular;
    font-size: 30px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`;

const ListLayout = styled.div`
    display: flex;
    width: 345px;
    height: 160px;
    padding: 8px 4px;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    flex-shrink: 0;
    margin: 2px 8px 16px 8px;
    position: relative;

    border-radius: 8px;
    background: #FFFAE4;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.10);
`;

const CardSection = styled.div`
    display: flex;
    gap: 5px;
    overflow-x: auto;
    align-items: stretch;
`;

const ArrowWrapperLeft = styled.div`
  position: relative;
  margin-right: 4px;
  z-index: 2;
  cursor: pointer;
`;

const ArrowWrapperRight = styled.div`
  position: relative;
  margin-left: 4px;
  z-index: 2;
  cursor: pointer;
`;