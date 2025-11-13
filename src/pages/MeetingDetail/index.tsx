// TODO: 멤버 클릭할 때 <MemberModal> 띄우기, 프롭스로 익명/실명 전달 로직 구현
// TODO: Reply에 likesPressed 방법 고안 및 구현하기

import Layout from "@/components/layout/Layout";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import type { Meeting, Participant, Reply } from "@/types";
import { MdToday as DateIcon} from "react-icons/md";
import { MdOutlineSchedule as TimeIcon} from "react-icons/md";
import distance from "../../assets/icons/distance.svg"
import { MdAccountCircle as OwnerIcon} from "react-icons/md";
import { MdDiversity3 as MemberIcon} from "react-icons/md";
import background from "../../assets/images/background.png";
import Line from "@/components/common/Line";
import InfoButton from "@/components/common/InfoButton";
import ReviewList from "@/components/features/ReviewList";
import ReplyList from "@/components/features/ReplyList";
import CircleArrow from "@/components/common/CircleArrow";
import { useEffect, useState } from "react";
import { fetchReplyList, submitReply, toggleReplyLikes } from "@/api/meeting/replyApi";
import { fetchParticipantList } from "@/api/meeting/meetingMemberApi";
import MemberModal from "@/components/features/MemberModal";

function formatMeetingDate(date: Date | string) {
    const d: Date = date instanceof Date ? date : new Date(date as string);
    let formattedDate : string = "";
    
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hour = d.getHours();
    const minutes = d.getMinutes();
    const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const weekday = weekdays[d.getDay()];

    if ( hour >= 13 ) {
        if ( minutes !== 0 ) {
            formattedDate = `${year}년 ${month}월 ${day}일 ${weekday} (${hour-12}:${minutes} PM)`
        } else {
            formattedDate = `${year}년 ${month}월 ${day}일 ${weekday} (${hour-12}PM)`
        }
    } else {
        if ( minutes !== 0 ) {
            formattedDate = `${year}년 ${month}월 ${day}일 ${weekday} (${hour}:${minutes} AM)`
        } else {
            formattedDate = `${year}년 ${month}월 ${day}일 ${weekday} (${hour}AM)`
        }        
    }
    
    return formattedDate;
}

