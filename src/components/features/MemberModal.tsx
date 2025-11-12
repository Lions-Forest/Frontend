import React from "react";
import styled from "styled-components";
import type { Member } from "@/types";
import { IoIosClose as Close } from "react-icons/io";

interface MemberModalProps {
  member: Member;
  onClose: () => void;
}

function isAnonymous(member: Member) {
  // 로직 구성 필요
  return member.nickname;
}

function MemberModal({ member, onClose }: MemberModalProps) {
  const anonymous = isAnonymous(member);

  return (
    <Overlay>
      <ModalBox>
        <CloseBtn onClick={onClose} />
        <Name>{anonymous ? member.nickname : member.name}</Name>
        <ProfileImg src={member.photoUrl || ""} />
        <DetailRow>
          {anonymous 
            ? null 
            : <>
                <MemberDetail>한 줄 소개</MemberDetail>
                <MemberDetail>{member.detail}</MemberDetail>
              </>
          }
        </DetailRow>
      </ModalBox>
    </Overlay>
  );
}

export default MemberModal;

// 스타일
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalBox = styled.div`
  position: relative;
  width: 245px;
  height: 179px;
  flex-shrink: 0;
  border-radius: 5px;
  border: 0.1px solid #000;
  background: #FFF;  
  
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
    margin-bottom: 8px;
    color: #000;
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
`;

const ProfileImg = styled.img`
    width: 64px;
    height: 64px;
    flex-shrink: 0;
  object-fit: cover;
  border-radius: 64px;
  margin-bottom: 13px;
  background: #eee;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 23px;
  margin-top: 19px;
`;

const MemberDetail = styled.div`
    color: #000;
    font-family: Pretendard;
    font-size: 10px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`;