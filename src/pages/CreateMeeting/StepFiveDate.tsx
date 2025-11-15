import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import toggleArrowIcon from '@/assets/icons/toggleArrow.svg';

interface StepFiveDateProps {
  onNextStep?: () => void;
  onPrevStep?: () => void;
  onDataChange?: (meetingAt: string) => void;
  initialMeetingAt?: string;
}

// 날짜/시간을 ISO-8601 형식으로 변환하는 함수
const formatToISO8601 = (
  year: string,
  month: string,
  day: string,
  amPm: string,
  hour: string,
  minute: string
): string => {
  // 오전/오후를 24시간 형식으로 변환
  let hour24 = parseInt(hour);
  if (amPm === '오후' && hour24 !== 12) {
    hour24 += 12;
  } else if (amPm === '오전' && hour24 === 12) {
    hour24 = 0;
  }
  
  const hourStr = String(hour24).padStart(2, '0');
  const minuteStr = minute.padStart(2, '0');
  
  // ISO-8601 형식: YYYY-MM-DDTHH:mm:ss
  return `${year}-${month}-${day}T${hourStr}:${minuteStr}:00`;
};

// ISO-8601 형식을 파싱하는 함수
const parseISO8601 = (isoString: string): { year: string; month: string; day: string; amPm: string; hour: string; minute: string } | null => {
  if (!isoString) return null;
  
  try {
    const date = new Date(isoString);
    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    let hour24 = date.getHours();
    const minute = String(date.getMinutes()).padStart(2, '0');
    
    let amPm = '오전';
    let hour = hour24;
    
    if (hour24 === 0) {
      hour = 12;
    } else if (hour24 === 12) {
      amPm = '오후';
    } else if (hour24 > 12) {
      amPm = '오후';
      hour = hour24 - 12;
    }
    
    return {
      year,
      month,
      day,
      amPm,
      hour: String(hour).padStart(2, '0'),
      minute,
    };
  } catch (e) {
    return null;
  }
};

