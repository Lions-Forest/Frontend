import React from 'react'
import styled from 'styled-components';
import alarmOne from '../../assets/icons/alarmOne.png'

function Header() {
    return(
        <HeaderLayout>
            <Title>
                <TitleLetter color='#FFF200'>모여봐요</TitleLetter>
                <TitleLetter color='#FF2370'>사</TitleLetter>
                <TitleLetter color='#0095FF'>자</TitleLetter>
                <TitleLetter color='#FBBC04'>의</TitleLetter>
                <TitleLetter color='#43D687'>숲</TitleLetter>
            </Title>
            <AlarmImg src={alarmOne} />
        </HeaderLayout>
    )
}

export default Header;

const HeaderLayout = styled.div`
    width: 100%;
    padding: 16px;
    display: flex;
    justify-content: space-between;
`;

const Title = styled.div`
    font-family: dongleBold;
    font-size: 36px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
    display: flex;
`;

const TitleLetter = styled.div`
    color: ${({ color }) => color};
    text-shadow: 0px 2px 3px #000000B2;
`;

const AlarmImg = styled.img`
    width: 28px;
    height: 31px;
`;