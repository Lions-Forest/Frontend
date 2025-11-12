import { useEffect, useState } from 'react';
import BackToNavBar from "@/components/common/BackToNavBar";
import styled from 'styled-components';
import NotificationCard, {type NotificationCardProps } from '@/components/features/NotificationCard';
import { 
    getNotificationList, 
    transformNotifications
} from '@/api/notification/noteListAPI';
import notNoteIcon from '@/assets/icons/notNote.png';

function index() {
    const [notifications, setNotifications] = useState<NotificationCardProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // localStorage에서 userId 가져오기
                const userId = localStorage.getItem("userId");
                if (!userId) {
                    setError("사용자 ID를 찾을 수 없습니다.");
                    setLoading(false);
                    return;
                }

                // API 호출
                const response = await getNotificationList(Number(userId));
                
                // 응답 데이터를 NotificationCard 형식으로 변환
                const transformedData = transformNotifications(response);
                setNotifications(transformedData);
            } catch (err) {
                console.error("알림 목록 조회 실패:", err);
                setError("알림 목록을 불러오는데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const showEmptyState = !loading && (error || notifications.length === 0);

    return(
        <Wrapper>
            <BackToNavBar text="알림" />
            <Contents isEmpty={showEmptyState}>
                {loading && <LoadingText>알림을 불러오는 중...</LoadingText>}
                {showEmptyState && (
                    <EmptyState>
                        <EmptyIcon src={notNoteIcon} alt="알림 없음" />
                        <EmptyText>새로운 알림이 없습니다</EmptyText>
                    </EmptyState>
                )}
                {!loading && !error && notifications.length > 0 && notifications.map((notification, index) => (
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

const Contents = styled.div<{ isEmpty?: boolean }>`
  flex: 1;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  ${props => props.isEmpty && `
    display: flex;
    align-items: center;
    justify-content: center;
  `}
`;

const LoadingText = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
  font-size: 14px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const EmptyIcon = styled.img`
  display: block;
  margin-bottom: 16px;
`;

const EmptyText = styled.div`
  color: #919191;
  text-align: center;
  font-family: "Noto Sans KR";
  font-size: 14px;
  font-style: normal;
`;