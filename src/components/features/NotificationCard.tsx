import React from 'react';
import styled from 'styled-components';

// NotificationCard props interface 정의
export interface NotificationCardProps {
  meetingDate: string;
  meetingName: string;
  imageUrl?: string;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  meetingDate,
  meetingName,
  imageUrl,
}) => {
  return (
    <CardContainer>
      <ImageWrapper>
        {imageUrl ? (
          <MeetingImage src={imageUrl} alt="Meeting" />
        ) : (
          <PlaceholderImage /> // Placeholder if no image URL
        )}
      </ImageWrapper>
      <TextContent>
        <NotificationText>
          <BoldText>[{meetingDate}] {meetingName}</BoldText> 모임 참여가 확정되었어요!  
        </NotificationText>
      </TextContent>
    </CardContainer>
  );
};

export default NotificationCard;

const CardContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 22px 29px;
`;

const ImageWrapper = styled.div`
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 16px;
  background-color: #D9D9D9;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MeetingImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  background-color: #a0a0a0;
`;

const TextContent = styled.div`
  flex-grow: 1;
`;

const NotificationText = styled.span`
  font-size: 12px;
  color: #333;
  line-height: 1.5; // 눈대중
`;
const BoldText = styled.span`
  font-weight: 700;
`