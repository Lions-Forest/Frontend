import styled from "styled-components";
import PencilIcon from "@/assets/icons/statusMessage.svg";

interface StatusMessageInputProps {
  message: string;
  onChange: (msg: string) => void;
}

export default function StatusMessageInput({
  message,
  onChange,
}: StatusMessageInputProps) {
  return (
    <Wrapper>
      <Title>상태 메시지(선택)</Title>
      <InputWrapper>
        <Input
          type="text"
          value={message}
          placeholder="내용을 입력해주세요."
          onChange={(e) => onChange(e.target.value)}
        />
        <Icon src={PencilIcon} />
      </InputWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  margin-bottom: 35px;
`;

const Title = styled.p`
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 500;
  color: #000000;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  height: 39px;
  font-size: 16px;
  font-weight: 600;
  background-color: #ffffff;
  border: 0.1px solid #000000;
  border-radius: 4px;
  color: #595959;
  cursor: pointer;
  padding: 10px 36px 10px 12px;

  &:focus {
    outline: none;
  }

  &::placeholder {
    font-family: Pretendard;
    color: #b8b8b8;
    font-size: 16px;
    font-weight: 500;
  }
`;

const Icon = styled.img`
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  pointer-events: none;
`;
