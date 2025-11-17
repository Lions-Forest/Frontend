import { fetchMyMeetingList } from '@/api/meeting/meetingJoinApi';
import DueList from '@/components/common/DueList';
import Line from '@/components/common/Line';
import PreviewCard from '@/components/common/PreviewCard';
import WriteButton from '@/components/common/WriteButton';
import HomeReviewList from '@/components/features/HomeReviewList';
import MeetingList from '@/components/features/MeetingList';
import MyMeeting from '@/components/features/MyMeeting';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import Layout from '@/components/layout/Layout';
import useMeetingStore from '@/store/meetingStore';
import type { Meeting, Member } from '@/types';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components';

function index() {
  const [ meetingList, setMeetingList ] = useState<Meeting[]>([]);
  const [ myMeetingList, setMyMeetingList ] = useState<Meeting[]>([]);
  const { fetchMeetingList } = useMeetingStore();
  const [loading, setLoading] = useState(false);

  // 전체 + 나의 모임 리스트 재로딩 함수
  const reloadHomeData = async () => {
    try {
      setLoading(true);
      const meetings = await fetchMeetingList();
      console.log("전체 모임 리스트: ", meetings);
      setMeetingList(meetings);
    } catch (error) {
      console.error("데이터 로딩 실패: ", error);
      setMeetingList([]);
    } finally {
      setLoading(false);
    }

    try {
      const myMeetings = await fetchMyMeetingList();
      console.log("나의 모임 리스트: ", myMeetings);
      setMyMeetingList(myMeetings);
    } catch (error) {
      console.error("데이터 로딩 실패: ", error);
      setMyMeetingList([]);
    }
  };

  // 최초 1회 로딩
  useEffect(() => {
    reloadHomeData();
  }, []);

  const dueMeetings = meetingList.filter((m) => {
    if (m.complete) return false;
    const isNearlyFull = m.memberLimit - m.memberNumber === 1;
    const diffMs = new Date(m.date).getTime() - new Date().getTime();
    const isOneHourLeft = diffMs > 0 && diffMs <= 60 * 60 * 1000; // 0 < diff <= 1시간

    return isNearlyFull || isOneHourLeft;
  });

  return (
    <Layout>
      <HomeLayout>
        {loading ? (
          <LoadingText>로딩 중...</LoadingText>
        ) : (
          <>
            <MyMeeting meetings={myMeetingList}/>
            <Line />
            <MeetingList meetings={meetingList} onChange={reloadHomeData} />
            <Line />
            <DueList meetings={dueMeetings} />
            <Line />
            <HomeReviewList />
          </>
        )}
        <WriteButton />
      </HomeLayout>
    </Layout>
  );
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

const LoadingText = styled.div`
    font-family: dongleRegular;
    font-size: 40px;
    color: #848484;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
    display: flex;
    width: 100%;
    height: 100vh;
    align-items: center;
    justify-content: center;
`;
