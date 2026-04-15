---
paths: ['src/mocks/**/*.ts', 'src/queries/**/*.ts', 'src/types/api/**/*.ts']
---

# 既知の不整合・要対応

## MSW レスポンス型の不整合

**Issue：** `src/mocks/handlers/common.ts` が `{ result: ... }` でレスポンスをラップしているが、
`src/queries/common.ts` の型はラップなしの `UserInfoResponse` / `BatchDateResponse`

**状況：** `userInfo`・`batchDate` はまだどのコンポーネントでも参照されていないため現状は問題なし

**対応時期：** 実際に使い始めるタイミングでハンドラー or クエリの型を統一する

---

## Zod によるAPIレスポンス検証（方針）

### 現状

手書き型定義のみ（実行時チェックなし）

```ts
const data = await apiFetch<{ result: SampleAType1Response }>(
  '/api/sample_a/type_1',
)
```

### 移行方針

APIレスポンスはZodでパースする方針に移行する予定。

```ts
// 移行後（Zodで実行時検証）
const SampleAType1Schema = z.object({ ... })
const data = SampleAType1Schema.parse(await apiFetch('/api/sample_a/type_1'))
```

### 移行タイミング

実APIとの結合時。現状はMSWモックのみのため優先度低。

### 理由

- OpenAPI specがないため、手書き型定義とAPIの実際のレスポンスが乖離するリスク
- Zodによる実行時パースはAPIの変更を即座に検知できる
- バックエンド側の品質担保にもなる
