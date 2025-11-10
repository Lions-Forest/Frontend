import Layout from "@/components/layout/Layout";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import type { Meeting } from "@/types";
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

function formatMeetingDate(date: Date | string) {
    const d: Date = date instanceof Date ? date : new Date(date as string);
    
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hour = d.getHours();
    const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const weekday = weekdays[d.getDay()];
    
    return `${year}년 ${month}월 ${day}일 ${weekday} ${hour}시`;
}

function index() {
    const location = useLocation();
    const meeting = location.state?.meeting as Meeting | undefined;

    // 참여 멤버들의 photoUrl 배열 (임시로 owner의 photoUrl을 사용, 실제로는 API에서 받아와야 함)
    // TODO: 실제 API에서 참여 멤버들의 정보를 받아와야 함
    const memberPhotos: (string | undefined)[] = [];
    if (meeting) {
        // meeting.memberNumber만큼 photoUrl 할당
        // 실제로는 참여 멤버들의 배열이 필요하지만, 임시로 owner의 photoUrl 사용
        for (let i = 0; i < meeting.memberNumber; i++) {
            memberPhotos.push(meeting.owner.photoUrl);
        }
        // 나머지는 undefined로 채움
        for (let i = meeting.memberNumber; i < meeting.memberLimit; i++) {
            memberPhotos.push(undefined);
        }
    }

    return (
        <Layout page="meeting-detail">
            <DetailLayout>
                {meeting ? (
                    <>
                    <PicInfo>
                            <Picture src="via.placeholder.com"/>
                            <PicDetail>{meeting.title}</PicDetail>
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
                                    <TimeIconStyled width='24px' fill="#2D2D2DC9" opacity='79%'/>
                                    <DetailText>{meeting.startTime} ~ {meeting.endTime}</DetailText>
                                </Detail>
                                <Detail>
                                    <Icon src={distance}/>
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
                                            {memberPhotos.map((photoUrl, index) => (
                                                <Profile key={index} src={photoUrl} />
                                            ))}
                                        </MemberProfiles>
                                        <MemberCount>{meeting.memberNumber} / {meeting.memberLimit}</MemberCount>
                                    </DetailText>
                                </Detail>
                                <EtcText>*모임 시간이 임박하면 모임에 참여 신청한 모임원들의 실명이 공개됩니다.</EtcText>
                            </DetailInfo>
                        </DetailInfoContainer>
                        <Line />
                        {/* <ReviewList review={review}/> */}
                        <Line />
                        {/* <ReplyList /> */}

                        <Buttons>
                            <InfoButton onClose={true} />
                            <InfoButton onReview={true} />
                        </Buttons>
                    </>
                ) : (
                    <NoData>모임 정보를 불러올 수 없습니다.</NoData>
                )}
            </DetailLayout>
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
    display: flex;
    height: 289px;
    padding: 16px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 19px;
    align-self: stretch;
    border-radius: 7px;
    background: #FFF;
`;

const Picture = styled.img`
    width: 315px;
    height: 209px;
    aspect-ratio: 315/209;
`;

const PicDetail = styled.div`
    // height: 19px;
    align-self: stretch;
    color: #000;

    /* Body1/16 */
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
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
    width: 361px;
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
    top: 33.5px;
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

const Profile = styled.img`
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    border-radius: 4px;
    background: ${props => props.src ? 'transparent' : '#848484'};
    object-fit: cover;
    border: 1px solid ${props => props.src ? 'transparent' : '#E2E2E2'};
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
`;

const NoData = styled.div`
    color: #848484;
    font-family: Pretendard;
    font-size: 16px;
    text-align: center;
    padding: 40px;
`;