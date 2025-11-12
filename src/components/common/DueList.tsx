import DueCard from "./DueCard";
import styled from "styled-components";
import type { Meeting } from "@/types";

interface DueListProps {
  meetings: Meeting[];
}

function DueList({ meetings }: DueListProps) {
  return (
    <ListLayout>
      <Title>
        <ColoredTitle>마감이 임박</ColoredTitle>한 모임
      </Title>
      {meetings.length === 0 ? (
        <NoneText>마감이 임박한 모임이 없습니다.</NoneText>
      ) : (
        meetings.map((meeting) => (
          <CardList>
            <DueCard key={meeting.id} meeting={meeting} />
          </CardList>
        ))
      )}
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
  font-family: dongleLight;
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

const CardList = styled.div`
  display: flex;
  align-items: center;
  justify-content: center; // TODO: 문의, 답변 따라 조정 가능
  gap: 9px;
`;

const NoneText = styled.div`
  color: #000;
  font-family: dongleLight;
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
