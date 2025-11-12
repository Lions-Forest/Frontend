import styled from "styled-components";
import { IoMdMap as Map } from "react-icons/io";
import { MdDiversity3 as Home } from "react-icons/md";
import { MdAccountCircle as My } from "react-icons/md";

function Footer() {
  return (
    <FooterLayout>
      <Section>
        <MapIcon />
        <Title>지도</Title>
      </Section>
      <Section>
        <HomeIcon />
        <Title>홈</Title>
      </Section>
      <Section>
        <MyIcon />
        <Title>마이</Title>
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

const MapIcon = styled(Map)`
  width: 24px;
  height: 24px;
  fill: #1c1b1f66;
  opacity: 40%;
  // fill: ${({ color }) =>
    color}; // TODO: 페이지 따라서 onClick 기능 + 색 변화 구현
`;

const HomeIcon = styled(Home)`
  width: 24px;
  height: 24px;
  fill: #1c1b1f66;
  opacity: 40%;
  // fill: ${({ color }) =>
    color}; // TODO: 페이지 따라서 onClick 기능 + 색 변화 구현
`;

const MyIcon = styled(My)`
  width: 24px;
  height: 24px;
  fill: #1c1b1f66;
  opacity: 40%;
  // fill: ${({ color }) =>
    color}; // TODO: 페이지 따라서 onClick 기능 + 색 변화 구현
`;

const Title = styled.div`
  color: #848484;
  text-align: center;

  /* Body2/12 */
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  align-self: stretch;
`;
