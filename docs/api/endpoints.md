# API エンドポイント一覧

## 共通 API

### GET /api/user/info

ユーザー情報を取得。

**レスポンス**:

```ts
type UserInfoResponse = {
  clientUserId: string
  groupId: string
  stores: {
    akrCode: string
    storeName: string
  }[]
}
```

**実装**:

- ハンドラー: `src/mocks/handlers/common.ts`
- モックデータ: `src/mocks/data/common.ts`
- 型定義: `src/types/api/common.ts`
- QueryOptions: `src/queries/common.ts`

---

### GET /api/batch/date

バッチ実行日を取得。

**レスポンス**:

```ts
type BatchDateResponse = {
  latestDate: string // ISO 8601 形式
}
```

**実装**:

- ハンドラー: `src/mocks/handlers/common.ts`
- モックデータ: `src/mocks/data/common.ts`
- 型定義: `src/types/api/common.ts`
- QueryOptions: `src/queries/common.ts`

---

## SampleA API

### GET /api/sample_a/type_1

SampleA Type1 データを取得。

**レスポンス**:

```ts
type SampleAType1Response = {
  id: string
  title: string
  value: number
  date: string // ISO 8601 形式
}
```

**実装**:

- ハンドラー: `src/mocks/handlers/sampleA.ts`
- モックデータ: `src/mocks/data/sampleA.ts`
- 型定義: `src/types/api/sampleA.ts`
- QueryOptions: `src/queries/sampleA.ts`

---

### GET /api/sample_a/type_2

SampleA Type2 データを取得。

**レスポンス**:

```ts
type SampleAType2Response = {
  id: string
  title: string
  items: {
    label: string
    count: number
  }[]
}
```

**実装**:

- ハンドラー: `src/mocks/handlers/sampleA.ts`
- モックデータ: `src/mocks/data/sampleA.ts`
- 型定義: `src/types/api/sampleA.ts`
- QueryOptions: `src/queries/sampleA.ts`

---

## SampleB API

### GET /api/sample_b/type_1

SampleB Type1 データを取得。

**レスポンス**:

```ts
type SampleBType1Response = {
  id: string
  name: string
  status: string
  score: number
}
```

**実装**:

- ハンドラー: `src/mocks/handlers/sampleB.ts`
- モックデータ: `src/mocks/data/sampleB.ts`
- 型定義: `src/types/api/sampleB.ts`
- QueryOptions: `src/queries/sampleB.ts`