function index() {
    const location = useLocation();
    const meeting = location.state?.meeting as Meeting | undefined;
    const remainingTime = location.state?.remainingTime as string;
    const [currentIdx, setCurrentIdx] = useState(0);
  
    const goPrev = () => setCurrentIdx(i => Math.max(0, i - 1));
    const goNext = () => setCurrentIdx(i => Math.min(meeting?.photo.length - 1, i + 1));

    const [ replyList, setReplyList ] = useState<Reply[]>([]);
    const [ participantList, setParticipantList ] = useState<Participant[]>([]);
    const [ selectedParticipant, setSelectedParticipant ] = useState<Participant | null>(null);
  
    useEffect (() => {
      const fetchReplyData = async() => {
        try {
          const replies = await fetchReplyList(meeting?.id || 0);
          console.log("전체 댓글 리스트: ", replies);
          setReplyList(replies);
        } catch (error) {
          console.error("데이터 로딩 실패: ", error);
          setReplyList([]); // 에러 발생 시 빈 배열로 설정
        }
      };
      fetchReplyData();
    }, []);

    useEffect (() => {
        const fetchParticipantData = async() => {
          try {
            const participants = await fetchParticipantList(meeting?.id || 0);
            console.log("전체 참가자 리스트: ", participants);
            setParticipantList(participants);
          } catch (error) {
            console.error("데이터 로딩 실패: ", error);
            setParticipantList([]); // 에러 발생 시 빈 배열로 설정
          }
        };
        fetchParticipantData();
    }, []);

    // 참여 멤버 슬롯 (참가자 정보 포함)
    const memberSlots: (Participant | undefined)[] = meeting
        ? Array.from({ length: meeting.memberLimit }, (_, index) => participantList[index])
        : [];

    const handleMemberClick = (participant?: Participant) => {
        if (!participant) return;
        setSelectedParticipant(participant);
    };

    const handleCloseMemberModal = () => {
        setSelectedParticipant(null);
    };

    // 좋아요 토글 함수
    const handleLikeToggle = async (replyId: number) => {
        await toggleReplyLikes(replyId);
        const replies = await fetchReplyList(meeting?.id || 0);
        setReplyList(replies);
    };

    // 댓글 등록 함수
    const handleReplySubmit = async (text: string) => {
        await submitReply(meeting?.id || 0, text);
        const replies = await fetchReplyList(meeting?.id || 0);
        setReplyList(replies);
    };

    const isAnonymous = (date: Date | string) => {
        const now = new Date();
        const d = date instanceof Date ? date : new Date(date);
        // date가 now보다 과거면 false, 아니면 true
        return d.getTime() >= now.getTime();
      }      

    return (
        <Layout showBackNavBar={true} backNavBarText="소모임" remainingTime={remainingTime}>
            <DetailLayout>
                {meeting ? (
                    <>
                    <PicInfo>
                        <ArrowWrapperLeft>
                            <CircleArrow direction="left" onClick={goPrev} />
                        </ArrowWrapperLeft>
                        <PicHeader>
                            <PicDetail>{meeting.title}</PicDetail>
                        </PicHeader>
                        <Picture 
                            src={
                                meeting.photo && meeting.photo.length > 0
                                ? meeting.photo.find(p => p.order === 0)?.photoUrl || meeting.photo[0].photoUrl
                                : ''} 
                            alt={meeting.title}
                        />
                        <ArrowWrapperRight>
                            <CircleArrow direction="right" onClick={goNext} />
                        </ArrowWrapperRight>
                    </PicInfo>
                        <DetailInfoContainer>
                            <BackgroundImage src={background} alt="background" />
                            <StatusBadge>모집중</StatusBadge>
                            <DetailInfo>
                                <Detail>
                                    <DateIconStyled width='24px' fill="#2D2D2DC9" opacity='79%'/>
                                    <DetailText>
                                        {formatMeetingDate(meeting.date)}
                                    </DetailText>
                                </Detail>
                                <Detail>
                                    <Icon src={distance} />
                                    <DetailText>{meeting.location}</DetailText>
                                </Detail>
                                <Detail>
                                    <OwnerIconStyled width='24px' fill="#2D2D2DC9" opacity='79%'/>
                                    <DetailText> <Profile src={meeting.owner.photoUrl} /> {meeting.owner.name}</DetailText>
                                </Detail>
                                <Detail>
                                    <MemberIconStyled width='24px' fill="#2D2D2DC9" opacity='79%'/>
                                    <DetailText>
                                        <MemberProfiles>
                                            {memberSlots.map((participant, index) => (
                                                <Profile
                                                    key={index}
                                                    src={participant?.photoUrl}
                                                    $clickable={!!participant}
                                                    onClick={() => handleMemberClick(participant)}
                                                />
                                            ))}
                                        </MemberProfiles>
                                        <MemberCount>{meeting.memberNumber} / {meeting.memberLimit}</MemberCount>
                                    </DetailText>
                                </Detail>
                                <EtcText>*모임 시간이 임박하면 모임에 참여 신청한 모임원들의 실명이 공개됩니다.</EtcText>
                            </DetailInfo>
                        </DetailInfoContainer>
                        <Line />
                        <ReviewList groupId={meeting.id}/>
                        <Line />
                        <ReplyList 
                            replies={replyList} 
                            meetingDate={meeting.date} 
                            likesPressed={false}
                            onLikeToggle={handleLikeToggle}
                            onReplySubmit={handleReplySubmit}/>
                        <Buttons>
                            <InfoButton onClose={true} />
                            <InfoButton onReview={true} />
                        </Buttons>
                    </>
                ) : (
                    <NoData>모임 정보를 불러올 수 없습니다.</NoData>
                )}
            </DetailLayout>
            {selectedParticipant && (
                <MemberModal participant={selectedParticipant} onClose={handleCloseMemberModal} anonymous={isAnonymous(meeting.date)} />
            )}
        </Layout>
    )
}

