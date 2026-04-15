# API 設計概要

## モック戦略

開発段階では [MSW（Mock Service Worker）](https://mswjs.io/) ですべてのAPI をモックしています。

```
┌─────────────────┐
│  Storybook      │
│  Vitest         │ ──→ MSW ──→ モックデータ
│  Playwright E2E │
└─────────────────┘
```

## MSW ハンドラー

- `src/mocks/handlers/` — エンドポイント別のハンドラー定義
- `src/mocks/data/` — モックデータ
- `src/mocks/browser.ts` — Storybook・Playwright 用の Service Worker 設定

## TanStack Query

API 呼び出しは `src/queries/` の `queryOptions` で管理。

```ts
export const sampleAType1QueryOptions = queryOptions({
  queryKey: ['sampleAType1'],
  queryFn: () => apiFetch<SampleAType1Response>('/api/sample_a/type_1'),
})
```

**キャッシュ戦略**:

| 対象                            | キャッシュ時間 |
| ------------------------------- | -------------- |
| 共通情報（userInfo・batchDate） | 5 分           |
| ページ固有データ                | 5 分           |

（`src/lib/queryClient.ts` で設定）

## API レスポンス型

- `src/types/api/common.ts` — 共通 API の型
- `src/types/api/sampleA.ts` — SampleA 関連 API の型
- `src/types/api/sampleB.ts` — SampleB 関連 API の型

## 実装ロードマップ

### 現状

- 手書き型定義 + MSW モック

### 将来（実 API 連携時）

Zod による実行時バリデーション導入予定。

```ts
const SampleAType1Schema = z.object({ ... })
const data = SampleAType1Schema.parse(await apiFetch('/api/sample_a/type_1'))
```

詳細は [CLAUDE.md](../CLAUDE.md#ZodによるAPIレスポンス検証方針) を参照。
