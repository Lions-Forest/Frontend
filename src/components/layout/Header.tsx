import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import none from '../../assets/icons/alarmNone.png'
import one from '../../assets/icons/alarmOne.png'
import two from '../../assets/icons/alarmTwo.png'
import three from '../../assets/icons/alarmThree.png'
import more from '../../assets/icons/alarmMore.png'
import type { Member } from '@/types';
import { useEffect, useState } from 'react';
import { getNotificationNumber } from '@/api/notification/numberAPI';
import logoutIcon from '@/assets/icons/log-out.svg';
import { performLogout } from '@/utils/logout';

interface HeaderProps {
    member?: Member;
    page?: string;
}

function Header({ page = 'home' }: HeaderProps = {}) {
    const navigate = useNavigate();
    
    const [notification, setNotification] = useState(0);
    let userId = localStorage.getItem("userId");

    // 나의 알림 개수 가져오기
    useEffect(() => {
        const fetchNotification = async() => {
        try {
            const notification = await getNotificationNumber(Number(userId));
            console.log("알림 개수: ", notification);
            setNotification(notification);
        } catch (error) {
            console.error("데이터 로딩 실패: ", error);
            setNotification(0);
        }
        };
        fetchNotification();
    }, []);
    

    // 알림 아이콘 설정
    let alarmImgSrc = none;

    if ( notification === 1 ) alarmImgSrc = one;
    else if ( notification === 2 ) alarmImgSrc = two;
    else if ( notification === 3 ) alarmImgSrc = three;
    else if ( notification >= 4 ) alarmImgSrc = more;
    else alarmImgSrc = none;

    const isMyPage = page === 'mypage';

    const handleLogoClick = () => {
        navigate('/home');
    };

    const handleLogoutClick = async () => {
        if (!window.confirm("로그아웃하시겠습니까?")) {
            return;
        }

        try {
            await performLogout();
            navigate("/", { replace: true });
        } catch (error) {
            console.error("로그아웃 실패:", error);
        }
    };

    // 알림 아이콘 클릭 핸들러(알림 페이지 이동)_p.s. 정건
    const handleAlarmClick = () => {
        navigate('/notification');
    };

    return(
        <Layout>
            <HeaderLayout>
                <TitleButton type="button" onClick={handleLogoClick} aria-label="홈으로 이동">
                    <TitleLetter color='#FFF200'>모여봐요</TitleLetter>
                    <TitleLetter color='#FF2370'>사</TitleLetter>
                    <TitleLetter color='#0095FF'>자</TitleLetter>
                    <TitleLetter color='#FBBC04'>의</TitleLetter>
                    <TitleLetter color='#43D687'>숲</TitleLetter>
                </TitleButton>
                <RightActions>
                    {isMyPage && (
                        <IconButton type="button" onClick={handleLogoutClick} aria-label="로그아웃">
                            <LogoutImg src={logoutIcon} alt="로그아웃" />
                        </IconButton>
                    )}
                    <IconButton type="button" onClick={handleAlarmClick} aria-label="알림">
                        <AlarmImg src={alarmImgSrc} alt="알림" />
                    </IconButton>
                </RightActions>
            </HeaderLayout>
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

const RightActions = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const IconButton = styled.button`
    border: none;
    background: transparent;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
`;

const TitleButton = styled.button`
    border: none;
    background: transparent;
    padding: 0;
    cursor: pointer;
    display: flex;
    font-family: dongleBold;
    font-size: 36px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
`;

const TitleLetter = styled.div`
    color: ${({ color }) => color};
    text-shadow: 0px 2px 3px #000000B2;
`;

const AlarmImg = styled.img`
    width: 23px;
`;

const LogoutImg = styled.img`
    width: 24px;
`;
