// 공통 TypeScript 타입 정의
// 예: export interface User { ... }
// 예: export interface Meeting { ... }

export interface Member {
    id: number,
    email: string;
    name: string,
    nickname: string,
    detail: string;
    photoUrl: string,
    // alarm?: number,
}

export interface Meeting {
    id: number,
    title: string,
    // detail: string,
    date: Date,
    type: string,
    startTime: string, // 타입 변경 가능 
    endTime: string, // 타입 변경 가능
    location: string,
    owner: Member,
    memberLimit: number,
    memberNumber: number, // 그냥 전달받을 떄 계산해서 넣을까,,? :)
    memberDetail?: Member,
    complete: boolean,
}

export interface Reply {
    meeting: Meeting,
    writer: Member,
    detail: string,
    likes: number,
}

export interface Review {
    meeting: Meeting,
    writer: Member,
    photoUrl: string,
    starNumber: number,
    detail: string,
    date: Date,
}