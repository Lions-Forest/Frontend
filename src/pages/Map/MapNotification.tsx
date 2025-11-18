import type { UserLocation } from "@/api/UserLocation";
import { getDistanceFromLatLonInMeters } from "@/utils/distance";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Arrow from "@/assets/icons/bannerArrow.svg";

interface MapNotificationProps {
  myPosition: { lat: number; lng: number } | null;
  userId: string;
  locations: Record<string, UserLocation>;
  shareLocation: boolean;
  selectedStatus: UserLocation["status"];
  radiusMeters?: number;
}

const statusToKorean: Record<string, string> = {
  nothing: "상태 X",
  studying: "공부 중",
  working: "작업 중",
  relaxing: "쉬는 중",
  eating: "식사 중",
  playing: "노는 중",
  boring: "심심해",
  hungry: "배고파",
};

export default function MapNotification({
  myPosition,
  userId,
  locations,
  shareLocation,
  selectedStatus,
  radiusMeters = 1500,
}: MapNotificationProps) {
  const navigate = useNavigate();
  const nearbyCount = useMemo(() => {
    if (!myPosition) return 0;

    let count = 0;

    Object.values(locations).forEach((user) => {
      if (user.userId === userId) return;
      if (!user.shareLocation) return;

      const distance = getDistanceFromLatLonInMeters(
        myPosition.lat,
        myPosition.lng,
        user.latitude,
        user.longitude
      );
      if (distance <= radiusMeters) {
        if (shareLocation) {
          const theirStatus = user.status === "" ? "nothing" : user.status;

          // 내 상태와 같은 사람만 카운트
          if (theirStatus === selectedStatus) count++;
        } else {
          count++;
        }
      }
    });
    return count;
  }, [
    myPosition,
    locations,
    userId,
    shareLocation,
    selectedStatus,
    radiusMeters,
  ]);

  if (nearbyCount === 0) return null;

  const message = shareLocation ? (
    <>
      👀 지금 내 주변에 "
      <strong style={{ fontWeight: 600 }}>
        {statusToKorean[selectedStatus]}
      </strong>
      "인 모임원이 {nearbyCount}명 있어요!
    </>
  ) : (
    <>내 주변 모임원 {nearbyCount}명</>
  );

  return shareLocation ? (
    <StatusBanner>
      <Message>{message}</Message>
      <BannerButton onClick={() => navigate("/home/create-meeting")}>
        바로 모임 개설하기
        <img src={Arrow} width={14} height={10} />
      </BannerButton>
    </StatusBanner>
  ) : (
    <Banner>{message}</Banner>
  );
}

const Banner = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 109px;
  height: 30px;
  top: 35px;
  left: 50%;
  gap: 11px;
  transform: translateX(-50%);
  background: #00a057;
  font-family: Pretendard;
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
  padding: 8px 10px;
  border-radius: 16px;
  z-index: 100;
`;

const StatusBanner = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 354px;
  height: 95px;
  top: 35px;
  left: 50%;
  transform: translateX(-50%);
  background: #ffffff;
  padding: 21px 10px 10px;
  border: 0.1px solid #000;
  border-radius: 8px;
  z-index: 100;
  box-sizing: border-box;
`;

const Message = styled.p`
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 400;
  color: #000000;
`;

const BannerButton = styled.button`
  display: flex;
  align-items: center;
  align-self: flex-end;
  gap: 6px;
  width: 139px;
  height: 30px;
  background: #ffffff;
  padding: 5px 0 2px 20px;
  font-family: dongleRegular;
  font-size: 20px;
  font-weight: 700;
  color: #000000;
  border: 1px solid #848484;
  border-radius: 50px;
  cursor: pointer;
`;
