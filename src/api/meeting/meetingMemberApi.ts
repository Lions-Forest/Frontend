import type { Member, Participant } from "@/types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// API 응답 타입 정의 (실제 API 응답 구조에 맞게 수정 필요)
interface ApiParticipantResponse {
    id: number,
    groupId: number,
    userId: number,
    userName: string,
    userNickname: string,
    createdAt: Date,
    profilePhotoUrl?: string,
}

interface ApiMemberResponse {
    id: number,
    name?: string,
    email?: string,
    nickname?: string,
    bio?: string | null,
    profilePhotoUrl?: string | null,
}

export async function fetchParticipantList(group_id : number) {
    try {
      const token = localStorage.getItem('accessToken');
      
      // 헤더 설정
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      // 토큰이 있으면 Authorization 헤더 추가
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const url = `${BASE_URL}/api/participation/${group_id}/`;
      console.log("요청 URL:", url);
      console.log("BASE_URL:", BASE_URL);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
      });

      console.log("API Response Status:", response.status);
      console.log("API Response URL:", response.url);

      // 응답 본문을 텍스트로 먼저 읽기 (JSON인지 확인하기 위해)
      const responseText = await response.text();
      
      // 응답이 JSON인지 확인
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error("응답이 JSON이 아닙니다. 응답 내용:", responseText.substring(0, 500));
        throw new Error(`서버가 JSON이 아닌 응답을 반환했습니다. (${response.status})`);
      }

      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(`서버 에러: ${response.status} - ${JSON.stringify(errorData)}`);
        } catch {
          throw new Error(`서버 에러: ${response.status} - ${responseText.substring(0, 200)}`);
        }
      }

      // JSON 파싱
      const data = JSON.parse(responseText);
      console.log("API Data:", data);
      
      // 응답이 배열인지 확인
      if (!Array.isArray(data)) {
        console.warn("API 응답이 배열이 아닙니다:", data);
        return [];
      }
      
      return data.map((item) => mapApiResponseToParticipant(item as ApiParticipantResponse));
    } catch (err) {
      console.error("유저 데이터 불러오기 에러:", err);
      return [];
    }
}

export async function fetchParticipantDetail(user_id : number): Promise<Member | Member[] | null> {
    try {
      const token = localStorage.getItem('accessToken');
      
      // 헤더 설정
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      // 토큰이 있으면 Authorization 헤더 추가
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const url = `${BASE_URL}/api/users/${user_id}`;
      console.log("요청 URL:", url);
      console.log("BASE_URL:", BASE_URL);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
      });

      console.log("API Response Status:", response.status);
      console.log("API Response URL:", response.url);

      // 응답 본문을 텍스트로 먼저 읽기 (JSON인지 확인하기 위해)
      const responseText = await response.text();
      
      // 응답이 JSON인지 확인
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error("응답이 JSON이 아닙니다. 응답 내용:", responseText.substring(0, 500));
        throw new Error(`서버가 JSON이 아닌 응답을 반환했습니다. (${response.status})`);
      }

      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(`서버 에러: ${response.status} - ${JSON.stringify(errorData)}`);
        } catch {
          throw new Error(`서버 에러: ${response.status} - ${responseText.substring(0, 200)}`);
        }
      }

      // JSON 파싱
      const data = JSON.parse(responseText) as ApiMemberResponse | ApiMemberResponse[];
      console.log("Participant Member Data:", data);

      if (Array.isArray(data)) {
        return data
          .map((item) => (item ? mapApiResponseToMember(item) : null))
          .filter((item): item is Member => item !== null);
      }

      return mapApiResponseToMember(data);
    } catch (err) {
      console.error("유저 데이터 불러오기 에러:", err);
      return null;
    }
}

// API 응답을 Meeting 타입으로 변환하는 함수
export function mapApiResponseToParticipant(apiParticipant: ApiParticipantResponse): Participant {

    // date를 Date 객체로 변환
    const participantDate = new Date(apiParticipant.createdAt);

    // photos 배열 변환
    // const photos = apiParticipant.photos || [];

    return {
        id: apiParticipant.id,
        meetingId: apiParticipant.groupId,
        userId: apiParticipant.userId,
        name: apiParticipant.userName,
        nickname: apiParticipant.userNickname,
        date: participantDate,
        photoUrl: apiParticipant.profilePhotoUrl || '',
    };
}

export function mapApiResponseToMember(apiMember: ApiMemberResponse | null | undefined): Member {
    return {
        id: apiMember?.id ?? 0,
        email: apiMember?.email ?? "",
        name: apiMember?.name ?? "",
        nickname: apiMember?.nickname ?? "",
        detail: apiMember?.bio ?? "",
        photoUrl: apiMember?.profilePhotoUrl ?? "",
        // alarm?: number,
    };
}