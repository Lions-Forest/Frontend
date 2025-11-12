
import styled from 'styled-components'

interface ButtonProps {
  onJoin?: boolean;
  onJoinCancel?: boolean;
  onMakeCancel?: boolean;
  onClose?: boolean;
  onInfo?: boolean;
  color?: string;
  onClick?: () => void;
}

const CardButton = ({ onJoin = false, onInfo = false, onJoinCancel = false, onMakeCancel = false, onClose = false, color = `#D9D9D9`, onClick }: ButtonProps) => {

  let text = '';
  let clickHandler: (() => void) | undefined = undefined;
  let bgColor = '#D9D9D9';
  let textColor = '#000';
  let disabled = false;
  let border = "none";

  // TODO: onClick 기능 임의 설정, 경로 수정 필요
  if (onJoin) {
    text = '참여하기';
    // onClick = () => {location.href = '/join' };
    bgColor = color;
    textColor = "#fff";
  } else if (onMakeCancel) {
    text = '모임 개설 취소';
    // onClick = () => {location.href = '/make-cancel'};
    bgColor = '#fff';
    textColor = '#000';
    border = `2px solid ${color}`    
  } else if (onJoinCancel) {
    text = '참여 신청 취소';
    // onClick = () => {location.href = '/join-cancel'};
    bgColor = '#fff';
    textColor = '#000';
    border = `2px solid ${color}` 
  } else if (onClose) {
    text = "신청 마감";
    disabled = true;
    bgColor = "#848484";
    textColor = "#000";
  } else {
    text = '모임 정보 확인';
    // onInfo일 때 전달된 onClick 사용
    if (onInfo && onClick) {
      clickHandler = onClick as () => void;
    }
    bgColor = '#D9D9D9';
    textColor = '#000';
  }

  return (
    <BtnLayout 
    bgColor={bgColor}
    textColor={textColor}
    border={border}
    disabled={disabled}
    onClick={disabled ? undefined : (clickHandler || onClick)}
    >{text}</BtnLayout>
  )
}

export default CardButton;

interface BtnLayoutProps {
  bgColor: string;
  textColor: string;
  border: string;
  disabled: boolean;
}

const BtnLayout = styled.div<BtnLayoutProps>`
  display: flex;
  width: 162px;
  padding: 8px 10px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  color: #000;
  font-family: Pretendard;
  font-size: 10px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  border-radius: 7px;
  background: ${({ bgColor }) => bgColor};
  color: ${({ textColor }) => textColor};
  border: ${({ border }) => border};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;
