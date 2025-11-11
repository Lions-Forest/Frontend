import { useState } from "react";
import styled from "styled-components";
import { IoIosArrowDown as Arrow } from "react-icons/io";
import PreviewCard from "../common/PreviewCard";
import type { Meeting } from "@/types";

interface MeetingListProps {
  meetings: Meeting[];
}

const types = ["전체", "식사", "모각작", "소모임", "문화예술", "기타"];

function MeetingList({ meetings }: MeetingListProps) {
  // 드롭다운 상태 (true: 메뉴 open)
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // '모집 중'('모집 완료') 상태값, 기본 '모집 중'
  const [recruitState, setRecruitState] = useState("모집 중");
  // type 버튼과 연동, 기본 '전체'
  const [selectedType, setSelectedType] = useState("전체");
  // 더보기 상태 (true: 전체 보여주기)
  const [showAll, setShowAll] = useState(false);

  if (!meetings || meetings.length === 0) {
    return (
      <Layout>
        <ListHeader>
          <OptionInfo>
            <OptionTitle onClick={() => setDropdownOpen(!dropdownOpen)}>
              {recruitState}
            </OptionTitle>
            <Arrow
              style={{ cursor: "pointer" }}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
              <Dropdown>
                <DropdownItem
                  onClick={() => {
                    setRecruitState("모집 중");
                    setDropdownOpen(false);
                  }}
                >
                  모집 중
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    setRecruitState("모집 완료");
                    setDropdownOpen(false);
                  }}
                >
                  모집 완료
                </DropdownItem>
              </Dropdown>
            )}
          </OptionInfo>
          <TypeList>
            {types.map((type) => (
              <TypeBtn
                key={type}
                selected={selectedType === type}
                onClick={() => setSelectedType(type)}
              >
                {type}
              </TypeBtn>
            ))}
          </TypeList>
        </ListHeader>
        <NoList>
          <OptionTitle>생성된 모임이 없습니다</OptionTitle>
        </NoList>
      </Layout>
    );
  }

  // 필터링된 미팅 리스트 계산
  const filteredMeetings = Array.isArray(meetings)
    ? meetings
        .filter((m) =>
          recruitState === "모집 중" ? !m.complete : !!m.complete
        )
        .filter((m) =>
          selectedType === "전체" ? true : m.type === selectedType
        )
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    : [];

  const previewMeetings = showAll
    ? filteredMeetings
    : filteredMeetings.slice(0, 2);

  return (
    <Layout>
      <ListHeader>
        <OptionInfo>
          <OptionTitle onClick={() => setDropdownOpen(!dropdownOpen)}>
            {recruitState}
          </OptionTitle>
          <Arrow
            style={{ cursor: "pointer" }}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
          {dropdownOpen && (
            <Dropdown>
              <DropdownItem
                onClick={() => {
                  setRecruitState("모집 중");
                  setDropdownOpen(false);
                }}
              >
                모집 중
              </DropdownItem>
              <DropdownItem
                onClick={() => {
                  setRecruitState("모집 완료");
                  setDropdownOpen(false);
                }}
              >
                모집 완료
              </DropdownItem>
            </Dropdown>
          )}
        </OptionInfo>
        <TypeList>
          {types.map((type) => (
            <TypeBtn
              key={type}
              selected={selectedType === type}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </TypeBtn>
          ))}
        </TypeList>
      </ListHeader>
      {filteredMeetings.length === 0 ? (
        <NoList>
          <OptionTitle>생성된 모임이 없습니다</OptionTitle>
        </NoList>
      ) : (
        <ListUp>
          {previewMeetings.map((meeting) => (
            <PreviewCard key={meeting.id} meeting={meeting} />
          ))}
          {!showAll && filteredMeetings.length > 2 && (
            <MoreBtn onClick={() => setShowAll(true)}>
              더보기 <Arrow width="10px" color="#00A057" />
            </MoreBtn>
          )}
        </ListUp>
      )}
    </Layout>
  );
}

export default MeetingList;

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
  // margin: 16px 0px;
`;

const ListHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
`;

const OptionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const OptionTitle = styled.div`
  color: #000;
  font-family: dongleRegular;
  font-size: 30px;
  font-weight: 700;
  line-height: normal;
`;

const TypeList = styled.div`
  display: flex;
  align-items: center;
  gap: 8.6px;
  align-self: stretch;
`;

const TypeBtn = styled.div<{ selected?: boolean }>`
  display: flex;
  padding: 5px 10px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 10px;
  background: ${({ selected }) => (selected ? "#43D687" : "#fff")};
  color: ${({ selected }) => (selected ? "#fff" : "#848484")};

  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  cursor: pointer;
`;

const MoreBtn = styled.div`
  display: flex;
  width: 78px;
  height: 30px;
  //padding: 5px 10px 2px 15px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-shrink: 0;
  border-radius: 50px;
  background: #fff;
  box-shadow: 0px 0px 10px #00000040;
  cursor: pointer;

  color: #000;
  font-family: dongleRegular;
  font-size: 20px;
  font-weight: 700;
  line-height: normal;
`;

// styled-components 추가 부분
const Dropdown = styled.div`
  position: absolute;
  margin-top: 40px;
  left: 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0px 2px 8px #0001;
  z-index: 99;
  min-width: 90px;
`;

const DropdownItem = styled.div`
  padding: 10px 15px;
  cursor: pointer;
  &:hover {
    background: #f5f5f5;
  }
`;

const NoList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 70px 0px;
  align-items: center;
`;

const ListUp = styled.div`
  display: flex;
  flex-direction: column;
  // align-items: center;
  gap: 16px;
  align-items: end;
`;
