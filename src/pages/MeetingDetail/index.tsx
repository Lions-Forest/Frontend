import Layout from "@/components/layout/Layout";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import type { Meeting, Participant, Reply } from "@/types";
import { MdToday as DateIcon} from "react-icons/md";
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
import { fetchMeetingDetail } from "@/api/meeting/meetingListApi";
import { cancelJoinMeeting, deleteMeeting, joinMeeting } from "@/api/meeting/meetingJoinApi";
import defaultProfile from '../../assets/images/LoadingLion.svg'
import CheckingModal from "@/components/features/CheckingModal";

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
        if ( minutes !== 0 ) formattedDate = `${year}년 ${month}월 ${day}일 ${weekday} (${hour-12}:${minutes} PM)`
        else formattedDate = `${year}년 ${month}월 ${day}일 ${weekday} (${hour-12}PM)`
    } else {
        if ( minutes !== 0 ) formattedDate = `${year}년 ${month}월 ${day}일 ${weekday} (${hour}:${minutes} AM)`
        else formattedDate = `${year}년 ${month}월 ${day}일 ${weekday} (${hour}AM)`        
    }
    
    return formattedDate;
}

function index() {
    const location = useLocation();
    const initialMeeting = location.state?.meeting as Meeting | undefined;
    const remainingTime = location.state?.remainingTime as string;
    const timeText = location.state?.timeText as string;
    const [meeting, setMeeting] = useState<Meeting | undefined>(initialMeeting);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [showModal, setShowModal] = useState(false);

    const now = new Date();
  
    // const goPrev = () => setCurrentIdx(i => Math.max(0, i - 1));
    // const goNext = () => setCurrentIdx(i => Math.min(meeting?.photo.length - 1, i + 1));
    const goPrev = () => setCurrentIdx(i => Math.max(0, i - 1));
    const goNext = () => {
        setCurrentIdx(i => {
            const maxIdx = Math.max((meeting?.photo?.length ?? 1) - 1, 0);
            return Math.min(maxIdx, i + 1);
        });
    };
    
    const [ replyList, setReplyList ] = useState<Reply[]>([]);
    const [ participantList, setParticipantList ] = useState<Participant[]>([]);
    const [ selectedParticipant, setSelectedParticipant ] = useState<Participant | null>(null);
    const [ joinState, setJoinState ] = useState<'join' | 'cancel'>('join');

    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    const isOwner = (meeting?.owner && Number(userId) === meeting.owner.id) || (meeting?.ownerId && Number(userId) === meeting.ownerId) ? true : false;

    const handleDelete = async () => {
        if (!meeting?.id) return;

        try {
            await deleteMeeting(meeting.id);
            setJoinState('cancel');
            navigate('/home');
        } catch(e) {
            console.log("handleDelete 함수 실패: ", e);
        }
    }

    const handleJoin = async () => {
        if (!meeting?.id) return;

        try {
            await joinMeeting(meeting.id);
            setJoinState('cancel');

            const meetingDetail = await fetchMeetingDetail(meeting.id);
            console.log("해당 모임 정보: ", meetingDetail);
            if (meetingDetail) {
                setMeeting(meetingDetail);
            }
            
            const participants = await fetchParticipantList(meeting.id);
            console.log("전체 참가자 리스트: ", participants);
            setParticipantList(participants);

        } catch(e) {
            console.log("handleJoin 함수 실패: ", e);
        }
    }

    const handleJoinCancel = async () => {
        if (!meeting?.id) return;

        try {
            await cancelJoinMeeting(meeting.id);
            setJoinState('join');

            const meetingDetail = await fetchMeetingDetail(meeting.id);
            console.log("해당 모임 정보: ", meetingDetail);
            if (meetingDetail) {
                setMeeting(meetingDetail);
            }
            
            const participants = await fetchParticipantList(meeting.id);
            console.log("전체 참가자 리스트: ", participants);
            setParticipantList(participants);

        } catch(e) {
            console.log("handleJoin 함수 실패: ", e);
        }
    }
  
    // 해당 모임 댓글 정보 불러오기
    useEffect (() => {
      const fetchReplyData = async() => {
        if (!meeting?.id) return;
        try {
          const replies = await fetchReplyList(meeting.id);
          console.log("전체 댓글 리스트: ", replies);
          setReplyList(replies);
        } catch (error) {
          console.error("데이터 로딩 실패: ", error);
          setReplyList([]); // 에러 발생 시 빈 배열로 설정
        }
      };
      fetchReplyData();
    }, [meeting?.id]);

    // 해당 모임 참가자 정보 불러오기
    useEffect (() => {
        const fetchParticipantData = async() => {
          if (!meeting?.id) return;
          try {
            const participants = await fetchParticipantList(meeting.id);
            console.log("전체 참가자 리스트: ", participants);
            setParticipantList(participants);

            // 나의 참여 여부 확인하기
            const myUserId = Number(localStorage.getItem("userId"));
            const isJoined = participants.some(p => Number(p.userId) === myUserId);
            if (isJoined) setJoinState('cancel');
            else setJoinState('join');
          } catch (error) {
            console.error("데이터 로딩 실패: ", error);
            setParticipantList([]);
            setJoinState('join');
          }
        };
        fetchParticipantData();
    }, [meeting?.id]);

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

    // 익명 처리 함수
    const isAnonymous = (date: Date | string) => {
        const d = date instanceof Date ? date : new Date(date);
        // date가 now보다 과거면 false, 아니면 true
        return d.getTime() >= now.getTime();
    };

    return (
        <Layout showBackNavBar={true} backNavBarText="소모임" remainingTime={remainingTime || timeText}>
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
                            <StatusBadge $isComplete={meeting.complete}>{meeting.complete ? '모집 완료' : '모집중'}</StatusBadge>
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
                                    <DetailText> 
                                        <Profile 
                                            src={isAnonymous(meeting.date) ? defaultProfile : (participantList[0]?.photoUrl || '')}
                                            $clickable={!!participantList && participantList.length > 0}
                                            onClick={() => participantList[0] && handleMemberClick(participantList[0])}
                                        /> 
                                        {isAnonymous(meeting.date) ? (meeting.owner?.nickname || meeting.ownerNickname || '') : (meeting.owner?.name || meeting.ownerName || '')}
                                    </DetailText>
                                </Detail>
                                <Detail>
                                    <MemberIconStyled width='24px' fill="#2D2D2DC9" opacity='79%'/>
                                    <DetailText>
                                        <MemberProfiles>
                                            {memberSlots.map((participant, index) => (
                                                <Profile
                                                    key={index}
                                                    src={!participant ? '' : (isAnonymous(meeting.date) ? defaultProfile : participant?.photoUrl)}
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
                            likesPressed={[]}
                            onLikeToggle={handleLikeToggle}
                            onReplySubmit={handleReplySubmit}/>
                        <Buttons>
                            {isAnonymous(meeting.date) ? (
                                meeting.memberNumber === meeting.memberLimit ? (
                                    <InfoButton onClose={true} />
                                ) : (
                                    joinState === 'join' ? (
                                        isOwner === true ? (
                                            <InfoButton onMakeCancel={true} onClick={() => setShowModal(true)} />
                                        ) : (
                                            <InfoButton onJoin={true} onClick={handleJoin}/>
                                        )
                                    ) : (
                                        <InfoButton onJoinCancel={true} onClick={handleJoinCancel} />
                                    )
                                )
                            ) : (
                            <>
                                <InfoButton onClose={true} />
                                <InfoButton onReview={true} />
                            </>
                            )}
                        </Buttons>
                    </>
                ) : (
                    <NoData>모임 정보를 불러올 수 없습니다.</NoData>
                )}
            </DetailLayout>
            {selectedParticipant && meeting && (
                <MemberModal participant={selectedParticipant} onClose={handleCloseMemberModal} anonymous={isAnonymous(meeting.date)} />
            )}
            {showModal && (
                <CheckingModal onClick={handleDelete} onClose={() => setShowModal(false)} />
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
    object-fit: scale-down;
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

const StatusBadge = styled.div<{ $isComplete: boolean }>`
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    
    background: ${({ $isComplete }) => ($isComplete ? '#848484' : '#FBBC04')};
    color: #FFF;
    font-family: dongleLight;
    font-size: 20px;
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
    background: ${({ $clickable }) => ($clickable ? '#fff' : '#D9D9D9')};
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