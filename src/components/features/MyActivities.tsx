import { useMemo, useState } from "react";
import styled from "styled-components";

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
  photos: { photoUrl: string; order: number }[];
}

const applicationDummy: ApplicationHistory[] = [
  {
    id: 1,
    groupId: 101,
    userId: 10,
    userName: "홍길동",
    userNickname: "맛집탐험가",
    createdAt: "2025-11-10T09:03:11.553Z",
  },
  {
    id: 2,
    groupId: 205,
    userId: 10,
    userName: "홍길동",
    userNickname: "맛집탐험가",
    createdAt: "2025-11-11T11:23:45.553Z",
  },
  {
    id: 3,
    groupId: 301,
    userId: 10,
    userName: "홍길동",
    userNickname: "맛집탐험가",
    createdAt: "2025-11-12T09:03:11.553Z",
  },
  {
    id: 4,
    groupId: 405,
    userId: 10,
    userName: "홍길동",
    userNickname: "맛집탐험가",
    createdAt: "2025-11-12T15:45:23.553Z",
  },
  {
    id: 5,
    groupId: 509,
    userId: 10,
    userName: "홍길동",
    userNickname: "맛집탐험가",
    createdAt: "2025-11-13T08:12:41.553Z",
  },
];

const creationDummy: CreationHistory[] = [
  {
    id: 1,
    leaderId: 10,
    leaderNickname: "편집장",
    leaderName: "박지성",
    title: "세션 전 식사하실 분~",
    category: "MEAL",
    capacity: 5,
    meetingAt: "2025-11-06T18:00:00.000Z",
    location: "정문 양쉐프",
    state: "OPEN",
    participantCount: 2,
    photos: [{ photoUrl: "https://via.placeholder.com/150", order: 0 }],
  },
  {
    id: 2,
    leaderId: 10,
    leaderNickname: "편집장",
    leaderName: "박지성",
    title: "퇴근 후 모각작",
    category: "STUDY",
    capacity: 4,
    meetingAt: "2025-11-15T20:00:00.000Z",
    location: "도서관 스터디룸",
    state: "OPEN",
    participantCount: 3,
    photos: [{ photoUrl: "https://via.placeholder.com/150", order: 0 }],
  },
];

const reviewDummy: ReviewHistory[] = [
  {
    id: 1,
    groupId: 301,
    userId: 10,
    content: "분위기가 너무 좋아서 다음에도 꼭 참여하고 싶어요!",
    score: 5,
    createdAt: "2025-11-12T09:14:01.611Z",
    photos: [{ photoUrl: "https://via.placeholder.com/150", order: 0 }],
  },
  {
    id: 2,
    groupId: 401,
    userId: 10,
    content: "음식도 맛있고 사람들도 친절했어요.",
    score: 4,
    createdAt: "2025-11-01T13:22:48.611Z",
    photos: [{ photoUrl: "https://via.placeholder.com/150", order: 0 }],
  },
];

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";
  let hour12 = hours % 12;
  if (hour12 === 0) hour12 = 12;

  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}(${hour12}${minutes !== "00" ? `:${minutes}` : ""}${period})`;
}

function MyActivities() {
  const [selectedTab, setSelectedTab] = useState<TabType>("신청 내역");

  const tabData = useMemo(() => {
    if (selectedTab === "신청 내역") return applicationDummy;
    if (selectedTab === "개설 내역") return creationDummy;
    return reviewDummy;
  }, [selectedTab]);

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
        {tabData.length === 0 ? (
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

type ActivityData = ApplicationHistory | CreationHistory | ReviewHistory;

interface ActivityCardProps {
  tab: TabType;
  data: ActivityData;
  background: string;
}

function ActivityCard({ tab, data, background }: ActivityCardProps) {
  const info = useMemo(() => {
    if (tab === "신청 내역") {
      const item = data as ApplicationHistory;
      return [
        { label: "참여 모임 ID", value: item.groupId },
        { label: "신청자", value: item.userName },
        { label: "닉네임", value: item.userNickname },
        { label: "신청일시", value: formatDate(item.createdAt) },
      ];
    }

    if (tab === "개설 내역") {
      const item = data as CreationHistory;
      return [
        { label: "모임명", value: item.title },
        { label: "카테고리", value: item.category },
        {
          label: "인원",
          value: `${item.participantCount}/${item.capacity}`,
        },
        { label: "모임일시", value: formatDate(item.meetingAt) },
        { label: "장소", value: item.location },
        { label: "상태", value: item.state },
      ];
    }

    const item = data as ReviewHistory;
    return [
      { label: "참여 모임 ID", value: item.groupId },
      { label: "후기 작성일", value: formatDate(item.createdAt) },
      { label: "평점", value: `${item.score}점` },
      { label: "후기", value: item.content },
    ];
  }, [tab, data]);

  return (
    <CardLayout backgroundColor={background}>
      <CardHeader>
        <CardTitle>{tab}</CardTitle>
        <CardSubInfo>id: {data.id}</CardSubInfo>
      </CardHeader>
      <CardBody>
        <InfoTable>
          {info.map((row) => (
            <InfoRow key={row.label}>
              <InfoLabel>{row.label}</InfoLabel>
              <InfoValue>{row.value}</InfoValue>
            </InfoRow>
          ))}
        </InfoTable>
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
  padding: 16px;
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
  padding: 16px 20px 12px;
  background: #ffffff;
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
  padding: 16px 20px 20px;
`;

const InfoTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: #000;
  font-family: Pretendard;
  font-size: 13px;
  font-weight: 600;
`;

const InfoRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

const InfoLabel = styled.div`
  min-width: 80px;
  color: #404040;
`;

const InfoValue = styled.div`
  flex: 1;
  font-weight: 500;
  color: #000;
  word-break: break-word;
  white-space: pre-line;
`;
