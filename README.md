# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

# 프로젝트 구조 설명

이 문서는 chungKerTon 프로젝트의 폴더 구조와 각 파일의 역할에 대해 설명합니다.

## 📁 전체 구조

```
src/
├── api/              # API 통신 관련
├── assets/           # 정적 리소스
├── components/       # React 컴포넌트
├── constants/        # 상수 정의
├── hooks/            # 커스텀 훅
├── pages/            # 페이지 컴포넌트
├── store/            # 전역 상태 관리 (Zustand)
├── styles/           # 전역 스타일
├── types/            # TypeScript 타입 정의
├── utils/            # 유틸리티 함수
├── App.tsx           # 최상위 App 컴포넌트
└── main.tsx          # 앱 진입점
```

---

## 📂 상세 설명

### `/api` - API 통신

서버와의 통신을 담당하는 폴더입니다.

- **`client.ts`**: Axios 인스턴스를 생성하고 인터셉터를 설정합니다.
  - 기본 URL, 타임아웃 설정
  - 요청/응답 인터셉터 (인증 토큰 처리, 에러 처리 등)
- **`types.ts`**: API 응답과 에러에 대한 공통 타입을 정의합니다.
- **`services/`**: 각 도메인별 API 서비스 함수들을 작성합니다.
  - 예: `meetingService.ts`, `userService.ts` 등
  - 각 서비스는 `client.ts`의 인스턴스를 사용합니다.

**사용 예시:**
```typescript
// services/meetingService.ts
import apiClient from '@/api/client';
import { ApiResponse } from '@/api/types';

export const getMeetingList = () => {
  return apiClient.get<ApiResponse<Meeting[]>>('/meetings');
};
```

---

### `/assets` - 정적 리소스

이미지, 폰트, 아이콘 등 정적 파일을 저장합니다.

- **`images/`**: 이미지 파일 (png, jpg, svg 등)
- **`fonts/`**: 폰트 파일 (woff, woff2, ttf 등)
- **`icons/`**: 아이콘 파일

**사용 예시:**
```typescript
import logoImage from '@/assets/images/logo.png';
```

---

### `/components` - React 컴포넌트

재사용 가능한 컴포넌트를 기능에 따라 분류합니다.

#### `/components/common`
프로젝트 전반에서 사용하는 공통 컴포넌트입니다.
- 예: `Button.tsx`, `Input.tsx`, `Modal.tsx`, `Card.tsx` 등

#### `/components/layout`
레이아웃 관련 컴포넌트입니다.
- 예: `Header.tsx`, `Footer.tsx`, `Sidebar.tsx`, `Layout.tsx` 등

#### `/components/features`
특정 기능에 특화된 컴포넌트입니다.
- 예: `MeetingCard.tsx`, `MapMarker.tsx`, `UserProfile.tsx` 등

**네이밍 규칙:**
- 파일명은 PascalCase 사용 (예: `MeetingCard.tsx`)
- 컴포넌트명과 파일명 일치 권장

---

### `/constants` - 상수 정의

프로젝트 전반에서 사용하는 상수값들을 정의합니다.

- API 엔드포인트 URL
- 기본값, 설정값
- 메시지 텍스트 등

**사용 예시:**
```typescript
// constants/index.ts
export const API_ENDPOINTS = {
  MEETINGS: '/api/meetings',
  USERS: '/api/users',
} as const;

export const DEFAULT_VALUES = {
  MAX_PARTICIPANTS: 20,
  MEETING_DURATION: 120, // 분
} as const;
```

---

### `/hooks` - 커스텀 훅

재사용 가능한 로직을 커스텀 훅으로 작성합니다.

- 예: `useGeolocation.ts`, `useMeetingList.ts`, `useDebounce.ts` 등
- React의 기본 훅을 조합하여 비즈니스 로직을 캡슐화합니다.

**사용 예시:**
```typescript
// hooks/useGeolocation.ts
export const useGeolocation = () => {
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null);
  // ... 로직
  return { location, error };
};

// 다른 컴포넌트에서 사용
const { location } = useGeolocation();
```

---

### `/pages` - 페이지 컴포넌트

라우팅에 사용되는 페이지 단위 컴포넌트입니다.

- 각 페이지는 폴더로 구성하고, 폴더명과 컴포넌트명은 일치시킵니다.
- 예: `Home/index.tsx`, `MeetingCreate/index.tsx`, `MeetingDetail/index.tsx` 등

