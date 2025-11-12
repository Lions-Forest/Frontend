import React from "react";
import Arrow from "../../assets/images/arrow.png"
import styled from "styled-components";

interface CircleArrowProps {
    direction?: 'left' | 'right';
}

function CircleArrow({ direction = 'left' }: CircleArrowProps) {
    return(
        <Circle>
            <ArrowIcon src={Arrow} direction={direction}/>
        </Circle>
    )
}

export default CircleArrow;

const Circle = styled.div`
width: 24.000001907348725;
height: 23.999998092651456;
angle: 180 deg;
opacity: 1;
drop-shadow: 0px 0px 4px  #00000040;
`;

const ArrowIcon = styled.img<{ direction?: string }>`
  width: 14px;
  height: 8px;
  transition: transform 0.2s;
  transform: ${({ direction }) => direction === 'right' ? 'rotate(180deg)' : 'none'};
`;