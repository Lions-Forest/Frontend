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
    date: Date,
    type: string,
    location: string,
    owner?: Member,
    ownerId?: number,
    ownerName?: string,
    ownerNickname?: string,
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
    detail: string,
    likes: number,
    createdAt: Date,
    photoUrl?: string,
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
    meetingTitle: string,
    meetingDate: Date,
    // meeting: Meeting,
    // writer: Member,
    // photoUrl: string,
}