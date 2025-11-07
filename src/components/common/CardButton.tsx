import React from 'react'
import styled from 'styled-components'

// state: 
interface ButtonProps { 
    state: string;
    text?: string;
}

const CardButton = (state: ButtonProps) => {

  if (state === 'save') text = '저장하기'    
  return (
    <BtnLayout>{text}</BtnLayout>
  )
}

export default CardButton

const BtnLayout = styled.div`
    width: 360;
    height: 42;
    top: 20px;
    left: 20px;
    angle: 0 deg;
    opacity: 1;

    font-family: Pretendard;
    font-weight: 600;
    font-style: SemiBold;
    font-size: 16px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
`;

