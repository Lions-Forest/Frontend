import { fetchMeetingList, mapApiResponseToMeeting } from "@/api/meeting/meetingListApi"
import type { Meeting } from "@/types";
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface MeetingStore {
    meetings: Meeting[];
    fetchMeetingList: () => Promise<Meeting[]>;
}

const useMeetingStore = create<MeetingStore>()(
    persist(
        (set, get) => ({
            meetings: [],

            fetchMeetingList: async() => {
                try {
                    const data = await fetchMeetingList();
                    // API 응답이 배열인지 확인
                    const apiMeetings = Array.isArray(data) ? data : [];
                    const meetingList: Meeting[] = apiMeetings.map(mapApiResponseToMeeting);

                    set ({
                        meetings: meetingList,
                    });

                    return meetingList;
                } catch (err) {
                    console.error("전체 모임 데이터 불러오기 실패:", err);
                    return [];
                }
            },
        }),
        {
            name: 'meeting-storage',
        }
    )
);

export default useMeetingStore;