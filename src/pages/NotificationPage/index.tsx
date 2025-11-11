import BackToNavBar from "@/components/common/BackToNavBar";
import styled from 'styled-components';
import NotificationCard from '@/components/features/NotificationCard';

// NotificationCard props interface 정의(dummy data로 임시)
interface NotificationCardProps {
  meetingDate: string;
  meetingName: string;
  imageUrl?: string;
}

function index() {
    // Dummy data (임시)
    const dummyNotifications: NotificationCardProps[] = [
        {
            meetingDate: "25.11.07",
            meetingName: "카공 번개",
            imageUrl: "https://i.ifh.cc/9p1o6z.jpg"
        },
        {
            meetingDate: "25.11.06",
            meetingName: "스터디 그룹",
            imageUrl: "https://i.ifh.cc/9p1o6z.jpg"
        },
        {
            meetingDate: "25.11.05",
            meetingName: "점심 식사",
            // 이미지 Url 없이
        },
        {
            meetingDate: "25.11.06",
            meetingName: "스터디 그룹",
            imageUrl: "https://i.ifh.cc/9p1o6z.jpg"
        },
        {
            meetingDate: "25.11.06",
            meetingName: "스터디 그룹",
            imageUrl: "https://i.ifh.cc/9p1o6z.jpg"
        },
        {
            meetingDate: "25.11.06",
            meetingName: "스터디 그룹",
            imageUrl: "https://i.ifh.cc/9p1o6z.jpg"
        },
        {
            meetingDate: "25.11.06",
            meetingName: "스터디 그룹",
            imageUrl: "https://i.ifh.cc/9p1o6z.jpg"
        },
        {
            meetingDate: "25.11.06",
            meetingName: "스터디 그룹",
            imageUrl: "https://i.ifh.cc/9p1o6z.jpg"
        },
        {
            meetingDate: "25.11.06",
            meetingName: "스터디 그룹",
            imageUrl: "https://i.ifh.cc/9p1o6z.jpg"
        },
        {
            meetingDate: "25.11.06",
            meetingName: "스터디 그룹",
            imageUrl: "https://i.ifh.cc/9p1o6z.jpg"
        },
        {
            meetingDate: "25.11.06",
            meetingName: "스터디 그룹",
            imageUrl: "https://i.ifh.cc/9p1o6z.jpg"
        },
        {
            meetingDate: "25.11.06",
            meetingName: "스터디 그룹",
            imageUrl: "https://i.ifh.cc/9p1o6z.jpg"
        },

    ];

    return(
        <Wrapper>
            <BackToNavBar text="알림" />
            <Contents>
                {dummyNotifications.map((notification, index) => (
                    <NotificationCard key={index} {...notification} />
                ))}
            </Contents>
        </Wrapper>
    )
}
export default index;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
//  overflow: hidden;
`;

const Contents = styled.div`
  /* font-size: 100px; */ /* Removed placeholder styling */

  flex: 1;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`;