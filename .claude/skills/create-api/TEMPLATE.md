# API 定義テンプレート

API 名をもとに、Query・型・モック を一括生成します。

## 変換ルール

```
入力: userData
  ↓
ファイル名: userData.ts（キャメルケース）
API パス: /api/user-data または /api/userData
型名: UserDataResponse（アッパーキャメルケース）
```

---

## 1. API Query

**ファイル**: `src/queries/{camelCase}.ts`

例：`/create-api userData` の場合

```ts
import { queryOptions } from '@tanstack/react-query'
import { apiFetch } from '@/lib/apiFetch'
import type { UserDataResponse } from '@/types/api/userData'

export const userDataQueryOptions = queryOptions({
  queryKey: ['userData'],
  queryFn: async () => {
    const response = await apiFetch<UserDataResponse>('/api/userData')
    return response
  },
})
```

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

例：`/create-api userData` の場合

```ts
import { http, HttpResponse } from 'msw'
import { mockUserData } from '@/mocks/data/userData'

export const userDataHandlers = [
  http.get('/api/userData', () => {
    return HttpResponse.json({ result: mockUserData })
  }),
]
```

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

## 使用例

### 例1: userData

```bash
/create-api userData
  → src/queries/userData.ts
  → src/types/api/userData.ts
  → src/mocks/handlers/userData.ts
  → src/mocks/data/userData.ts
```

### 例2: productList

```bash
/create-api productList
  → src/queries/productList.ts
  → src/types/api/productList.ts
  → src/mocks/handlers/productList.ts
  → src/mocks/data/productList.ts
```

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

### 3. API パス・型・モックデータを実装に合わせて修正

- `queryFn` の API パスを実装に合わせて修正
- 型定義を実際のレスポンス構造に合わせて修正
- モックデータを実装に合わせて修正
