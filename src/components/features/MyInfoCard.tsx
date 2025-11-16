import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { getMyInfo, type MyInfoResponse } from "@/api/user/myInfoCheckAPI";
import { reviseMyInfo } from "@/api/user/myInfoReviseAPI";
import { getRandomNickname } from "@/api/user/randomNickAPI";
import cameraReviseIcon from "@/assets/icons/cameraRevise.svg";
import refreshNickNameIcon from "@/assets/icons/refreshNickName.svg";

function MyInfoCard() {
    const [myInfo, setMyInfo] = useState<MyInfoResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editNickname, setEditNickname] = useState("");
    const [editBio, setEditBio] = useState("");
    const [editProfilePhotoFile, setEditProfilePhotoFile] = useState<File | null>(null);
    const [editProfilePhotoPreview, setEditProfilePhotoPreview] = useState<string | null>(null);
    const [shouldRemovePhoto, setShouldRemovePhoto] = useState(false);
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
            setShouldRemovePhoto(false);
        }
    };

    const handleSaveClick = async () => {
        if (!myInfo) return;

        setIsLoading(true);
        try {
            // nickname, bio, removePhoto는 필수 입력
            // 수정사항이 없으면 기존 값 사용
            const requestData: {
                nickname: string;
                bio: string;
                removePhoto: boolean;
                photo?: File;
            } = {
                nickname: editNickname || myInfo.nickname || "",
                bio: editBio || myInfo.bio || "",
                removePhoto: shouldRemovePhoto ? true : false,
            };
            
            // photo 처리 (선택적)
            if (shouldRemovePhoto) {
                // removePhoto=true일 때는 photo를 보내지 않음
                // requestData.photo는 undefined로 유지
            } else if (editProfilePhotoFile) {
                // removePhoto=false이고 photo가 있으면 보낸 사진으로 수정
                requestData.photo = editProfilePhotoFile;
            }
            // removePhoto=false이고 photo가 없으면 기존 사진 유지 (photo 필드 자체를 보내지 않음)
            
            // requestData 로그 출력
            console.log("=== requestData 확인 ===");
            console.log("requestData:", requestData);
            console.log("requestData.nickname:", requestData.nickname);
            console.log("requestData.bio:", requestData.bio);
            console.log("requestData.removePhoto:", requestData.removePhoto, `(타입: ${typeof requestData.removePhoto})`);
            if (requestData.photo) {
                console.log("requestData.photo:", requestData.photo);
                console.log("requestData.photo 타입:", requestData.photo instanceof File ? "File" : typeof requestData.photo);
                console.log("requestData.photo.name:", requestData.photo.name);
                console.log("requestData.photo.size:", requestData.photo.size, "bytes");
                console.log("requestData.photo.type:", requestData.photo.type);
            } else {
                console.log("requestData.photo: 없음");
            }
            console.log("=======================");
            
            // 그냥 일반 객체로 보내기 (axios가 자동으로 처리)
            const response = await reviseMyInfo(requestData);
            
            // 성공 시 상태 업데이트
            setMyInfo(response);
            setIsEditMode(false);
            setEditProfilePhotoFile(null);
            setEditProfilePhotoPreview(response.profile_photo);
            setShouldRemovePhoto(false);
        } catch (error: any) {
            console.error("내 정보 수정 실패:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRandomNickname = async () => {
        try {
            const response = await getRandomNickname();
            setEditNickname(response.nickname);
        } catch (error) {
            console.error("랜덤 닉네임 생성 실패:", error);
        }
    };

    const handleImageClick = () => {
        if (isEditMode && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handlePhotoEditButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handlePhotoEditButtonContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // 프사 삭제 확인
        if (window.confirm("프로필 사진을 삭제하시겠습니까?")) {
            setEditProfilePhotoFile(null);
            setEditProfilePhotoPreview(null);
            setShouldRemovePhoto(true);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setEditProfilePhotoFile(file);
            setShouldRemovePhoto(false); // 새 파일이 선택되면 삭제 플래그 해제
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
                <UserImageWrapper>
                    <UserImage 
                        hasImage={!!(isEditMode ? editProfilePhotoPreview : (myInfo?.profile_photo && myInfo.profile_photo.trim() !== ""))}
                        isEditMode={isEditMode}
                    >
                        {(() => {
                            const imageSrc = isEditMode ? editProfilePhotoPreview : (myInfo?.profile_photo && myInfo.profile_photo.trim() !== "" ? myInfo.profile_photo : null);
                            return imageSrc ? (
                            <UserPlaceholder 
                                    src={imageSrc} 
                                alt="프로필 사진" 
                            />
                            ) : null;
                        })()}
                        <HiddenFileInput
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </UserImage>
                    {isEditMode && (
                        <PhotoEditButton 
                            onClick={handlePhotoEditButtonClick}
                            onContextMenu={handlePhotoEditButtonContextMenu}
                            title="클릭: 사진 변경, 우클릭: 사진 삭제"
                        >
                            <CameraIcon src={cameraReviseIcon} alt="프로필 사진 수정" />
                        </PhotoEditButton>
                    )}
                </UserImageWrapper>
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
                                    <RefreshIcon src={refreshNickNameIcon} alt="랜덤 닉네임 생성" />
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

const UserImageWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const UserImage = styled.div<{ hasImage?: boolean; isEditMode?: boolean }>`
  width: 78px;
  height: 78px;
  border-radius: 50%;
  border: 2px solid #017F3B;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ hasImage }) => (hasImage ? "transparent" : "#D9D9D9")};
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
  flex: 1 1 0;
  min-width: 0;
  width: 0;
  font-family: Pretendard;
  cursor: text;
  margin-right: 2px;
`;

const NicknameEditWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0;
  flex: 1;
  min-width: 0;
  max-width: 100%;
`;

const RandomButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  border-radius: 4px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-family: Pretendard;
  flex-shrink: 0;
`;

const RefreshIcon = styled.img`
  width: 16px;
  height: 16px;
  object-fit: contain;
`;

const PhotoEditButton = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #FBBC04;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.25));
  z-index: 10;
  padding: 0;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const CameraIcon = styled.img`
  width: 17px;
  height: 17px;
  object-fit: contain;
`;