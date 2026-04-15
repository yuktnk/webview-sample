---
paths: ['src/mocks/**/*']
---

# MSW（Mock Service Worker）

## セットアップ

- `msw-storybook-addon@2.x` を使用（MSW v2との互換性問題は2.0.7で解消済み）
- `public/mockServiceWorker.js` は `pnpm dlx msw init public/ --save` で生成済み

## ハンドラー管理

### ハンドラーの追加方法

新しいAPIを追加したら：

1. `src/mocks/handlers/{domain}.ts` にハンドラーを追加
2. `src/mocks/handlers/index.ts` に集約
3. Storybook で確認（`pnpm storybook`）

### URLパターンルール

**重要：** ハンドラーのURLパターンは `*/api/...` ではなく `/api/...`（相対パス）を使う。
これはMSW v2の仕様。

```ts
// ✅ OK
http.get('/api/sample_a/type_1', () => ...)

// ❌ NG
http.get('*/api/sample_a/type_1', () => ...)
```

## モックデータ構成

```
src/mocks/
├── browser.ts                   # Storybook・Playwright用 Service Worker
├── data/
│   ├── common.ts                # 共通APIのモックデータ
│   ├── sampleA.ts               # SampleA APIのモックデータ
│   └── sampleB.ts               # SampleB APIのモックデータ
└── handlers/
    ├── index.ts                 # 全ハンドラー集約
    ├── common.ts                # 共通API（userInfo・batchDate）
    ├── sampleA.ts               # SampleA API
    └── sampleB.ts               # SampleB API
```

## Storybook での使用

MSWハンドラーはStory単位で `parameters.msw.handlers` でオーバーライド可能。

```tsx
export const Error: Story = {
  parameters: {
    msw: {
      handlers: [http.get('/api/sample_a/type_1', () => HttpResponse.error())],
    },
  },
}

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [http.get('/api/sample_a/type_1', () => delay('infinite'))],
    },
  },
}
```

## Playwright での使用

Playwright E2E テスト中も MSW が動作する。テスト内で API の返値をカスタマイズできる。

詳細は `.claude/rules/testing.md` を参照。