const StepFiveDate: React.FC<StepFiveDateProps> = ({ onDataChange, initialMeetingAt = "" }) => {
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isDayOpen, setIsDayOpen] = useState(false);
  const [isAmPmOpen, setIsAmPmOpen] = useState(false);
  const [isHourOpen, setIsHourOpen] = useState(false);
  const [isMinuteOpen, setIsMinuteOpen] = useState(false);
  
  const parsedDate = parseISO8601(initialMeetingAt);
  const [selectedYear, setSelectedYear] = useState<string>(parsedDate?.year || '2025');
  const [selectedMonth, setSelectedMonth] = useState<string>(parsedDate?.month || '01');
  const [selectedDay, setSelectedDay] = useState<string>(parsedDate?.day || '01');
  const [selectedAmPm, setSelectedAmPm] = useState<string>(parsedDate?.amPm || '오전');
  const [selectedHour, setSelectedHour] = useState<string>(parsedDate?.hour || '01');
  const [selectedMinute, setSelectedMinute] = useState<string>(parsedDate?.minute || '00');

  // 컴포넌트 마운트 시 또는 초기값 변경 시 meetingAt 업데이트
  useEffect(() => {
    const parsed = parseISO8601(initialMeetingAt);
    if (parsed) {
      setSelectedYear(parsed.year);
      setSelectedMonth(parsed.month);
      setSelectedDay(parsed.day);
      setSelectedAmPm(parsed.amPm);
      setSelectedHour(parsed.hour);
      setSelectedMinute(parsed.minute);
      // 초기값이 있으면 meetingAt 업데이트
      const meetingAt = formatToISO8601(parsed.year, parsed.month, parsed.day, parsed.amPm, parsed.hour, parsed.minute);
      if (onDataChange) {
        onDataChange(meetingAt);
      }
    }
  }, [initialMeetingAt]);

  // 컴포넌트 마운트 시 기본값으로 meetingAt 생성 (초기값이 없을 때만)
  useEffect(() => {
    if (!initialMeetingAt && onDataChange) {
      const defaultMeetingAt = formatToISO8601(selectedYear, selectedMonth, selectedDay, selectedAmPm, selectedHour, selectedMinute);
      onDataChange(defaultMeetingAt);
    }
  }, []); // 마운트 시 한 번만 실행

  const years = ['2025', '2026', '2027', '2028', '2029'];
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  const amPmOptions = ['오전', '오후'];
  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  const handleYearClick = () => {
    setIsYearOpen(!isYearOpen);
    setIsMonthOpen(false);
    setIsDayOpen(false);
    setIsAmPmOpen(false);
    setIsHourOpen(false);
    setIsMinuteOpen(false);
  };

  const handleMonthClick = () => {
    setIsMonthOpen(!isMonthOpen);
    setIsYearOpen(false);
    setIsDayOpen(false);
    setIsAmPmOpen(false);
    setIsHourOpen(false);
    setIsMinuteOpen(false);
  };

  const handleDayClick = () => {
    setIsDayOpen(!isDayOpen);
    setIsYearOpen(false);
    setIsMonthOpen(false);
    setIsAmPmOpen(false);
    setIsHourOpen(false);
    setIsMinuteOpen(false);
  };

  const handleAmPmClick = () => {
    setIsAmPmOpen(!isAmPmOpen);
    setIsYearOpen(false);
    setIsMonthOpen(false);
    setIsDayOpen(false);
    setIsHourOpen(false);
    setIsMinuteOpen(false);
  };

  const handleHourClick = () => {
    setIsHourOpen(!isHourOpen);
    setIsYearOpen(false);
    setIsMonthOpen(false);
    setIsDayOpen(false);
    setIsAmPmOpen(false);
    setIsMinuteOpen(false);
  };

  const handleMinuteClick = () => {
    setIsMinuteOpen(!isMinuteOpen);
    setIsYearOpen(false);
    setIsMonthOpen(false);
    setIsDayOpen(false);
    setIsAmPmOpen(false);
    setIsHourOpen(false);
  };

  // 날짜/시간 변경 시 meetingAt 업데이트
  const updateMeetingAt = (
    year: string,
    month: string,
    day: string,
    amPm: string,
    hour: string,
    minute: string
  ) => {
    const meetingAt = formatToISO8601(year, month, day, amPm, hour, minute);
    if (onDataChange) {
      onDataChange(meetingAt);
    }
  };

  const handleYearSelect = (year: string) => {
    setSelectedYear(year);
    setIsYearOpen(false);
    updateMeetingAt(year, selectedMonth, selectedDay, selectedAmPm, selectedHour, selectedMinute);
  };

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(month);
    setIsMonthOpen(false);
    updateMeetingAt(selectedYear, month, selectedDay, selectedAmPm, selectedHour, selectedMinute);
  };

  const handleDaySelect = (day: string) => {
    setSelectedDay(day);
    setIsDayOpen(false);
    updateMeetingAt(selectedYear, selectedMonth, day, selectedAmPm, selectedHour, selectedMinute);
  };

  const handleAmPmSelect = (amPm: string) => {
    setSelectedAmPm(amPm);
    setIsAmPmOpen(false);
    updateMeetingAt(selectedYear, selectedMonth, selectedDay, amPm, selectedHour, selectedMinute);
  };

  const handleHourSelect = (hour: string) => {
    setSelectedHour(hour);
    setIsHourOpen(false);
    updateMeetingAt(selectedYear, selectedMonth, selectedDay, selectedAmPm, hour, selectedMinute);
  };

  const handleMinuteSelect = (minute: string) => {
    setSelectedMinute(minute);
    setIsMinuteOpen(false);
    updateMeetingAt(selectedYear, selectedMonth, selectedDay, selectedAmPm, selectedHour, minute);
  };

  return (
    <Container>
      <TitleSection>
        <Title>모임 일시</Title>
        <Description>모임 날짜와 시간을 설정해주세요.</Description>
      </TitleSection>
      <DateSection>
        <DateLabel>원하는 날짜</DateLabel>
        <DateContainer>
          <DateDropdownSection>
            <DateToggleBox onClick={handleYearClick}>
              <DateText>{selectedYear}</DateText>
              <DateToggleIcon src={toggleArrowIcon} alt="Toggle" $isOpen={isYearOpen} />
            </DateToggleBox>
            {isYearOpen && (
              <DateDropdownList>
                {years.map((year) => (
                  <DateDropdownItem
                    key={year}
                    onClick={() => handleYearSelect(year)}
                    $isSelected={selectedYear === year}
                  >
                    {year}
                  </DateDropdownItem>
                ))}
              </DateDropdownList>
            )}
          </DateDropdownSection>
          <DateDropdownSection>
            <DateToggleBox onClick={handleMonthClick}>
              <DateText>{selectedMonth}</DateText>
              <DateToggleIcon src={toggleArrowIcon} alt="Toggle" $isOpen={isMonthOpen} />
            </DateToggleBox>
            {isMonthOpen && (
              <DateDropdownList>
                {months.map((month) => (
                  <DateDropdownItem
                    key={month}
                    onClick={() => handleMonthSelect(month)}
                    $isSelected={selectedMonth === month}
                  >
                    {month}
                  </DateDropdownItem>
                ))}
              </DateDropdownList>
            )}
          </DateDropdownSection>
          <DateDropdownSection>
            <DateToggleBox onClick={handleDayClick}>
              <DateText>{selectedDay}</DateText>
              <DateToggleIcon src={toggleArrowIcon} alt="Toggle" $isOpen={isDayOpen} />
            </DateToggleBox>
            {isDayOpen && (
              <DateDropdownList>
                {days.map((day) => (
                  <DateDropdownItem
                    key={day}
                    onClick={() => handleDaySelect(day)}
                    $isSelected={selectedDay === day}
                  >
                    {day}
                  </DateDropdownItem>
                ))}
              </DateDropdownList>
            )}
          </DateDropdownSection>
        </DateContainer>
      </DateSection>
      <TimeSection>
        <TimeLabel>원하는 시간</TimeLabel>
        <TimeContainer>
          <DateDropdownSection>
            <DateToggleBox onClick={handleAmPmClick}>
              <DateText>{selectedAmPm}</DateText>
              <DateToggleIcon src={toggleArrowIcon} alt="Toggle" $isOpen={isAmPmOpen} />
            </DateToggleBox>
            {isAmPmOpen && (
              <DateDropdownList>
                {amPmOptions.map((amPm) => (
                  <DateDropdownItem
                    key={amPm}
                    onClick={() => handleAmPmSelect(amPm)}
                    $isSelected={selectedAmPm === amPm}
                  >
                    {amPm}
                  </DateDropdownItem>
                ))}
              </DateDropdownList>
            )}
          </DateDropdownSection>
          <DateDropdownSection>
            <DateToggleBox onClick={handleHourClick}>
              <DateText>{selectedHour}</DateText>
              <DateToggleIcon src={toggleArrowIcon} alt="Toggle" $isOpen={isHourOpen} />
            </DateToggleBox>
            {isHourOpen && (
              <DateDropdownList>
                {hours.map((hour) => (
                  <DateDropdownItem
                    key={hour}
                    onClick={() => handleHourSelect(hour)}
                    $isSelected={selectedHour === hour}
                  >
                    {hour}
                  </DateDropdownItem>
                ))}
              </DateDropdownList>
            )}
          </DateDropdownSection>
          <DateDropdownSection>
            <DateToggleBox onClick={handleMinuteClick}>
              <DateText>{selectedMinute}</DateText>
              <DateToggleIcon src={toggleArrowIcon} alt="Toggle" $isOpen={isMinuteOpen} />
            </DateToggleBox>
            {isMinuteOpen && (
              <DateDropdownList>
                {minutes.map((minute) => (
                  <DateDropdownItem
                    key={minute}
                    onClick={() => handleMinuteSelect(minute)}
                    $isSelected={selectedMinute === minute}
                  >
                    {minute}
                  </DateDropdownItem>
                ))}
              </DateDropdownList>
            )}
          </DateDropdownSection>
        </TimeContainer>
      </TimeSection>
    </Container>
  );
};

