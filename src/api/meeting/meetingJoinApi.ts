import type { Meeting } from "@/types";
import { mapApiResponseToMeeting, type ApiMeetingResponse } from "./meetingListApi";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function joinMeeting(group_id: number) {
    try {
      const token = localStorage.getItem('accessToken');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
  
      const response = await fetch(`${BASE_URL}/api/participation/${group_id}/`, {
        method: 'POST',
        headers,
      });
  
      if (!response.ok) {
        throw new Error(`서버 에러: ${response.status}`);
      }
  
      return await response.json();
    } catch (e) {
      console.error('모임 참여 실패:', e);
      return null;
    }
}

export async function cancelJoinMeeting(group_id: number) {
    try {
      const token = localStorage.getItem('accessToken');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
  
      const response = await fetch(`${BASE_URL}/api/participation/${group_id}/`, {
        method: 'DELETE',
        headers,
      });
  
      if (!response.ok) {
        throw new Error(`서버 에러: ${response.status}`);
      }

      const responseText = await response.text();
      console.log("API Data:", responseText);
  
      return null;
    } catch (e) {
      console.error('모임 취소 실패:', e);
      return null;
    }
}

export async function fetchMyMeetingList() {
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

      const url = `${BASE_URL}/api/participation/my/`;
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
      
      // Meeting 타입으로 변환
      return data.map((item) => mapApiResponseToMeeting(item as ApiMeetingResponse)) as Meeting[];
    } catch (err) {
      console.error("유저 데이터 불러오기 에러:", err);
      return [];
    }
}

export async function deleteMeeting(group_id: number) {
  try {
    const token = localStorage.getItem('accessToken');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}/api/groups/${group_id}/`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error(`서버 에러: ${response.status}`);
    }

    const responseText = await response.text();
    console.log("API Data:", responseText);

    return null;
  } catch (e) {
    console.error('모임 취소 실패:', e);
    return null;
  }
}