**구조 예시:**
```
pages/
├── Home/
│   └── index.tsx
├── MeetingCreate/
│   └── index.tsx
└── MeetingDetail/
    └── index.tsx
```

---

### `/store` - 전역 상태 관리

Zustand를 사용한 전역 상태 관리 폴더입니다.

- **`index.ts`**: 모든 스토어 모듈을 통합하여 export합니다.
- **`modules/`**: 각 기능별 스토어를 모듈로 분리합니다.
  - 예: `meetingStore.ts`, `userStore.ts`, `mapStore.ts` 등

**사용 예시:**
```typescript
// store/modules/meetingStore.ts
import { create } from 'zustand';

interface MeetingState {
  meetings: Meeting[];
  setMeetings: (meetings: Meeting[]) => void;
}

export const useMeetingStore = create<MeetingState>((set) => ({
  meetings: [],
  setMeetings: (meetings) => set({ meetings }),
}));

// 컴포넌트에서 사용
const { meetings, setMeetings } = useMeetingStore();
```

---

### `/styles` - 전역 스타일

styled-components를 사용한 전역 스타일 정의입니다.

- **`global.ts`**: `createGlobalStyle`로 작성된 전역 스타일입니다.
  - 리셋 CSS, 기본 폰트, 기본 레이아웃 등

**참고:** 각 컴포넌트의 스타일은 해당 컴포넌트 파일 내부에 styled-components로 작성합니다.

---

### `/types` - TypeScript 타입 정의

공통으로 사용되는 TypeScript 타입과 인터페이스를 정의합니다.

- 도메인 모델 타입 (User, Meeting 등)
- 유틸리티 타입
- 공통 타입 정의

**사용 예시:**
```typescript
// types/index.ts
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Meeting {
  id: string;
  title: string;
  location: Location;
  participants: User[];
  createdAt: Date;
}
```

---

### `/utils` - 유틸리티 함수

순수 함수 형태의 유틸리티 함수들을 작성합니다.

- 날짜 포맷팅, 거리 계산, 문자열 처리 등
- 비즈니스 로직과 무관한 순수 함수들

**사용 예시:**
```typescript
// utils/date.ts
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('ko-KR').format(date);
};

// utils/geo.ts
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  // 하버사인 공식 등
};
```

---

## 🔧 설정 파일

### `/vite.config.ts`
Vite 빌드 설정 파일입니다.
- 플러그인 설정 (React, PWA 등)
- 절대 경로 alias 설정 (`@/` → `src/`)

### `/tsconfig.json`, `/tsconfig.app.json`
TypeScript 컴파일러 설정 파일입니다.
- 절대 경로 alias 타입 인식
- 컴파일 옵션 설정

---

## 📝 파일 네이밍 규칙

- **컴포넌트**: PascalCase (예: `MeetingCard.tsx`)
- **유틸/훅**: camelCase (예: `formatDate.ts`, `useGeolocation.ts`)
- **상수**: UPPER_SNAKE_CASE (예: `API_ENDPOINTS.ts`)
- **스토어**: camelCase (예: `meetingStore.ts`)

---

## 🎯 절대 경로 사용

모든 import는 절대 경로(`@/`)를 사용합니다.

**예시:**
```typescript
// ✅ 좋은 예
import Button from '@/components/common/Button';
import { useMeetingStore } from '@/store/modules/meetingStore';
import { formatDate } from '@/utils/date';

// ❌ 나쁜 예
import Button from '../../../components/common/Button';
```

---

## 🔄 협업 시 주의사항

1. **컴포넌트 분류**: `common`, `layout`, `features`로 명확히 구분하여 충돌 방지
2. **스토어 모듈화**: 각 기능별로 스토어를 분리하여 관리
3. **타입 정의**: 공통 타입은 `/types`에, API 타입은 `/api/types`에 정의
4. **커밋 전**: ESLint 검사 및 타입 체크 수행

---

## 📚 주요 라이브러리

- **React** + **TypeScript**: UI 프레임워크
- **Vite**: 빌드 도구
- **Zustand**: 전역 상태 관리
- **React Router**: 라우팅
- **Styled Components**: CSS-in-JS 스타일링
- **Axios**: HTTP 클라이언트
- **React Hook Form + Zod**: 폼 관리 및 검증
- **date-fns**: 날짜/시간 처리
- **vite-plugin-pwa**: PWA 지원

---

이 구조는 프로젝트 초기 설정 단계입니다. 필요에 따라 폴더와 파일을 추가하며 확장해나가세요.

