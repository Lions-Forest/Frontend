import DueCard from "./DueCard";
import styled from "styled-components";
import type { Meeting } from "@/types";

interface DueListProps {
  meetings: Meeting[];
}

function DueList({ meetings }: DueListProps) {
  const shouldScroll = meetings.length >= 3;
  
  return (
    <ListLayout>
      <Title>
        <ColoredTitle>마감이 임박</ColoredTitle>한 모임
      </Title>
      <CardList $shouldScroll={shouldScroll}>
      {meetings.length === 0 ? (
        <NoneText>마감이 임박한 모임이 없습니다.</NoneText>
      ) : (
        meetings.map((meeting) => (
        <DueCard key={meeting.id} meeting={meeting} />
        ))
      )}
      </CardList>
    </ListLayout>
  );
}

export default DueList;

const ListLayout = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 8px;
`;

const Title = styled.div`
  align-self: stretch;
  color: #000;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  font-family: dongleRegular;
  font-size: 30px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;

  display: flex;
  justify-content: flex-start;
  width: 100%;
`;

const ColoredTitle = styled.div`
  color: #43d687;
`;

const CardList = styled.div<{ $shouldScroll?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $shouldScroll }) => ($shouldScroll ? 'flex-start' : 'center')};
  gap: 9px;
  width: 100%;
  overflow-x: ${({ $shouldScroll }) => ($shouldScroll ? 'auto' : 'visible')};
  overflow-y: hidden;
  scroll-behavior: smooth;
  
  /* 스크롤바 스타일링 (선택사항) */
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c4c4c4;
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a0a0a0;
  }
`;

const NoneText = styled.div`
  color: #000;
  font-family: dongleRegular;
  font-size: 30px;
  font-weight: 700;
  line-height: normal;
  align-self: stretch;
  line-height: normal;

  display: flex;
  padding: 70px 0px;
  align-items: center;
  justify-content: center;
`;
