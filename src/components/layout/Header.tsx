import styled from 'styled-components';
import none from '../../assets/icons/alarmNone.png'
import one from '../../assets/icons/alarmOne.png'
import two from '../../assets/icons/alarmTwo.png'
import three from '../../assets/icons/alarmThree.png'
import more from '../../assets/icons/alarmMore.png'
import type { Member } from '@/types';
import { IoIosArrowBack } from "react-icons/io";

// TODO: subtitle이 소모임 일 때, 오른쪽에 시간 display 보이기 (어떻게 가져올 지 생각해보자)

interface HeaderProps {
    member?: Member;
    page?: string;
}

function Header({ member, page = 'home' }: HeaderProps = {}) {
    
    let text : string = '';

    // 알림 아이콘 설정
    const alarmValue = member?.alarm ?? 0;
    let alarmImgSrc = none;

    if ( alarmValue === 1 ) alarmImgSrc = one;
    else if ( alarmValue === 2 ) alarmImgSrc = two;
    else if ( alarmValue === 3 ) alarmImgSrc = three;
    else if ( alarmValue >= 4 ) alarmImgSrc = more;
    else alarmImgSrc = none;

    // subheader 타이틀 설정
    if (page === 'meeting-detail') {
        text = '소모임';
    } else if (page === 'create-meeting'){
        text = '모임 개설하기';
    } else {
        text = '사진 선택';
    }

    
    return(
        <Layout>
            <HeaderLayout>
                <Title>
                    <TitleLetter color='#FFF200'>모여봐요</TitleLetter>
                    <TitleLetter color='#FF2370'>사</TitleLetter>
                    <TitleLetter color='#0095FF'>자</TitleLetter>
                    <TitleLetter color='#FBBC04'>의</TitleLetter>
                    <TitleLetter color='#43D687'>숲</TitleLetter>
                </Title>
                <AlarmImg src={alarmImgSrc} />
            </HeaderLayout>
            {page !== 'home' &&
            <HeaderLayout> 
                <SubTitle>{text}</SubTitle>
            </HeaderLayout>
            }
        </Layout>
    )
}

export default Header;

const Layout = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    // padding-bottom: 12px;
    background: #E4F2EA;
    padding: 15px 16px;
`;

const HeaderLayout = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
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
    width: 23px;
`;

const SubTitle = styled.div`
    color: #000;
    font-family: dongleRegular;
    font-weight: 700;
    font-size: 30px;
    align-self: stretch;
`;