export default StepFiveDate;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  gap: 8px;
`;

const Title = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const Description = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 10px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const DateSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  margin-top: 24px;
  gap: 4px;
`;

const DateLabel = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const DateContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: flex-start;
  gap: 36px;
  position: relative;
`;

const DateDropdownSection = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`;

const DateToggleBox = styled.button`
  display: flex;
  width: 100px;
  height: 46px;
  flex-shrink: 0;
  border-bottom: 1px solid #BDBDBD;
  border-top: none;
  border-left: none;
  border-right: none;
  background: transparent;
  cursor: pointer;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  box-sizing: border-box;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:focus {
    outline: none;
  }
`;

const DateText = styled.span`
  color: #000;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const DateToggleIcon = styled.img<{ $isOpen: boolean }>`
  width: 20px;
  height: 20px;
  transition: transform 0.2s ease;
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const DateDropdownList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100px;
  margin-top: 4px;
  border-radius: 0;
  border: 1px solid #848484;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: 200px;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const DateDropdownItem = styled.div<{ $isSelected: boolean }>`
  display: flex;
  padding: 8px 16px;
  align-items: center;
  gap: 8px;
  align-self: stretch;
  cursor: pointer;
  color: #000;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  background: ${props => props.$isSelected ? 'rgba(67, 214, 135, 0.2)' : 'transparent'};
  
  &:hover {
    background: rgba(67, 214, 135, 0.1);
  }
`;

const TimeSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  margin-top: 36px;
  gap: 4px;
`;

const TimeLabel = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const TimeContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: flex-start;
  gap: 36px;
  position: relative;
`;

