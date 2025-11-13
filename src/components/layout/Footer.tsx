import styled from "styled-components";
import { IoMdMap as Map } from "react-icons/io";
import { MdDiversity3 as Home } from "react-icons/md";
import { MdAccountCircle as My } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const path = window.location.pathname;

function Footer() {
  const navigate = useNavigate();
  const handleFooterClick = (text : string) => {
    if (text === '마이') navigate('/mypage');
    else if (text === '지도') navigate('/home/map');
    else navigate('/home');
  }
  return (
    <FooterLayout>
      <Section onClick={() => handleFooterClick('지도')}>
        <MapIcon highlight={path === "/map"} />
        <Title highlight={path === "/map"}>지도</Title>
      </Section>
      <Section onClick={() => handleFooterClick('홈')}>
        <HomeIcon highlight={path === "/home"} />
        <Title highlight={path === "/home"}>홈</Title>
      </Section>
      <Section onClick={() => handleFooterClick('마이')}>
        <MyIcon highlight={path === "/mypage"} />
        <Title highlight={path === "/mypage"}>마이</Title>
      </Section>
    </FooterLayout>
  );
}

export default Footer;

const FooterLayout = styled.div`
  width: 100%;
  height: 75px;
  flex-shrink: 0;
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
`;

interface HighlightProps {
  highlight?: boolean;
}

const MapIcon = styled(Map)<HighlightProps>`
  width: 24px;
  height: 24px;
  opacity: ${({ highlight }) => (highlight ? "1" : "0.4")};
  fill: ${({ highlight }) => highlight ? "#43D687" : "#1c1b1f66"};
`;

const HomeIcon = styled(Home)<HighlightProps>`
  width: 24px;
  height: 24px;
  opacity: ${({ highlight }) => (highlight ? "1" : "0.4")};
  fill: ${({ highlight }) => highlight ? "#43D687" : "#1c1b1f66"};
`;

const MyIcon = styled(My)<HighlightProps>`
  width: 24px;
  height: 24px;
  opacity: ${({ highlight }) => (highlight ? "1" : "0.4")};
  fill: ${({ highlight }) => highlight ? "#43D687" : "#1c1b1f66"};
`;

const Title = styled.div<HighlightProps>`
  color: ${({ highlight }) => highlight ? "#43D687" : "#848484"};
  text-align: center;

  /* Body2/12 */
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  align-self: stretch;
`;
