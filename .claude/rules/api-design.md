---
paths:
  [
    'src/queries/**/*.ts',
    'src/types/api/**/*.ts',
    'src/mocks/**/*.ts',
    'src/constants/apiEndpoints.ts',
  ]
---

# API 設計ポリシー

API 関連ファイルの設計方針と管理ルール。

---

## ファイル構成：1-1-1-1 ルール

**API エンドポイント 1 つにつき、以下の 4 ファイルを 1 つずつ作成します。**

```
API: userInfo
  ↓
src/queries/userInfo.ts                 # TanStack Query queryOptions
src/types/api/userInfo.ts               # APIレスポンス型定義
src/mocks/handlers/userInfo.ts          # MSW ハンドラー
src/mocks/data/userInfo.ts              # モックデータ
src/constants/apiEndpoints.ts           # エンドポイント URL（一元管理）
```

### 各ファイルの役割

#### 1. Query (`src/queries/{apiName}.ts`)

```ts
import { queryOptions } from '@tanstack/react-query'
import { apiFetch } from '@/lib/apiFetch'
import type { UserInfoResponse } from '@/types/api/userInfo'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'

export const userInfoQueryOptions = queryOptions({
  queryKey: ['userInfo'],
  queryFn: async () => {
    const response = await apiFetch<UserInfoResponse>(API_ENDPOINTS.USER_INFO)
    return response
  },
})
```

**重要：** API URL は `API_ENDPOINTS` から参照する

#### 2. 型定義 (`src/types/api/{apiName}.ts`)

```ts
export type UserInfoResponse = {
  result: {
    userId: string
    name: string
    email: string
  }
}
```

#### 3. MSW ハンドラー (`src/mocks/handlers/{apiName}.ts`)

```ts
import { http, HttpResponse } from 'msw'
import { mockUserInfo } from '@/mocks/data/userInfo'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'

export const userInfoHandlers = [
  http.get(API_ENDPOINTS.USER_INFO, () => {
    return HttpResponse.json({ result: mockUserInfo })
  }),
]
```

**重要：** API URL は `API_ENDPOINTS` から参照する

#### 4. モックデータ (`src/mocks/data/{apiName}.ts`)

```ts
export const mockUserInfo = {
  userId: 'user-123',
  name: 'Test User',
  email: 'test@example.com',
}
```

---

## エンドポイント URL の一元管理

### `src/constants/apiEndpoints.ts`

すべての API エンドポイント URL をここで定義します。

```ts
export const API_ENDPOINTS = {
  // User API
  USER_INFO: '/api/userInfo',
  USER_PROFILE: '/api/userProfile',
  USER_SETTINGS: '/api/userSettings',

  // Product API
  PRODUCT_LIST: '/api/productList',
  PRODUCT_DETAIL: '/api/productDetail',
  PRODUCT_REVIEW: '/api/productReview',

  // Order API
  ORDER_HISTORY: '/api/orderHistory',
  ORDER_DETAIL: '/api/orderDetail',

  // ... (全 30 個)
} as const
```

### 使用方法

```ts
// ✅ OK
import { API_ENDPOINTS } from '@/constants/apiEndpoints'

apiFetch<UserInfoResponse>(API_ENDPOINTS.USER_INFO)
http.get(API_ENDPOINTS.USER_INFO, ...)

// ❌ NG（直接 URL を書かない）
apiFetch<UserInfoResponse>('/api/userInfo')
http.get('/api/userInfo', ...)
```

### メリット

1. **URL 変更が一箇所** — エンドポイント変更時は `apiEndpoints.ts` だけ修正
2. **DRY 原則** — URL の重複がない
3. **誤入力防止** — キーの参照なので入力ミスがない
4. **自動生成対応** — `/create-api` スキルが自動で追加

---

## スキル：`/create-api`

API を作成する際は、`/create-api {apiName}` を実行します。

```bash
/create-api userInfo
```

以下の 5 ファイルが自動生成されます：

1. `src/queries/userInfo.ts`
2. `src/types/api/userInfo.ts`
3. `src/mocks/handlers/userInfo.ts`
4. `src/mocks/data/userInfo.ts`
5. `src/constants/apiEndpoints.ts` に `USER_INFO: '/api/userInfo'` を追加

---

## 実装後の手作業

### 1. ハンドラーを `handlers/index.ts` に追加

```ts
// src/mocks/handlers/index.ts
import { userInfoHandlers } from './userInfo'

export const handlers = [
  ...userInfoHandlers,
  // ... other handlers
]
```

### 2. ページで使用

```ts
import { useQuery } from '@tanstack/react-query'
import { userInfoQueryOptions } from '@/queries/userInfo'

export function Dashboard() {
  const { data, isLoading, isError } = useQuery(userInfoQueryOptions)
  // ...
}
```

### 3. API パス・型・モックを実装に合わせて修正

- `apiEndpoints.ts` の URL（必要に応じて）
- 型定義の構造
- モックデータの内容

---

## 規模指標

- **API 数：30 個程度** → ファイル単位での管理が最適
- **エンドポイント一元管理** → 複数箇所での参照を防ぐ
- **1-1-1-1 ルール** → 各 API がコンパクトで管理しやすい

---

## APIレスポンスの型検証（将来方針）

現状は手書きの TypeScript 型定義のみ（実行時チェックなし）。
実 API との結合時に Zod でのパースに移行する。

```ts
// 移行後（Zodで実行時検証）
const SampleAType1Schema = z.object({ ... })
const data = SampleAType1Schema.parse(await apiFetch('/api/sample_a/type_1'))
```

**理由：** OpenAPI spec がないため、手書き型と実レスポンスの乖離をランタイムで検知するため。
