import { HiMiniPencil as Pen } from "react-icons/hi2";
import styled from "styled-components";

function WriteButton() {
  return (
    <BtnLayout>
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