export default index

const DetailLayout = styled.div`
    background: #E4F2EA;
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    padding: 16px;
    gap: 16px;
`;

const PicInfo = styled.div`
    position: relative;
    display: flex;
    height: 287px;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    align-self: stretch;
    border-radius: 7px;
    background: #FFF;
`;

const Picture = styled.img`
    width: 100%;
    // height: 219px;
    height: 100%;
    aspect-ratio: 110/70;
    padding: 14px 16px;
`;

const PicHeader = styled.div`
    width: 100%;
    height: 42px;
    flex-shrink: 0;
    border-radius: 8px 8px 0 0;
    background: #43D687;

    display: flex;
    padding: 0px 20px;
    align-items: center;
    justify-content: flex-start;
`;

const PicDetail = styled.div`
    color: #000;
    font-family: dongleRegular;
    font-size: 22px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
`;

const DetailInfoContainer = styled.div`
    position: relative;
    width: 100%;
    max-width: 361px;
    min-height: 300px;
    border-radius: 7px;
    overflow: hidden;
`;

const BackgroundImage = styled.img`
    position: absolute;
    top: 20px;
    left: 0;
    width: 100%;
    height: 261px;
    // object-fit: cover;
    z-index: 1;
`;

const StatusBadge = styled.div`
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    
    background: #FBBC04;
    color: #FFF;
    font-family: Pretendard;
    font-size: 14px;
    font-weight: 600;
    padding: 6px 16px;
    border-radius: 20px;
    white-space: nowrap;
`;

const DetailInfo = styled.div`
    position: relative;
    top: 45px;
    z-index: 2;
    display: flex;
    width: 100%;
    padding: 33.5px 39px;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
`;

const Detail = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`;

const DateIconStyled = styled(DateIcon)``;
const TimeIconStyled = styled(TimeIcon)``;
const OwnerIconStyled = styled(OwnerIcon)``;
const MemberIconStyled = styled(MemberIcon)``;

const Icon = styled.img`
    width: 14px;
    height: 20.379px;
    flex-shrink: 0;
    aspect-ratio: 14.00/20.38;
    fill: rgba(45, 45, 45, 0.79);
    opacity: 79%;
`;

const DetailText = styled.div`
    color: #000;
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;

    display: flex;
    gap: 8px;
    align-items: center;
`;

const Profile = styled.img<{ $clickable?: boolean }>`
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    border-radius: 4px;
    background: ${props => props.src ? 'transparent' : '#848484'};
    object-fit: cover;
    border: 1px solid ${props => props.src ? 'transparent' : '#E2E2E2'};
    cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
`;

const MemberProfiles = styled.div`
    display: flex;
    gap: 4px;
    align-items: center;
`;

const MemberCount = styled.span`
    margin-left: 8px;
`;

const EtcText = styled.div`
    align-self: stretch;
    color: #A0A0A0;
    text-align: center;
    font-family: Pretendard;
    font-size: 9px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;

    display: flex;
    justify-content: center;
`;

const Buttons = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 9px;
    width: 100%;
    margin: 0px 16px;
`;

const NoData = styled.div`
    color: #848484;
    font-family: Pretendard;
    font-size: 16px;
    text-align: center;
    padding: 40px;
`;

const ArrowWrapperLeft = styled.div`
  position: absolute;
  left: 0px;
  top: 60%;
  transform: translateY(-50%);
  z-index: 3;
  cursor: pointer;
`;

const ArrowWrapperRight = styled.div`
  position: absolute;
  right: 0px;
  top: 60%;
  transform: translateY(-50%);
  z-index: 3;
  cursor: pointer;
`;