import type { Review } from "@/types";
import React from "react";
import styled from "styled-components";
import { HiOutlineStar as FullStar} from "react-icons/hi";
import { HiStar as EmptyStar} from "react-icons/hi";
import { HiOutlineStar as Star} from "react-icons/hi";

const MAX_STARS = 5;

function ScoreNav({ review }: { review: Review }){
  return (
    <StarSection>
        {[...Array(MAX_STARS)].map((_, i) =>
            i < review.starNumber ? (
                <StyledStar key={i} filled />
            ) : (
                <StyledStar key={i} />
            )
        )}
    </StarSection>
  )
}

export default ScoreNav

const StarSection = styled.div`
  width: 100%;
  height: 13px;
  // flex-shrink: 0;
  gap: 0px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const StyledStar = styled(Star)<{ filled?: boolean }>`
  font-size: 15px;
  vertical-align: middle;
  fill: ${({ filled }) => (filled ? "#FEFF00" : "none")};
  color: ${({ filled }) => (filled ? "transparent" : " #808080")};
  filter: ${({ filled }) => (filled ? "drop-shadow(0px 0px 2px #000000B2)" : "")};
  margin-right: 1.5px;
`;