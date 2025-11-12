import type { Review } from "@/types";
import React from "react";
import styled from "styled-components";
import { HiOutlineStar as FullStar} from "react-icons/hi";
import { HiStar as EmptyStar} from "react-icons/hi";

const MAX_STARS = 5;

function ReviewCard({ review }: { review: Review }){
    return(
        <CardLayout>
            <Header>
            <ProfileImg src={review.writer.photoUrl || ""} />
                <ProfileName>{review.writer.nickname || review.writer.name}</ProfileName>
            </Header>
            <CardPhoto src={review.photoUrl}/>
            <StarSection>
            {[...Array(MAX_STARS)].map((_, i) =>
                i < review.starNumber ? (
                    <StyledStar as={FullStar} key={i} filled />
                ) : (
                    <StyledStar as={EmptyStar} key={i} />
                )
            )}
            </StarSection>
            <CardDetail>{review.detail}</CardDetail>
        </CardLayout>
    )
}

export default ReviewCard;

const CardLayout = styled.div`
    width: 80px;
    height: 142px;
    flex-shrink: 0;
    border-radius: 7px;
    background: #FFFFFF;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 4px;
    gap: 4px;
`;

const ProfileImg = styled.img`
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    background: #D9D9D9;
    border-radius: 100%;
`;

const ProfileName = styled.div`
    display: -webkit-box;
    width: 51px;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    color: #000;
    text-overflow: ellipsis;
    font-family: Pretendard;
    font-size: 10px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
`;

const CardPhoto = styled.img`
    width: 80px;
    height: 79px;
    flex-shrink: 0;
    background: #848484;
    padding: 4px 0px;
`;

const StarSection = styled.div`
    width: 64.753px;
    height: 13px;
    flex-shrink: 0;
`;

// Styled
const StyledStar = styled.span<{ filled?: boolean }>`
  font-size: 15px;
  vertical-align: middle;
  color: ${({ filled }) => (filled ? "#FEFF00" : "#848484")};
  filter: ${({ filled }) =>
    filled
      ? "drop-shadow(0px 0px 2px #000000B2)"
      : ""};
  margin-right: 1.5px;
`;

const CardDetail = styled.div`
    display: -webkit-box;
    width: 73px;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    color: #000;
    text-align: center;
    text-overflow: ellipsis;
    font-family: Pretendard;
    font-size: 8px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
`;