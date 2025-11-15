import React, { useState } from "react";
import styled from "styled-components";

interface ReplyInputProps {
  meetingDate: Date | string;
  onSubmit?: (text: string) => void;
}

function ReplyInput({ meetingDate, onSubmit }: ReplyInputProps) {
  const [text, setText] = useState("");
  const isPast = new Date() > new Date(meetingDate);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (onSubmit && text.trim()) {
      onSubmit(text);
      setText("");
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <InputLayout>
        <StyledInput
          value={text}
          onChange={e => setText(e.target.value)}
          disabled={isPast}
          placeholder={isPast ? "마감된 모임에는 댓글을 작성할 수 없습니다." : "텍스트를 입력해주세요"}
        />
        <SubmitBtn type="submit" disabled={isPast || !text.trim()}>
          게시
        </SubmitBtn>
      </InputLayout>
    </Form>
  );
}

export default ReplyInput;

const Form = styled.form`
    width: 100%;
`;

const InputLayout = styled.div`
    width: 100%;
    display: flex;
    padding: 7px 10px;
    justify-content: flex-end;
    align-items: center;
    align-self: stretch;
    border-radius: 8px;
    border: 0.1px solid #FFF;
    background: #FFF;
`;

const StyledInput = styled.input`
    flex: 1;
    border: none;
    outline: none;

    color: #000;

    /* Body2/12 */
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;

    &::placeholder {
        color: #848484;
    }
    &:disabled {
        color: #848484;
    }
`;

const SubmitBtn = styled.button`
    display: flex;
    height: 22px;
    width: 50px;
    padding: 4px 12px;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    border: 0.1px solid #FFF;
    background: #848484;
    cursor: pointer;

    color: #FFF;
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;

    &:disabled {
        background: #e2e2e2;
        color: #b5b5b5;
        cursor: not-allowed;
    }
`;