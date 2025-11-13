import type { Meeting, Member } from "@/types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.lions-forest.p-e.kr';

// API 응답 타입 정의 (실제 API 응답 구조에 맞게 수정 필요)
interface ApiMeetingResponse {
    id: number;
    leaderId: number;
    leaderNickname: string;
    leaderName?: string;
    title: string;
    category: string;
    capacity: number;
    meetingAt: Date; // ISO date string
    location: string;
    state: string; // "OPEN" | "CLOSED" 또는 boolean
    // participation?: number;
    participantCount: number;
    photos?: Array<{ photoUrl: string; order: number }>;
    // leaderPhotoUrl?: string;
}

export async function fetchMeetingList() {
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

      const url = `${BASE_URL}/api/groups/`;
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
      
      return data;
    } catch (err) {
      console.error("유저 데이터 불러오기 에러:", err);
      return [];
    }
}

// API 응답을 Meeting 타입으로 변환하는 함수
function convertCategory(type: string | undefined): string {
    switch (type) {
        case 'MEAL':
            return '식사';
        case 'WORK':
            return '모각작';
        case 'SOCIAL':
            return '소모임';
        case 'CULTURE':
            return '문화예술';
        case 'ETC':
            return '기타';
        default:
            return type || '기타';
    }
}

function normalizePhotos(rawPhotos: unknown): Array<{ photoUrl: string; order: number }> {
    if (!Array.isArray(rawPhotos)) {
        return [];
    }

    return rawPhotos.map((photo, index) => {
        if (typeof photo === 'object' && photo !== null) {
            const typed = photo as Record<string, unknown>;
            const photoUrl =
                typeof typed.photoUrl === 'string'
                    ? typed.photoUrl
                    : typeof typed.url === 'string'
                        ? typed.url
                        : typeof typed.photo === 'string'
                            ? typed.photo
                            : '';
            const order =
                typeof typed.order === 'number'
                    ? typed.order
                    : typeof typed.sequence === 'number'
                        ? typed.sequence
                        : index;
            return { photoUrl, order };
        }

        return { photoUrl: '', order: index };
    });
}

function normalizeOwner(raw: unknown, fallbackNickname?: string): Member {
    if (raw && typeof raw === 'object') {
        const owner = raw as Record<string, unknown>;
        const name =
            typeof owner.name === 'string'
                ? owner.name
                : typeof owner.nickname === 'string'
                    ? owner.nickname
                    : fallbackNickname || '';

        return {
            id: typeof owner.id === 'number'
                ? owner.id
                : typeof owner.userId === 'number'
                    ? owner.userId
                    : 0,
            email: typeof owner.email === 'string' ? owner.email : '',
            name,
            nickname: typeof owner.nickname === 'string' ? owner.nickname : name,
            detail: typeof owner.detail === 'string' ? owner.detail : '',
            photoUrl:
                typeof owner.photoUrl === 'string'
                    ? owner.photoUrl
                    : typeof owner.profileImageUrl === 'string'
                        ? owner.profileImageUrl
                        : '',
        };
    }

    return {
        id: 0,
        email: '',
        name: fallbackNickname || '',
        nickname: fallbackNickname || '',
        detail: '',
        photoUrl: '',
    };
}

