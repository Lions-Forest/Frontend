import DueList from '@/components/common/DueList';
import PreviewCard from '@/components/common/PreviewCard';
import WriteButton from '@/components/common/WriteButton';
import MeetingList from '@/components/features/MeetingList';
import MyMeeting from '@/components/features/MyMeeting';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import Layout from '@/components/layout/Layout';
import type { Meeting, Member } from '@/types';
import React from 'react'
import styled from 'styled-components';

const exampleOwner: Member = {
    id: 0,
    name: '김중앙',
    nickname: '멋쟁이 사자처럼',
    photoUrl: 'blank.com',
}

const exampleMeetings: Meeting[] = [
    {
      id: 1,
      title: "세션 전 함께 저녁 먹어요~",
      date: new Date('2025-12-08T18:30:00'),
      startTime: '18:30',
      endTime: '20:00',
      type: "식사",
      complete: false,
      owner: exampleOwner,
      memberNumber: 4,
      memberLimit: 5,
      location: "양셰프 중앙대점"
    },
    {
      id: 2,
      title: "모각작: 기말 과제 같이 해요!",
      date: new Date('2025-12-12T14:00:00'),
      startTime: '14:00',
      endTime: '17:00',
      type: "모각작",
      complete: false,
      owner: exampleOwner,
      memberNumber: 2,
      memberLimit: 4,
      location: "중앙대 도서관"
    },
    {
      id: 3,
      title: "뮤지컬 보러 갈 분~",
      date: new Date('2025-12-15T19:00:00'),
      startTime: '19:00',
      endTime: '22:00',
      type: "문화예술",
      complete: true,
      owner: exampleOwner,
      memberNumber: 5,
      memberLimit: 5,
      location: "충무아트홀"
    },
    {
      id: 4,
      title: "소모임: JavaScript 친목",
      date: new Date('2025-12-10T15:00:00'),
      startTime: '15:00',
      endTime: '16:00',
      type: "소모임",
      complete: false,
      owner: exampleOwner,
      memberNumber: 4,
      memberLimit: 10,
      location: "스터디룸 A"
    },
    {
      id: 5,
      title: "전시회 함께 관람",
      date: new Date('2025-12-20T13:00:00'),
      startTime: '13:00',
      endTime: '15:00',
      type: "문화예술",
      complete: false,
      owner: exampleOwner,
      memberNumber: 2,
      memberLimit: 4,
      location: "DDP"
    },
    {
      id: 6,
      title: "마감 파티",
      date: new Date('2025-12-11T18:00:00'),
      startTime: '18:00',
      endTime: '21:00',
      type: "기타",
      complete: true,
      owner: exampleOwner,
      memberNumber: 8,
      memberLimit: 10,
      location: "강남역 파티룸"
    }
];
  

function index() {

  const dueMeetings = exampleMeetings.filter(m => {
    // 잔여 인원 1명일 경우
    const isNearlyFull = (m.memberLimit - m.memberNumber) === 1;
  
    // 마감 1시간 이하 남은 경우
    const diffMs = (new Date(m.date)).getTime() - new Date().getTime();
    const isOneHourLeft = diffMs > 0 && diffMs <= 60 * 60 * 1000; // 0 < diff <= 1시간
  
    return isNearlyFull || isOneHourLeft;
  });  

    return (
      <Layout>
        <HomeLayout>
            <MyMeeting />
            <Line />
            <MeetingList meetings={exampleMeetings} />
            <Line />
            <DueList meetings={dueMeetings}/>
            <WriteButton />
        </HomeLayout>
      </Layout>
    )
}

export default index;

const HomeLayout = styled.div`
    background: #E4F2EA;
    width: 100%;
    height: auto;
    // overflow: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px;
    gap: 16px;
`;

const Line = styled.div`
    width: 361px;
    height: 2px;
    background: #E2E2E2;
`;