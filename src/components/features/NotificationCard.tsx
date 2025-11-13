import React from 'react';
import styled from 'styled-components';

// NotificationCard props interface 정의
export interface NotificationCardProps {
  id: number;
  content: string;
  imageUrl?: string;
  read: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  content,
  imageUrl,
  read,
  onClick,
  disabled,
}) => {
  const isDisabled = disabled ?? read;

  return (
    <CardContainer
      type="button"
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      $isUnread={!read}
      aria-disabled={isDisabled}
    >
      <ImageWrapper>
        {imageUrl ? (
          <MeetingImage src={imageUrl} alt="Meeting" />
        ) : (
          <PlaceholderImage /> // Placeholder if no image URL
        )}
      </ImageWrapper>
      <TextContent>
        <NotificationText>
          {content}
        </NotificationText>
      </TextContent>
    </CardContainer>
  );
};

export default NotificationCard;

const CardContainer = styled.button<{ $isUnread?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 22px 29px;
  background-color: ${props => props.$isUnread ? '#E4F2EA' : 'transparent'};
  border: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease, opacity 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #d8e9df;
  }

  &:disabled {
    cursor: default;
    opacity: 0.7;
  }
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