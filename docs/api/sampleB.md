# SampleB API 仕様

## 概要

SampleB は ステータス・スコア を含む複合データを返す API。

---

## SampleB Type1

**エンドポイント**: `GET /api/sample_b/type_1`

### レスポンス

```ts
export type SampleBType1Response = {
  id: string
  name: string
  status: string
  score: number
}
```

**フィールド説明:**

| フィールド | 型     | 説明       |
| ---------- | ------ | ---------- |
| id         | string | 一意識別子 |
| name       | string | 名前       |
| status     | string | ステータス |
| score      | number | スコア値   |

### 使用箇所

- **画面**: [SampleModal → SampleB → Type1](/pages/SampleModal.md#sampleb-type1)
- **Query**: `src/queries/sampleB.ts` の `sampleBType1QueryOptions`
- **Storybook**: `src/pages/SampleModal/containers/SampleB/Type1/index.stories.tsx`

### MSW ハンドラー

**ファイル**: `src/mocks/handlers/sampleB.ts`

```ts
http.get('/api/sample_b/type_1', () =>
  HttpResponse.json({ result: mockSampleBType1Data }),
)
```

**モックデータ**: `src/mocks/data/sampleB.ts` の `mockSampleBType1Data`

---

## Query 定義

**ファイル**: `src/queries/sampleB.ts`

```ts
export const sampleBType1QueryOptions = queryOptions({
  queryKey: ['sampleB', 'type1'],
  queryFn: () =>
    apiFetch<{ result: SampleBType1Response }>('/api/sample_b/type_1'),
})
```

---

## 型定義

**ファイル**: `src/types/api/sampleB.ts`

```ts
export type SampleBType1Response = { ... }
```
