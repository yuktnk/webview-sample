# SampleA API 仕様

## 概要

SampleA は 2 つの異なるレスポンス形式を持つ API グループ。

- **Type1** — 単一値（数値・日付）のデータ表示用
- **Type2** — リスト形式のデータ表示用

---

## SampleA Type1

**エンドポイント**: `GET /api/sample_a/type_1`

### レスポンス

```ts
export type SampleAType1Response = {
  id: string
  title: string
  value: number
  date: string
}
```

**フィールド説明:**

| フィールド | 型     | 説明             |
| ---------- | ------ | ---------------- |
| id         | string | 一意識別子       |
| title      | string | データのタイトル |
| value      | number | 数値データ       |
| date       | string | ISO 形式の日付   |

### 使用箇所

- **画面**: [SampleModal → SampleA → Type1](/pages/SampleModal.md#samplea-type1)
- **Query**: `src/queries/sampleA.ts` の `sampleAType1QueryOptions`
- **Storybook**: `src/pages/SampleModal/containers/SampleA/Type1/index.stories.tsx`

### MSW ハンドラー

**ファイル**: `src/mocks/handlers/sampleA.ts`

```ts
http.get('/api/sample_a/type_1', () =>
  HttpResponse.json({ result: mockSampleAType1Data }),
)
```

**モックデータ**: `src/mocks/data/sampleA.ts` の `mockSampleAType1Data`

---

## SampleA Type2

**エンドポイント**: `GET /api/sample_a/type_2`

### レスポンス

```ts
export type SampleAType2Response = {
  id: string
  title: string
  items: {
    label: string
    count: number
  }[]
}
```

**フィールド説明:**

| フィールド    | 型     | 説明                 |
| ------------- | ------ | -------------------- |
| id            | string | 一意識別子           |
| title         | string | データのタイトル     |
| items         | Array  | リスト形式のデータ   |
| items[].label | string | アイテムのラベル     |
| items[].count | number | アイテムのカウント値 |

### 使用箇所

- **画面**: [SampleModal → SampleA → Type2](/pages/SampleModal.md#samplea-type2)
- **Query**: `src/queries/sampleA.ts` の `sampleAType2QueryOptions`
- **Storybook**: `src/pages/SampleModal/containers/SampleA/Type2/index.stories.tsx`

### MSW ハンドラー

**ファイル**: `src/mocks/handlers/sampleA.ts`

```ts
http.get('/api/sample_a/type_2', () =>
  HttpResponse.json({ result: mockSampleAType2Data }),
)
```

**モックデータ**: `src/mocks/data/sampleA.ts` の `mockSampleAType2Data`

---

## Query 定義

**ファイル**: `src/queries/sampleA.ts`

```ts
export const sampleAType1QueryOptions = queryOptions({
  queryKey: ['sampleA', 'type1'],
  queryFn: () =>
    apiFetch<{ result: SampleAType1Response }>('/api/sample_a/type_1'),
})

export const sampleAType2QueryOptions = queryOptions({
  queryKey: ['sampleA', 'type2'],
  queryFn: () =>
    apiFetch<{ result: SampleAType2Response }>('/api/sample_a/type_2'),
})
```

---

## 型定義

**ファイル**: `src/types/api/sampleA.ts`

```ts
export type SampleAType1Response = { ... }
export type SampleAType2Response = { ... }
```
