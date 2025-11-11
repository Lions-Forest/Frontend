import styled from "styled-components";

function MyActivities() {
    return(
        <Layout>
            <HeaderWrapper>
                <HeaderTitle>나의 모임 활동</HeaderTitle>
            </HeaderWrapper>

            <BodyWrapper>
                <UserImage>
                    <UserPlaceholder src={'x'} /> {/*임시*/}
                </UserImage>
                <UserDetails>
                    <UserName>이름</UserName>
                    <UserNickName>닉네임 <p style={{height: '46px'}}>tem</p></UserNickName>
                    <UserIntro>한 줄 소개</UserIntro>
                </UserDetails>
            </BodyWrapper>
        </Layout>
    )
}
export default MyActivities;

const Layout = styled.div`
    width: 100%;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 8px;
    padding: 16px 16px 27px 16px;
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
//  max-width: 267px;
  display: flex;
  flex-direction: column;
  margin-left: 16px;
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