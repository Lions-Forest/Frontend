import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { IoMdMap as Map } from "react-icons/io";
import { MdDiversity3 as Home } from "react-icons/md";
import { MdAccountCircle as My } from "react-icons/md";

const path = window.location.pathname;

function Footer() {
  // 홈/지도/마이페이지 라우팅을 위한 네비게이션 훅 정의_p.s. 정건(시작) //
  const navigate = useNavigate();
  const location = useLocation();
  
  // 현재 경로가 지도인지 확인
  const isMapActive = location.pathname.startsWith('/map');
  
  // 현재 경로가 홈인지 확인
  const isHomeActive = location.pathname.startsWith('/home');
  
  // 현재 경로가 마이페이지인지 확인
  const isMyPageActive = location.pathname.startsWith('/mypage');

  // 지도로 이동하는 핸들러
  const handleMapClick = () => {
    navigate('/map');
  };

  // 홈으로 이동하는 핸들러
  const handleHomeClick = () => {
    navigate('/home');
  };

  // 마이페이지로 이동하는 핸들러
  const handleMyPageClick = () => {
    navigate('/mypage');
  };
  // 홈/지도/마이페이지 라우팅을 위한 네비게이션 훅 정의_p.s. 정건(끝) //
  return (
    <FooterLayout>
      <Section onClick={handleMapClick}> {/*핸들러 추가 p.s. 정건(시작)*/}
        <MapIcon $active={isMapActive} /> {/* 브라우저로 판단 후 varient 적용 정건*/}
        <Title $active={isMapActive}>지도</Title> {/*핸들러 추가 p.s. 정건(끝)*/}
      </Section>
      <Section onClick={handleHomeClick}> {/*핸들러 추가 p.s. 정건(시작)*/}
        <HomeIcon $active={isHomeActive} /> {/* 브라우저로 판단 후 varient 적용 정건*/}
        <Title $active={isHomeActive}>홈</Title> {/*핸들러 추가 p.s. 정건(끝)*/}
      </Section>
      <Section onClick={handleMyPageClick}> {/*핸들러 추가 p.s. 정건(시작)*/}
        <MyIcon $active={isMyPageActive} /> {/* 브라우저로 판단 후 varient 적용 정건*/}
        <Title $active={isMyPageActive}>마이</Title> {/*핸들러 추가 p.s. 정건(끝)*/}
      </Section>
    </FooterLayout>
  );
}

export default Footer;

const FooterLayout = styled.div`
  width: 100%;
  height: 75px;
  max-width: 600px;
  background: #fff;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  padding: 15px 75px;
  gap: 88px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  justify-content: center;
  cursor: pointer; // p.s. 정건
`;

const MapIcon = styled(Map)<{ $active?: boolean }>` // 브라우저로 판단 후 varient 적용_p.s. 정건
  width: 24px;
  height: 24px;
  fill: ${({ $active }) => ($active ? '#43D687' : '#1c1b1f66')}; // 브라우저로 판단 후 varient 적용_p.s. 정건
  opacity: ${({ $active }) => ($active ? '100%' : '40%')}; // 브라우저로 판단 후 varient 적용_p.s. 정건
`;

const HomeIcon = styled(Home)<{ $active?: boolean }>` // 브라우저로 판단 후 varient 적용_p.s. 정건
  width: 24px;
  height: 24px;
  fill: ${({ $active }) => ($active ? '#43D687' : '#1c1b1f66')}; // 브라우저로 판단 후 varient 적용_p.s. 정건
  opacity: ${({ $active }) => ($active ? '100%' : '40%')}; // 브라우저로 판단 후 varient 적용_p.s. 정건
`;

const MyIcon = styled(My)<{ $active?: boolean }>` // 브라우저로 판단 후 varient 적용_p.s. 정건
  width: 24px;
  height: 24px;
  fill: ${({ $active }) => ($active ? '#43D687' : '#1c1b1f66')}; // 브라우저로 판단 후 varient 적용_p.s. 정건
  opacity: ${({ $active }) => ($active ? '100%' : '40%')}; // 브라우저로 판단 후 varient 적용_p.s. 정건
`;

const Title = styled.div<{ $active?: boolean }>`
  color: ${({ $active }) => ($active ? '#43D687' : '#848484')};
  text-align: center;

  /* Body2/12 */
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  align-self: stretch;
`;
