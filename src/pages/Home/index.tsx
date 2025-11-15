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

  // 전체 모임 리스트 가져오기
  useEffect(() => {
    const fetchData = async() => {
      try {
        const meetings = await fetchMeetingList();
        console.log("전체 모임 리스트: ", meetings);
        setMeetingList(meetings);
      } catch (error) {
        console.error("데이터 로딩 실패: ", error);
        setMeetingList([]);
      }
    };
    fetchData();
  }, []);

  // 내가 참여한 모임 리스트 가져오기
  useEffect(() => {
    const fetchMyData = async() => {
      try {
        const myMeetings = await fetchMyMeetingList();
        console.log("나의 모임 리스트: ", myMeetings);
        setMyMeetingList(myMeetings);
      } catch (error) {
        console.error("데이터 로딩 실패: ", error);
        setMyMeetingList([]);
      }
    };
    fetchMyData();
  }, []);

  const dueMeetings = meetingList.filter((m) => {
    const isNearlyFull = m.memberLimit - m.memberNumber === 1;
    const diffMs = new Date(m.date).getTime() - new Date().getTime();
    const isOneHourLeft = diffMs > 0 && diffMs <= 60 * 60 * 1000; // 0 < diff <= 1시간

    return isNearlyFull || isOneHourLeft;
  });

  return (
    <Layout>
      <HomeLayout>
        <MyMeeting meetings={myMeetingList}/>
        <Line />
        <MeetingList meetings={meetingList} />
        <Line />
        <DueList meetings={dueMeetings} />
        <Line />
        <HomeReviewList />
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
