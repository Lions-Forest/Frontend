import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { getMyInfo, type MyInfoResponse } from "@/api/user/myInfoCheckAPI";
import { reviseMyInfo } from "@/api/user/myInfoReviseAPI";

// 랜덤 닉네임 생성용 데이터
const adjectives = ["귀여운", "멋진", "똑똑한", "용감한", "친절한"];
const animals = ["사자", "호랑이", "곰", "토끼", "펭귄"];

function generateRandomNickname(): string {
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
    return `${randomAdjective} ${randomAnimal}`;
}

function MyInfoCard() {
    const [myInfo, setMyInfo] = useState<MyInfoResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editNickname, setEditNickname] = useState("");
    const [editBio, setEditBio] = useState("");
    const [editProfilePhotoFile, setEditProfilePhotoFile] = useState<File | null>(null);
    const [editProfilePhotoPreview, setEditProfilePhotoPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const nicknameInputRef = useRef<HTMLInputElement>(null);
    const bioInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchMyInfo = async () => {
            setIsLoading(true);
            try {
                const data = await getMyInfo();
                setMyInfo(data);
                setEditNickname(data.nickname || "");
                setEditBio(data.bio || "");
                setEditProfilePhotoPreview(data.profile_photo);
                setEditProfilePhotoFile(null);
            } catch (error) {
                console.error("Failed to fetch my info:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyInfo();
    }, []);

    const handleEditClick = () => {
        setIsEditMode(true);
        if (myInfo) {
            setEditNickname(myInfo.nickname || "");
            setEditBio(myInfo.bio || "");
            setEditProfilePhotoPreview(myInfo.profile_photo);
            setEditProfilePhotoFile(null);
        }
    };

    const handleSaveClick = async () => {
        if (!myInfo) return;

        setIsLoading(true);
        try {
            // 항상 FormData로 전송
            const formData = new FormData();
            formData.append("nickname", editNickname || "");
            formData.append("bio", editBio || "");
            
            // 파일이 있으면 파일을, 없으면 빈 Blob을 추가
            if (editProfilePhotoFile) {
                formData.append("profile_photo", editProfilePhotoFile);
            } else {
                // 파일이 없을 때 빈 Blob 추가
                formData.append("profile_photo", new Blob());
            }
            
            // 디버깅: FormData 내용 확인
            console.log("FormData contents:");
            for (const [key, value] of formData.entries()) {
                if (value instanceof File) {
                    console.log(`${key}:`, value.name, value.type, value.size);
                } else {
                    console.log(`${key}:`, value);
                }
            }
            
            const response = await reviseMyInfo(formData);

            setMyInfo(response);
            setIsEditMode(false);
            // 페이지 재렌더링을 위해 정보 다시 불러오기
            const refreshedData = await getMyInfo();
            setMyInfo(refreshedData);
            setEditProfilePhotoFile(null);
            setEditProfilePhotoPreview(refreshedData.profile_photo);
        } catch (error: any) {
            console.error("Failed to revise my info:", error);
            if (error.response) {
                console.error("Error response:", error.response.data);
                console.error("Error status:", error.response.status);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleRandomNickname = () => {
        setEditNickname(generateRandomNickname());
    };

    const handleImageClick = () => {
        if (isEditMode && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setEditProfilePhotoFile(file);
            // 미리보기를 위해 Base64로 변환
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditProfilePhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (isEditMode) {
            // 수정 모드로 전환되면 자동으로 닉네임 input에 포커스
            setTimeout(() => {
                nicknameInputRef.current?.focus();
            }, 0);
        }
    }, [isEditMode]);

    return(
        
        <Layout> {/* Layout 컴포넌트 아님 */}
            <HeaderWrapper>
                <HeaderTitle>내 정보</HeaderTitle>
                <HeaderButton 
                    isEditMode={isEditMode}
                    onClick={isEditMode ? handleSaveClick : handleEditClick}
                >
                    {isEditMode ? "저장하기" : "수정하기"}
                </HeaderButton>
            </HeaderWrapper>

            <BodyWrapper>
                <UserImage 
                    hasImage={!!(isEditMode ? editProfilePhotoPreview : myInfo?.profile_photo)}
                    isEditMode={isEditMode}
                    onClick={handleImageClick}
                >
                    {(isEditMode ? editProfilePhotoPreview : myInfo?.profile_photo) ? (
                        <UserPlaceholder 
                            src={(isEditMode ? editProfilePhotoPreview : myInfo?.profile_photo) || ""} 
                            alt="프로필 사진" 
                        />
                    ) : null}
                    <HiddenFileInput
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </UserImage>
                <UserDetails>
                    <UserInfoItem>
                        <UserInfoLabel>이름</UserInfoLabel>
                        <UserInfoValue>{myInfo?.name || "-"}</UserInfoValue>
                    </UserInfoItem>
                    <UserInfoItem>
                        <UserInfoLabel>닉네임</UserInfoLabel>
                        {isEditMode ? (
                            <NicknameEditWrapper>
                                <InvisibleInput
                                    ref={nicknameInputRef}
                                    value={editNickname}
                                    onChange={(e) => setEditNickname(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <RandomButton onClick={handleRandomNickname}>
                                    랜덤 생성
                                </RandomButton>
                            </NicknameEditWrapper>
                        ) : (
                            <UserInfoValue>{myInfo?.nickname || "-"}</UserInfoValue>
                        )}
                    </UserInfoItem>
                    <UserInfoItem isBio>
                        <UserInfoLabel isBio>한 줄 소개</UserInfoLabel>
                        {isEditMode ? (
                            <InvisibleInput
                                ref={bioInputRef}
                                value={editBio}
                                onChange={(e) => setEditBio(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        ) : (
                            <UserInfoValue>{myInfo?.bio || "-"}</UserInfoValue>
                        )}
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
const HeaderButton = styled.button<{ isEditMode?: boolean }>`
    color: #ffffff;
    background: ${({ isEditMode }) => (isEditMode ? "#FBBC04" : "#9F9F9F")};
    //font-family: dongleRegular;
    width: 78px;
    height: 22px;
    border-radius: 50px;
    font-weight: 600;
    font-size: 12px;
    //padding: 4px 8px;
    cursor: pointer;
    border: none;
`;

const BodyWrapper = styled.div`
    width: 100%;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    //align-items: center;
`;

const UserImage = styled.div<{ hasImage?: boolean; isEditMode?: boolean }>`
  width: 78px;
  height: 78px;
  border-radius: 50%;
  border: 2px solid #017F3B;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${({ hasImage }) => (hasImage ? "transparent" : "#D9D9D9")};
  cursor: ${({ isEditMode }) => (isEditMode ? "pointer" : "default")};
  position: relative;
  overflow: hidden;
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
  min-width: 0;
  width: 100%;
`;

const UserInfoLabel = styled.div<{ isBio?: boolean }>`
  font-weight: 700;
  color: #000;
  flex-shrink: 0;
//  width: ${({ isBio }) => (isBio ? "82px" : "82px")};
  width: 82px;
`;

const UserInfoValue = styled.div`
  font-weight: 400;
  color: #000;
`;

const EditableValue = styled.div<{ isEditMode?: boolean }>`
  font-weight: 400;
  color: #000;
  cursor: ${({ isEditMode }) => (isEditMode ? "pointer" : "default")};
  padding: 2px 4px;
  border-radius: 4px;
  transition: background-color 0.2s;

  ${({ isEditMode }) =>
    isEditMode &&
    `
    &:hover {
      background-color: #f0f0f0;
    }
  `}
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const UserInfoInput = styled.input`
  font-weight: 400;
  color: #000;
  font-size: 14px;
  border: 1px solid #D9D9D9;
  border-radius: 4px;
  padding: 4px 8px;
  outline: none;
  flex: 1;
  font-family: Pretendard;

  &:focus {
    border-color: #017F3B;
  }
`;

const InvisibleInput = styled.input`
  font-weight: 400;
  color: #000;
  font-size: 14px;
  border: none;
  background: transparent;
  outline: none;
  flex: 1;
//  min-width: 0;
  max-width: 64px;
  font-family: Pretendard;
  cursor: text;
`;

const NicknameEditWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
//  gap: 10px;
  flex: 1;
  min-width: 0;
  max-width: 100%;
`;

const RandomButton = styled.button`
  background: #017F3B;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  font-family: Pretendard;
  white-space: nowrap;
`;