# API 定義テンプレート

API 名とエンドポイント URL をもとに、Query・型・モック を一括生成します。

## 変換ルール

```
入力: API名 = userData, エンドポイント = /api/user-data
  ↓
ファイル名: userData.ts（キャメルケース）
API パス: /api/user-data（ユーザー入力をそのまま使用）
定数キー: USER_DATA（アッパースネークケース）
型名: UserDataResponse（アッパーキャメルケース）
```

---

## 1. API Query

**ファイル**: `src/queries/{camelCase}.ts`

例：`/create-api userData` でエンドポイント `/api/user-data` の場合

```ts
import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import { apiFetch } from '@/lib/apiFetch'
import type { UserDataResponse } from '@/types/api/userData'
import { queryOptions } from '@tanstack/react-query'

export const userDataQueryOptions = queryOptions({
  queryKey: ['userData'],
  queryFn: async () => {
    const response = await apiFetch<UserDataResponse>(API_ENDPOINTS.USER_DATA)
    return response
  },
})
```

**重要：** API URL は自動的に `API_ENDPOINTS` から参照されます。

---

## 2. API 型定義

**ファイル**: `src/types/api/{camelCase}.ts`

例：`/create-api userData` の場合

```ts
export type UserDataResponse = {
  result: {
    id: string
    name: string
    email: string
  }
}
```

---

## 3. MSW ハンドラー

**ファイル**: `src/mocks/handlers/{camelCase}.ts`

例：`/create-api userData` でエンドポイント `/api/user-data` の場合

```ts
import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import { mockUserData } from '@/mocks/data/userData'
import { http, HttpResponse } from 'msw'

export const userDataHandlers = [
  http.get(API_ENDPOINTS.USER_DATA, () => {
    return HttpResponse.json({ result: mockUserData })
  }),
]
```

**重要：** URL は `API_ENDPOINTS` から参照し、エンドポイント定義との重複を防ぎます。

---

## 4. モックデータ

**ファイル**: `src/mocks/data/{camelCase}.ts`

例：`/create-api userData` の場合

```ts
export const mockUserData = {
  id: 'user-123',
  name: 'Test User',
  email: 'test@example.com',
}
```

---

## 5. エンドポイント URL（apiEndpoints.ts に追加）

**ファイル**: `src/constants/apiEndpoints.ts`

生成時に以下が自動追加されます：

```ts
export const API_ENDPOINTS = {
  // ... existing endpoints

  // User API (自動追加)
  USER_INFO: '/api/userInfo',
} as const
```

---

## 使用例

### 例1: userData

```bash
/create-api userData /api/user-data
  → src/queries/userData.ts
  → src/types/api/userData.ts
  → src/mocks/handlers/userData.ts
  → src/mocks/data/userData.ts
  → src/constants/apiEndpoints.ts に USER_DATA: '/api/user-data' を追加
```

### 例2: createProduct

```bash
/create-api createProduct /api/products
  → src/queries/createProduct.ts
  → src/types/api/createProduct.ts
  → src/mocks/handlers/createProduct.ts
  → src/mocks/data/createProduct.ts
  → src/constants/apiEndpoints.ts に CREATE_PRODUCT: '/api/products' を追加
```

**注：** デフォルトは GET で生成されます。POST が必要な場合は、生成後に
`src/mocks/handlers/createProduct.ts` の `http.get()` を `http.post()` に修正してください。

---

## 実装後の手作業

### 1. ハンドラーを handlers/index.ts に追加

```ts
// src/mocks/handlers/index.ts
import { userDataHandlers } from './userData'

export const handlers = [
  ...userDataHandlers,
  // ... other handlers
]
```

### 2. ページコンポーネントで使用

```ts
// src/pages/dashboard/index.tsx
import { useQuery } from '@tanstack/react-query'
import { userDataQueryOptions } from '@/queries/userData'

export function Dashboard() {
  const { data, isLoading, isError } = useQuery(userDataQueryOptions)
  // ...
}
```

### 3. 型定義・モックデータを実装に合わせて修正

- 型定義を実際のレスポンス構造に合わせて修正
- モックデータを実装に合わせて修正

**注：** API エンドポイント URL は `src/constants/apiEndpoints.ts` で一元管理されているため、
変更が必要な場合はそのファイルのみ修正してください。Query と Handler は自動的に参照します。
