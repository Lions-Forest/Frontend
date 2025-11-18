import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackToNavBar from "@/components/common/BackToNavBar";
import styled from 'styled-components';
import NotificationCard, {type NotificationCardProps } from '@/components/features/NotificationCard';
import { getNotificationList, transformNotifications} from '@/api/notification/noteListAPI';
import { markNotificationAsRead } from '@/api/notification/readNoteAPI';
import notNoteIcon from '@/assets/icons/notNote.png';

function index() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<NotificationCardProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    const fetchNotifications = useCallback(async (options?: { showLoading?: boolean }) => {
        const showLoading = options?.showLoading ?? true;

        try {
            if (showLoading) {
                setLoading(true);
            }
            setError(null);
            
            // localStorage에서 userId 가져오기
            let userId = localStorage.getItem("userId");
            
            // test2 토큰 사용 중인지 확인 (accessToken이 없거나 특정 조건일 때)
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken || !userId) {
                // test2 계정 사용 중이므로 userId를 2로 설정
                userId = "2";
            }
            
            if (!userId) {
                setError("사용자 ID를 찾을 수 없습니다.");
                setNotifications([]);
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
            setNotifications([]);
        } finally {
            if (showLoading) {
                setLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const handleNotificationClick = useCallback(async (notification: NotificationCardProps) => {
        if (notification.read || updatingId === notification.id) {
            return;
        }

        try {
            setUpdatingId(notification.id);
            await markNotificationAsRead(notification.id);
            await fetchNotifications({ showLoading: false });

            // targetType에 따라 라우팅 처리
            if (notification.targetType === "GROUP") {
                // GROUP인 경우 targetId가 있을 때만 이동
                if (notification.targetId) {
                    navigate(`/home/meeting-detail/${notification.targetId}`);
                }
            } else if (notification.targetType === "RADAR") {
                // RADAR인 경우 /map으로 이동
                navigate("/map");
            }
        } catch (err) {
            console.error("알림 읽음 처리 실패:", err);
            setError("알림을 읽음 처리하는데 실패했습니다.");
        } finally {
            setUpdatingId(null);
        }
    }, [fetchNotifications, updatingId, navigate]);

    const showEmptyState = !loading && (!!error || notifications.length === 0);

    return(
        <Wrapper>
            <BackToNavBar text="알림" isNotificationPage={true} />
            <Contents $isEmpty={showEmptyState}>
                {loading && <LoadingText>알림을 불러오는 중...</LoadingText>}
                {showEmptyState && (
                    <EmptyState>
                        <EmptyIcon src={notNoteIcon} alt="알림 없음" />
                        <EmptyText>새로운 알림이 없습니다</EmptyText>
                    </EmptyState>
                )}
                {!loading && !error && notifications.length > 0 && notifications.map((notification) => (
                    <NotificationCard
                        key={notification.id}
                        {...notification}
                        onClick={() => handleNotificationClick(notification)}
                        disabled={notification.read || updatingId === notification.id}
                    />
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

const Contents = styled.div<{ $isEmpty?: boolean }>`
  flex: 1;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  ${props => props.$isEmpty && `
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