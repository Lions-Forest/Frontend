import React from "react";
import Arrow from "../../assets/images/arrow.png"
import styled from "styled-components";

interface CircleArrowProps {
    direction?: 'left' | 'right';
    onClick?: () => void;
}
  
function CircleArrow({ direction = 'left', onClick }: CircleArrowProps) {
    return(
        <Circle onClick={onClick}>
            <ArrowIcon src={Arrow} direction={direction}/>
        </Circle>
    )
}

export default CircleArrow;

const Circle = styled.div`
    width: 24px;
    height: 24px;
    drop-shadow: 0px 0px 4px  #00000040;
    background: #FFF371;
    border-radius: 100%;

    display: flex;
    align-items: center;
    padding-left: 8px;
`;

const ArrowIcon = styled.img<{ direction?: string }>`
  width: 8px;
  height: 14px;
  transition: transform 0.2s;
  transform: ${({ direction }) => direction === 'right' ? 'rotate(180deg)' : 'none'};
`;