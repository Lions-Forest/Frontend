// 공통 TypeScript 타입 정의
// 예: export interface User { ... }
// 예: export interface Meeting { ... }

export interface Participant {
    id: number,
    meetingId: number,
    userId: number,
    name: string,
    nickname: string,
    date: Date,
    photoUrl?: string,
    detail?: string,
}

export interface Member {
    id: number,
    email: string,
    name: string,
    nickname: string,
    detail: string,
    photoUrl: string,
    // alarm?: number,
}

export interface Meeting {
    id: number,
    title: string,
    // detail: string,
    date: Date,
    type: string,
    // startTime: string, // 타입 변경 가능 
    // endTime: string, // 타입 변경 가능
    location: string,
    owner: Member,
    memberLimit: number,
    memberNumber: number, // 그냥 전달받을 떄 계산해서 넣을까,,? :)
    memberDetail?: Participant,
    complete: boolean, // string으로 바꿔야 함 -> OPEN / CLOSED?
    photo: Array<T>,
}

interface T {
    photoUrl: string,
    order: number,
}

export interface Reply {
    // meeting: Meeting,
    // writer: Member,
    // detail: string,
    // likes: number,
    id: number,
    groupId: number,
    userId: number,
    userName: string,
    content: string,
    likeCount: number,
    createdAt: Date,
}

export interface Review {
    id: number,
    meetingId: number,
    userId: number,
    userName: string,
    userProfile: string,
    detail: string,
    starNumber: number,
    date: Date,
    photo: Array<T>,
    // meeting: Meeting,
    // writer: Member,
    // photoUrl: string,
}