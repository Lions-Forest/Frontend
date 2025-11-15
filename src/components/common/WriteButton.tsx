import { HiMiniPencil as Pen } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

function WriteButton() {
  // 모임 생성 페이지 라우팅을 위한 네비게이션 훅 정의_p.s. 정건(시작) //
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/home/create-meeting/step1');
  };
  //// 모임 생성 페이지 라우팅을 위한 네비게이션 훅 정의_p.s. 정건(끝) //
  return (
    <BtnLayout onClick={handleClick}>  {/*핸들러 추가 p.s. 정건(시작)*/}
      <Pen fill="#FFF371" width="24.8px" />
    </BtnLayout>
  );
}

export default WriteButton;

const BtnLayout = styled.div`
  position: fixed;
  bottom: 91px;
  right: 15px;

  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 50%;
  background-color: #fbbc04;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  // &:hover {
  //     transform: scale(1.05);
  // }

  // &:active {
  //     transform: scale(0.95);
  // }
`;
