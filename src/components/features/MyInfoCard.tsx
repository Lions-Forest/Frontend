import { useEffect, useState } from "react";
import styled from "styled-components";
import { getMyInfo, type MyInfoResponse } from "@/api/user/myInfoCheckAPI";

function MyInfoCard() {
    const [myInfo, setMyInfo] = useState<MyInfoResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchMyInfo = async () => {
            setIsLoading(true);
            try {
                const data = await getMyInfo();
                setMyInfo(data);
            } catch (error) {
                console.error("Failed to fetch my info:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyInfo();
    }, []);

    return(
        
        <Layout> {/* Layout 컴포넌트 아님 */}
            <HeaderWrapper>
                <HeaderTitle>내 정보</HeaderTitle>
                <HeaderButton>수정하기</HeaderButton>
            </HeaderWrapper>

            <BodyWrapper>
                <UserImage hasImage={!!myInfo?.profile_photo}>
                    {myInfo?.profile_photo ? (
                        <UserPlaceholder src={myInfo.profile_photo} alt="프로필 사진" />
                    ) : null}
                </UserImage>
                <UserDetails>
                    <UserInfoItem>
                        <UserInfoLabel>이름</UserInfoLabel>
                        <UserInfoValue>{myInfo?.name || "-"}</UserInfoValue>
                    </UserInfoItem>
                    <UserInfoItem>
                        <UserInfoLabel>닉네임</UserInfoLabel>
                        <UserInfoValue>{myInfo?.nickname || "-"}</UserInfoValue>
                    </UserInfoItem>
                    <UserInfoItem isBio>
                        <UserInfoLabel isBio>한 줄 소개</UserInfoLabel>
                        <UserInfoValue>{myInfo?.bio || "-"}</UserInfoValue>
                    </UserInfoItem>
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

const UserImage = styled.div<{ hasImage?: boolean }>`
  width: 78px;
  height: 78px;
  border-radius: 50%;
  border: 2px solid #017F3B;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${({ hasImage }) => (hasImage ? "transparent" : "#D9D9D9")};
`;

const UserPlaceholder = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
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

const UserInfoItem = styled.div<{ isBio?: boolean }>`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
`;

const UserInfoLabel = styled.div<{ isBio?: boolean }>`
  font-weight: 700;
  color: #000;
  flex-shrink: 0;
  width: ${({ isBio }) => (isBio ? "104px" : "80px")};
`;

const UserInfoValue = styled.div`
  font-weight: 400;
  color: #000;
`;