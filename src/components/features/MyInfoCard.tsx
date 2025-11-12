import styled from "styled-components";

function MyInfoCard() {
    return(
        
        <Layout> {/* Layout 컴포넌트 아님 */}
            <HeaderWrapper>
                <HeaderTitle>내 정보</HeaderTitle>
                <HeaderButton>수정하기</HeaderButton>
            </HeaderWrapper>

            <BodyWrapper>
                <UserImage>
                    <UserPlaceholder src={'x'} /> {/*임시*/}
                </UserImage>
                <UserDetails>
                    <UserName>이름</UserName>
                    <UserNickName>닉네임</UserNickName>
                    <UserIntro>한 줄 소개</UserIntro>
                </UserDetails>
            </BodyWrapper>
        </Layout>
    )
}
export default MyInfoCard;

const Layout = styled.div`
    width: 100%;
    //background: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 8px;
    padding: 16px 8px;
    position: relative;
`;

const HeaderWrapper = styled.div`
    width: 100%;
    align-self: stretch;
    margin-bottom: 10px;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;
const HeaderTitle = styled.div`
    color: #000;
    font-family: dongleRegular;
    font-weight: 700;
    font-size: 30px;
    align-self: stretch;
    margin-bottom: 8px;
`;
const HeaderButton = styled.button`
    color: #ffffff;
    background: #9F9F9F;
    //font-family: dongleRegular;
    width: 78px;
    height: 22px;
    border-radius: 50px;
    font-weight: 600;
    font-size: 12px;
    //padding: 4px 8px;

    border: none;
`;

const BodyWrapper = styled.div`
    width: 100%;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    //align-items: center;
`;

const UserImage = styled.div`
  width: 78px;
  height: 78px;
  border-radius: 50%;
  border: 2px solid #017F3B;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const UserPlaceholder = styled.img`
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #999;
`;

const UserDetails = styled.div`
  max-width: 267px;
  display: flex;
  flex-direction: column;
//  margin-left: 16px;
  font-size: 14px;
  gap: 20px;
  flex: 1;
  color: #000;
`;

const UserName = styled.div`
  font-weight: 700;
`;

const UserNickName = styled.div`
  font-weight: 700;
  display: flex; // 임시
`;
const UserIntro = styled.div`
  font-weight: 700;
`;