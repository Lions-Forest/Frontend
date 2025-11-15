import styled from "styled-components";
import { IoIosClose as Close } from "react-icons/io";

interface ClickingModalProps {
  onClick: () => void;
  onClose: () => void;
}

function CheckingModal({ onClick, onClose }: ClickingModalProps ) {

  return (
    <Overlay>
      <ModalBox>
        <CloseBtn onClick={onClose} />
        <DetailRow>
            <ParticipantDetail>
                이 버튼을 누르면 모임 개설이 취소돼요. <br />
                정말 모임 개설을 취소하시겠습니까?
            </ParticipantDetail>
        </DetailRow>
        <ButtonRow>
            <Button>네</Button>
            <Button onClick={onClick}>아니오</Button>
        </ButtonRow>
      </ModalBox>
    </Overlay>
  );
}

export default CheckingModal;

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
  width: 300px;
  height: 179px;
  flex-shrink: 0;
  border-radius: 5px;
  border: 0.1px solid #000;
  background: #FFF; 
  padding: 40px 0px; 
  gap: 30px;
  
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CloseBtn = styled(Close)`
  position: absolute;
  top: 18px;
  right: 20px;
  font-size: 24px;
  color: #979797;
  cursor: pointer;
`;

const DetailRow = styled.div`
  display: flex;
  width: 100%;
  padding: 0px 35px;
  align-items: center;
  justify-content: center;
  gap: 23px;
`;

const ParticipantDetail = styled.div`
    color: #000;
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
`;

const ButtonRow = styled.div`
    display: flex;
    gap: 25px;
    align-items: center;
    justify-content: Center;
    padding: 0px 35px;
`;

const Button = styled.div`
    display: flex;
    height: 20px;
    padding: 10px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    border-radius: 8px;
    background: #A4A4A5;

    color: #000;
    font-family: Pretendard;
    font-size: 10px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
`;