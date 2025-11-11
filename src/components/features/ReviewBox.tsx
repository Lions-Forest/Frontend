import type { Review } from '@/types';
import React from 'react'
import styled from 'styled-components';

function ReviewBox({ review }: { review: Review }){
  return (
    <BoxLayout>
        <Header></Header>
    </BoxLayout>
  )
}

export default ReviewBox;

const BoxLayout = styled.div`
    width: 361px;
    height: 471px;
    flex-shrink: 0;
    border-radius: 8px;
    background: #FFF;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.10);
`;

const Header = styled.div`
    width: 100%;
    height: 43px;
    flex-shrink: 0;
    border-radius: 8px 8px 0 0;
    background: #43D687;

    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 20px;

    color: #000;
    font-family: dongle;
    font-size: 22px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
`;

const HeaderBtn = styled.div``;

const SubHeader = styled.div`

`;

const 