export function mapApiResponseToMeeting(apiMeeting: ApiMeetingResponse): Meeting {
  // owner 객체 생성 // TODO: id 받아와서 member랑 매칭시키기
  const owner: Member = {
      id: apiMeeting.leaderId,
      email: "", // API에서 제공하지 않으면 빈 문자열
      name: apiMeeting.leaderName || apiMeeting.leaderNickname,
      nickname: apiMeeting.leaderNickname,
      detail: "",
      photoUrl: "",
  };

  // state를 boolean으로 변환 (API가 "OPEN"/"CLOSED" 문자열이면)
  const isComplete = typeof apiMeeting.state === 'string' 
      ? apiMeeting.state !== 'OPEN' 
      : !apiMeeting.state;

  // date를 Date 객체로 변환
  const meetingDate = new Date(apiMeeting.meetingAt);

  // photos 배열 변환
  const photos = apiMeeting.photos || [];

  // category를 UI type에 맞게 반환
  const convertType = ( type : string ) => {
    let meetingType : string = '';
  
    if (type === 'MEAL') meetingType = '식사';
    else if (type === 'WORK') meetingType = '모각작';
    else if (type === 'SOCIAL') meetingType = '소모임';
    else if (type === 'CULTURE') meetingType = '문화예술';
    else meetingType = '기타';
  
    return meetingType;
  }

  return {
      id: apiMeeting.id,
      title: apiMeeting.title,
      date: meetingDate,
      type: convertType(apiMeeting.category),
      location: apiMeeting.location,
      owner: owner,
      memberLimit: apiMeeting.capacity,
      memberNumber: apiMeeting.participantCount || 0,
      complete: isComplete,
      photo: photos,
  };
}

// function normalizeMeetingResponse(rawMeeting: any): Meeting {
//     const meetingId = rawMeeting?.id || 0;
//     const meetingDateSource =
//         rawMeeting?.meetingAt ||
//         rawMeeting?.meetingDate ||
//         rawMeeting?.date ||
//         rawMeeting?.startAt ||
//         rawMeeting?.scheduledAt;
//     const meetingDate = meetingDateSource ? new Date(meetingDateSource) : new Date();

//     const owner =
//         normalizeOwner(
//             rawMeeting?.owner ||
//             rawMeeting?.leader ||
//             rawMeeting?.leaderInfo ||
//             rawMeeting?.host,
//             typeof rawMeeting?.leaderNickname === 'string' ? rawMeeting.leaderNickname : undefined,
//         );

//     const memberLimit =
//         typeof rawMeeting?.capacity === 'number'
//             ? rawMeeting.capacity
//             : typeof rawMeeting?.memberLimit === 'number'
//                 ? rawMeeting.memberLimit
//                 : typeof rawMeeting?.limit === 'number'
//                     ? rawMeeting.limit
//                     : typeof rawMeeting?.maxParticipants === 'number'
//                         ? rawMeeting.maxParticipants
//                     : 0;

//     const participantCount =
//         typeof rawMeeting?.participantCount === 'number'
//             ? rawMeeting.participantCount
//             : typeof rawMeeting?.memberNumber === 'number'
//                 ? rawMeeting.memberNumber
//                 : Array.isArray(rawMeeting?.participants)
//                     ? rawMeeting.participants.length
//                     : 0;

//     const state = rawMeeting?.state ?? rawMeeting?.status ?? rawMeeting?.complete;

//     return {
//         id: meetingId,
//         title: rawMeeting?.title ?? '',
//         date: meetingDate,
//         type: convertCategory(
//             typeof rawMeeting?.category === 'string' ? rawMeeting.category : rawMeeting?.type,
//         ),
//         location: rawMeeting?.location ?? rawMeeting?.place ?? '',
//         owner,
//         memberLimit,
//         memberNumber: participantCount,
//         memberDetail: rawMeeting?.memberDetail,
//         complete:
//             typeof state === 'string'
//                 ? state !== 'OPEN'
//                 : typeof state === 'boolean'
//                     ? state
//                     : false,
//         photo: normalizePhotos(rawMeeting?.photos || rawMeeting?.photo || []),
//     };
// }

// export function mapApiResponseToMeeting(apiMeeting: ApiMeetingResponse): Meeting {
//     return normalizeMeetingResponse(apiMeeting);
// }

export async function fetchMeetingDetail(group_id : number) {
    try {
      const token = localStorage.getItem('accessToken');
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${BASE_URL}/api/groups/${group_id}/`, {
        method: 'GET',
        headers: headers,
      });

      const responseText = await response.text();
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error("응답이 JSON이 아닙니다:", responseText.substring(0, 500));
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
      
      const data = JSON.parse(responseText);
      return mapApiResponseToMeeting(data);
    } catch (err) {
      console.error("모임 상세 데이터 불러오기 에러:", err);
      return null;
    }
}
