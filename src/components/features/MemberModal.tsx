import { useEffect, useState } from "react";
import styled from "styled-components";
import type { Member, Participant } from "@/types";
import { IoIosClose as Close } from "react-icons/io";
import { fetchParticipantDetail } from "@/api/meeting/meetingMemberApi";
import defaultProfile from '../../assets/icons/lionHead.png'

interface MemberModalProps {
  participant: Participant;
  onClose: () => void;
  anonymous?: boolean;
}

function pickMemberFromResponse(data: Member | Member[] | null): Member | null {
  if (!data) return null;
  if (Array.isArray(data)) {
    return data.find((item) => item != null) ?? null;
  }
  return data;
}

function MemberModal({ participant, onClose, anonymous = true }: MemberModalProps) {
  const [detail, setDetail] = useState<Member | null>(null);
  console.log('해당 참가자 정보: ', detail);

  useEffect(() => {
    const fetchDetailedData = async () => {
      try {
        const result = await fetchParticipantDetail(participant?.userId || 0);
        console.log("참가자 정보: ", result);
        setDetail(pickMemberFromResponse(result));
      } catch (error) {
        console.error("데이터 로딩 실패: ", error);
        setDetail(null);
      }
    };
    fetchDetailedData();
  }, [participant?.userId]);

  const displayName = anonymous
    ? detail?.nickname || participant.nickname || "별명 없음"
    : detail?.name || participant.name || "이름 없음";
  const profileSrc = detail?.photoUrl || participant.photoUrl || "";
  const introduction = detail?.detail || "한 줄 소개 없음";

  return (
    <Overlay>
      <ModalBox>
        <CloseBtn onClick={onClose} />
        <Name>{displayName || "-"}</Name>
        <ProfileImg 
          src={anonymous ? defaultProfile : profileSrc} 
          alt={displayName} 
        />
        <DetailRow>
          {anonymous ? null : (
            <>
              <ParticipantDetail>한 줄 소개</ParticipantDetail>
              <ParticipantDetail>{introduction}</ParticipantDetail>
            </>
          )}
        </DetailRow>
      </ModalBox>
    </Overlay>
  );
}

export default MemberModal;

// const ModalOverlay = styled.div`
//   position: fixed;
//   top: 0; left: 0; right: 0; bottom: 0;
//   z-index: 1000;
//   background: rgba(0,0,0,0.55);  // 원하는 투명도 조절 (0.5~0.7 추천)
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.25);
`;

const ModalBox = styled.div<{ anonymous?: boolean }>`
  position: relative;
  width: 245px;
  height: 179px;
  flex-shrink: 0;
  border-radius: 5px;
  border: 0.1px solid #000;
  background: #FFF; 
  padding: 36px 0px 30px 0px; 
  gap: ${({ anonymous }) => (anonymous ? "20px" : "17px")};
  
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CloseBtn = styled(Close)`
  position: absolute;
  top: 18px;
  right: 20px;
  font-size: 24px;
  color: #979797;
  cursor: pointer;
`;

const Name = styled.div`
    color: #000;
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
`;

const ProfileImg = styled.img<{ anonymous?: boolean }>`
  width: ${({ anonymous }) => (anonymous ? "64px" : "49px")};
  height: ${({ anonymous }) => (anonymous ? "64px" : "49px")};
  flex-shrink: 0;
  object-fit: scale-down;
  border-radius: 64px;
  background: #fff;
`;

const DetailRow = styled.div`
  display: flex;
  width: 100%;
  padding: 0px 35px;
  align-items: center;
  justify-content: flex-start;
  gap: 23px;
`;

const ParticipantDetail = styled.div`
    color: #000;
    font-family: Pretendard;
    font-size: 10px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`;