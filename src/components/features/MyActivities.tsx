import { useMemo, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { getMyClassList, type MyClassListResponse } from "@/api/class/myClassListAPI";
import { getMyOpenList } from "@/api/class/myOpenListAPI";
import { getMyReviewList, type MyReviewListResponse } from "@/api/user/myReviewListAPI";
import starOnIcon from "@/assets/icons/starOn.svg";
import starOffIcon from "@/assets/icons/starOff.svg";
import pencilIcon from "@/assets/icons/pencil.svg";
import { fetchMeetingDetail } from "@/api/meeting/meetingListApi";

const tabs = ["신청 내역", "개설 내역", "모임 후기 관리"] as const;
type TabType = (typeof tabs)[number];

const cardColors = ["#43D687", "#FFA3BD", "#59B6F8", "#FBBC04"];

interface ApplicationHistory {
  id: number;
  groupId: number;
  userId: number;
  userName: string;
  userNickname: string;
  createdAt: string;
}

interface CreationHistory {
  id: number;
  leaderId: number;
  leaderNickname: string;
  leaderName: string;
  title: string;
  category: string;
  capacity: number;
  meetingAt: string;
  location: string;
  state: string;
  participantCount: number;
  photos: { photoUrl: string; order: number }[];
}

interface ReviewHistory {
  id: number;
  groupId: number;
  userId: number;
  content: string;
  score: number;
  createdAt: string;
  meetingAt: string; // createdAt을 meetingAt으로 사용
  groupTitle: string;
  photos: { photoUrl: string; order: number }[];
}

function formatMeetingDate(dateInput: string | Date): string {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = date.getHours();
  const period = hours >= 12 ? "PM" : "AM";
  let hour12 = hours % 12;
  if (hour12 === 0) hour12 = 12;

  return `${year}.${month}.${day}(${hour12}${period})`;
}

function MyActivities() {
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState<TabType>("신청 내역");
  const [myClassList, setMyClassList] = useState<MyClassListResponse[]>([]);
  const [myOpenList, setMyOpenList] = useState<MyClassListResponse[]>([]);
  const [myReviewList, setMyReviewList] = useState<ReviewHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMyClassList = async () => {
      setIsLoading(true);
      try {
        const data = await getMyClassList();
        setMyClassList(data);
      } catch (error) {
        console.error("Failed to fetch my class list:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchMyOpenList = async () => {
      setIsLoading(true);
      try {
        const data = await getMyOpenList();
        setMyOpenList(data);
      } catch (error) {
        console.error("Failed to fetch my open list:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchMyReviewList = async () => {
      setIsLoading(true);
      try {
        // localStorage에서 userId 가져오기
        let userId = localStorage.getItem("userId");
        
        // test2 토큰 사용 중인지 확인
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken || !userId) {
          userId = "2"; // test2 계정 사용 중
        }
        
        if (!userId) {
          console.error("사용자 ID를 찾을 수 없습니다.");
          setMyReviewList([]);
          return;
        }

        const data = await getMyReviewList(Number(userId));
        // API 응답을 ReviewHistory 형식으로 변환
        const transformedData: ReviewHistory[] = data.map((review) => ({
          id: review.id,
          groupId: review.groupId,
          userId: review.userId,
          content: review.content,
          score: review.score,
          createdAt: review.createdAt,
          meetingAt: review.createdAt, // createdAt을 meetingAt으로 사용
          groupTitle: review.groupTitle,
          photos: review.photos,
        }));
        setMyReviewList(transformedData);
      } catch (error) {
        console.error("Failed to fetch my review list:", error);
        setMyReviewList([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedTab === "신청 내역") {
      fetchMyClassList();
    } else if (selectedTab === "개설 내역") {
      fetchMyOpenList();
    } else if (selectedTab === "모임 후기 관리") {
      fetchMyReviewList();
    }
  }, [selectedTab, location.pathname]); // location.pathname을 dependency에 추가하여 페이지 진입 시마다 API 호출

  const tabData = useMemo(() => {
    if (selectedTab === "신청 내역") return myClassList;
    if (selectedTab === "개설 내역") return myOpenList;
    if (selectedTab === "모임 후기 관리") return myReviewList;
    return [];
  }, [selectedTab, myClassList, myOpenList, myReviewList]);

  return (
    <Layout>
      <HeaderWrapper>
        <HeaderTitle>나의 모임 활동</HeaderTitle>
        <TabList>
          {tabs.map((tab) => (
            <TabButton
              key={tab}
              selected={tab === selectedTab}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </TabButton>
          ))}
        </TabList>
      </HeaderWrapper>

      <BodyWrapper>
        {isLoading ? (
          <EmptyState>로딩 중...</EmptyState>
        ) : tabData.length === 0 ? (
          <EmptyState>해당 내역이 아직 없어요</EmptyState>
        ) : (
          tabData.map((data, index) => (
            <ActivityCard
              key={`activity-${(data as { id: number }).id}`}
              tab={selectedTab}
              data={data}
              background={cardColors[index % cardColors.length]}
            />
          ))
        )}
      </BodyWrapper>
    </Layout>
  );
}

export default MyActivities;

type ActivityData = ApplicationHistory | CreationHistory | ReviewHistory | MyClassListResponse;

interface ActivityCardProps {
  tab: TabType;
  data: ActivityData;
  background: string;
}

function ActivityCard({ tab, data, background }: ActivityCardProps) {
  const navigate = useNavigate();
  
  const cardContent = useMemo(() => {
    if (tab === "신청 내역") {
      const item = data as MyClassListResponse;
      const statusText = item.state === "OPEN" ? "모집중" : "모임완료";
      return {
        id: item.id,
        statusText,
        title: item.title,
        meetingDate: formatMeetingDate(item.meetingAt),
        participantInfo: `${item.participantCount}/${item.capacity}`,
        leaderNickname: item.leaderNickname,
        location: item.location,
        category: item.category,
        state: item.state,
      };
    }

    if (tab === "개설 내역") {
      const item = data as MyClassListResponse;
      const statusText = item.state === "OPEN" ? "모집중" : "모임완료";
      return {
        id: item.id,
        statusText,
        title: item.title,
        meetingDate: formatMeetingDate(item.meetingAt),
        participantInfo: `${item.participantCount}/${item.capacity}`,
        leaderNickname: item.leaderNickname,
        location: item.location,
        category: item.category,
        state: item.state,
      };
    }

    // 리뷰 내역은 기존 형식 유지
    return null;
  }, [tab, data]);

  const handleReviewClick = () => {
    if (cardContent?.id) {
      navigate("/mypage/review", { state: { groupId: cardContent.id } });
    }
  };

  const handleInfoClick = async () => {
    if (!cardContent?.id) return;

    try {
      const meetingDetail = await fetchMeetingDetail(cardContent.id ?? 0);
      if (!meetingDetail) {
        console.error("모임 정보를 찾을 수 없습니다.");
        return;
      }

      const timeText = formatMeetingDate(meetingDetail.date);

      navigate(`/home/meeting-detail/${meetingDetail.id}`, {
        state: { meeting: meetingDetail, timeText },
      });
    } catch (error) {
      console.error("모임 정보 조회 실패:", error);
    }
  };

  const handleEditClick = (reviewId: number) => {
    navigate("/mypage/review/revise", { state: { reviewId } });
  };

  // 리뷰 내역인 경우 새로운 형식으로 표시
  if (tab === "모임 후기 관리") {
    const item = data as ReviewHistory;
    const photoUrl = item.photos && item.photos.length > 0 ? item.photos[0].photoUrl : null;

    return (
      <ReviewCardLayout backgroundColor={background}>
        <ReviewCardHeader>
          <ReviewCardTitle>{item.groupTitle}</ReviewCardTitle>
          <ReviewMeetingDate>{formatMeetingDate(item.meetingAt)}</ReviewMeetingDate>
        </ReviewCardHeader>
        <ReviewCardBody>
          {photoUrl && <ReviewPhoto src={photoUrl} alt="모임 사진" />}
          <ReviewContentWrapper>
            <StarRating>
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  src={star <= item.score ? starOnIcon : starOffIcon}
                  alt={star <= item.score ? "채워진 별" : "빈 별"}
                />
              ))}
            </StarRating>
            <ReviewText>{item.content}</ReviewText>
            <EditButton onClick={() => handleEditClick(item.id)}>
              <EditIcon src={pencilIcon} alt="수정" />
            </EditButton>
          </ReviewContentWrapper>
        </ReviewCardBody>
      </ReviewCardLayout>
    );
  }

  // 신청 내역 또는 개설 내역인 경우 새로운 형식으로 표시
  if (!cardContent) return null;

  return (
    <CardLayout backgroundColor={background}>
      <CardHeader>
        <StatusText>{cardContent.statusText}</StatusText>
        <CardTitleNew>{cardContent.title}</CardTitleNew>
        <MeetingDateText>{cardContent.meetingDate}</MeetingDateText>
      </CardHeader>
      <CardBody>
        <CardBodyContent>
          <FirstRow>
            <InfoItem isFirst>
              <InfoLabel>인원</InfoLabel>
              <Separator>|</Separator>
              <InfoValue>{cardContent.participantInfo}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>모임장</InfoLabel>
              <Separator>|</Separator>
              <InfoValue>{cardContent.leaderNickname}</InfoValue>
            </InfoItem>
          </FirstRow>
          <SecondRow>
            <InfoItem isFirst>
              <InfoLabel>장소</InfoLabel>
              <Separator>|</Separator>
              <InfoValue>{cardContent.location}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>모임종류</InfoLabel>
              <Separator>|</Separator>
              <InfoValue>{cardContent.category}</InfoValue>
            </InfoItem>
          </SecondRow>
          <ButtonRow isOpen={cardContent.state === "OPEN"}>
            <InfoButton
              isOpen={cardContent.state === "OPEN"}
              onClick={handleInfoClick}
            >
              모임 정보 확인
            </InfoButton>
            {cardContent.state !== "OPEN" && (
              <ReviewButton onClick={handleReviewClick}>후기 작성하기</ReviewButton>
            )}
          </ButtonRow>
        </CardBodyContent>
      </CardBody>
    </CardLayout>
  );
}

const Layout = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 16px;
  padding: 0px 16px;
  position: relative;
`;

const HeaderWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const HeaderTitle = styled.div`
  color: #000;
  font-family: dongleRegular;
  font-weight: 700;
  font-size: 30px;
`;

const TabList = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const TabButton = styled.button<{ selected?: boolean }>`
  display: flex;
  padding: 5px 14px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: none;
  background: ${({ selected }) => (selected ? "#43D687" : "#fff")};
  color: ${({ selected }) => (selected ? "#fff" : "#848484")};
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${({ selected }) =>
    selected ? "0px 0px 10px rgba(67, 214, 135, 0.35)" : "0 0 0 transparent"};
`;

const BodyWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const EmptyState = styled.div`
  width: 100%;
  padding: 48px 0;
  text-align: center;
  color: #5f5f5f;
  font-family: dongleRegular;
  font-size: 24px;
`;

const CardLayout = styled.div<{ backgroundColor: string }>`
  width: 100%;
  border-radius: 16px;
  background: ${({ backgroundColor }) => backgroundColor};
  box-shadow: 0px 0px 10px #0000001a;
  overflow: hidden;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: #ffffff;
  flex-wrap: wrap;
  gap: 8px;
`;

const StatusText = styled.div`
  color: #017F3B;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
`;

const CardTitleNew = styled.div`
  color: #000;
  font-family: dongleRegular;
  font-size: 22px;
  font-style: normal;
  font-weight: 700;
`;

const MeetingDateText = styled.div`
  color: #848484;
  font-family: Pretendard;
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
`;

const CardTitle = styled.div`
  color: #000;
  font-family: dongleBold;
  font-size: 26px;
`;

const CardSubInfo = styled.div`
  color: #848484;
  font-family: Pretendard;
  font-size: 12px;
  font-weight: 600;
`;

const CardBody = styled.div`
  padding: 0 20px;
`;

const CardBodyContent = styled.div`
  width: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`;

const FirstRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  width: 100%;
  flex-wrap: wrap;
`;

const SecondRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  width: 100%;
  margin-top: 7px;
  flex-wrap: wrap;
`;

const InfoItem = styled.div<{ isFirst?: boolean }>`
  display: flex;
  align-items: flex-start;
  flex: 1;
  min-width: 0;
  ${({ isFirst }) => isFirst && `
    min-width: 100px;
  `}
`;

const Separator = styled.div`
  margin-right: 10px;
  color: #404040;
  font-family: Pretendard;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
`;

const ButtonRow = styled.div<{ isOpen?: boolean }>`
  display: flex;
  flex-direction: ${({ isOpen }) => (isOpen ? "column" : "row")};
  gap: ${({ isOpen }) => (isOpen ? "0" : "8px")};
  width: 100%;
  margin-top: 15px;
`;

const InfoRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  width: 100%;
`;

const InfoLabel = styled.div`
  color: #404040;
  font-family: Pretendard;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
  margin-right: 10px;
`;

const InfoValue = styled.div`
  flex: 1;
  font-weight: 500;
  color: #000;
  font-family: Pretendard;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const InfoButton = styled.button<{ isOpen?: boolean }>`
  ${({ isOpen }) => 
    isOpen 
      ? `
        width: 100%;
        min-width: 0;
      `
      : `
        flex: 1;
        min-width: 0;
      `
  }
  height: 24px;
  flex-shrink: 0;
  border-radius: 8px;
  background: #D9D9D9;
  border: none;
  cursor: pointer;
  font-family: Pretendard;
  font-size: 12px;
  font-weight: 600;
  color: #000;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ReviewButton = styled.button`
  flex: 1;
  min-width: 0;
  height: 24px;
  flex-shrink: 0;
  border-radius: 8px;
  background: #088C45;
  border: none;
  cursor: pointer;
  font-family: Pretendard;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ReviewCardLayout = styled.div<{ backgroundColor: string }>`
  height: 199px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  border-radius: 8px;
  background: ${({ backgroundColor }) => backgroundColor};
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
`;

const ReviewCardHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ReviewCardTitle = styled.div`
  color: #fff;
  font-family: dongleRegular;
  font-size: 22px;
  font-style: normal;
  font-weight: 700;
`;

const ReviewMeetingDate = styled.div`
  color: #fff;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
`;

const ReviewCardBody = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 16px;
  flex: 1;
  position: relative;
`;

const ReviewPhoto = styled.img`
  width: 160px;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
`;

const ReviewContentWrapper = styled.div`
  width: 151px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
  position: relative;
`;

const StarRating = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
  align-items: center;
`;

const StarIcon = styled.img`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
`;

const ReviewText = styled.div`
  overflow: hidden;
  color: #fff;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  width: 100%;
  text-align: center;
`;

const EditButton = styled.button`
  position: absolute;
  right: 0;
  bottom: -100px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #CFFFE5;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  z-index: 10;
`;

const EditIcon = styled.img`
  width: 20px;
  height: 20px;
`;
