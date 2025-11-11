import type { Review } from "@/types";
import React from "react";
import styled from "styled-components";
import { HiOutlineStar as FullStar} from "react-icons/hi";
import { HiStar as EmptyStar} from "react-icons/hi";

const MAX_STARS = 5;

function ScoreNav({ review }: { review: Review }){
  return (
    <StarSection>
        {[...Array(MAX_STARS)].map((_, i) =>
            i < review.starNumber ? (
                <StyledStar as={FullStar} key={i} filled />
            ) : (
                <StyledStar as={EmptyStar} key={i} />
            )
        )}
    </StarSection>
  )
}

export default ScoreNav

const StarSection = styled.div`
    width: 64.753px;
    height: 13px;
    flex-shrink: 0;
`;

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