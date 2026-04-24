---
paths: ['src/**/*.stories.tsx', 'tests/e2e/**/*.spec.ts', 'src/**/*.test.ts']
---

# テスト戦略・役割分担

## テストの役割分担

| レイヤー       | ツール         | 担保すること                                                         |
| -------------- | -------------- | -------------------------------------------------------------------- |
| ユニット       | Vitest         | 純粋関数のロジック（`formatDate` など）                              |
| コンポーネント | Storybook      | 単体の表示（Default・Loading・Error を最低限とし、全バリエーション） |
| 統合           | Playwright E2E | ルーティング → API → レンダリングの一気通貫                          |

**重要：** Playwright はコンポーネント単体の状態（Loading・Error）を確認しない。
それらは Storybook で担保する。Playwright が担うのは、Storybook では検証できない
「ルーター・QueryClient・コンポーネントの統合フロー」に絞る。

---

## Storybook ルール

### Story の3点セット

Storyは **Default・Loading・Error** の3点セットを最低限とする。

```tsx
export const Default: Story = {
  // データ取得成功時の表示
}

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [http.get('/api/xxx', () => delay('infinite'))],
    },
  },
}

export const Error: Story = {
  parameters: {
    msw: {
      handlers: [http.get('/api/xxx', () => HttpResponse.error())],
    },
  },
}
```

### コンポーネント毎の Story 定義

コンポーネントが持つ状態・バリエーション（Disabled・サイズ違い・カラーバリアントなど）の数だけ追加する。

3点セットだけで足りる場合もあれば、複数バリエーションが必要な場合もある。

### ファイル配置

- コンポーネントと同じディレクトリに `index.stories.tsx` として置く
- コンポーネントが複数ある場合は `Component.stories.tsx`

### インポート方法

```ts
// ✅ OK
import type { Meta, StoryObj } from '@storybook/react-vite'

// ❌ NG（`@storybook/react` は直接symlink されていない）
import type { Meta, StoryObj } from '@storybook/react'
```

### MSW ハンドラーのオーバーライド

Story 単位で `parameters.msw.handlers` でハンドラーをオーバーライド可能。

```tsx
export const CustomError: Story = {
  parameters: {
    msw: {
      handlers: [
        // この Story ではこのハンドラーを使う
        http.get('/api/xxx', () => HttpResponse.json({ error: 'Custom error' })),
      ],
    },
  },
}
```

---

## Vitest ルール

### テスト対象

純粋関数のロジック（`formatDate` など）をテストする。

```tsx
// ✅ テストする
describe('formatDate', () => {
  it('ISO形式を日本語に変換する', () => {
    expect(formatDate('2024-01-15')).toBe('2024年1月15日')
  })
})

// ❌ テストしない（React コンポーネントのレンダリング）
// → Storybook で検証する
```

### テストファイルの配置

テスト対象と同じディレクトリに `*.test.ts` として置く。

```
src/
└── utils/
    ├── formatDate.ts
    └── formatDate.test.ts
```

---

## Playwright ルール

### E2E テスト対象

ルーティング → API → レンダリングの一気通貫フロー。

```ts
test('SampleModal に遷移してデータが表示される', async ({ page }) => {
  // ルーティング
  await page.goto('/sampleModal/sample_a/type_1?akr_code=123')

  // API 呼び出しと待機
  await page.waitForLoadState('networkidle')

  // 画面検証
  await expect(page.getByRole('heading')).toContainText('SampleA Type1')
})
```

### テストファイルの配置

```
tests/
└── e2e/
    ├── fixtures/
    │   ├── auth.ts
    │   └── nativeBridge.ts
    ├── sampleModal.spec.ts
    └── visual.spec.ts          # ビジュアルリグレッションテスト
```

### ビジュアルリグレッションテスト（`toHaveScreenshot`）

Chromatic の代替として Playwright の `toHaveScreenshot()` でスクリーンショット差分を検知する。

```ts
test('sample_a/type_1', async ({ page }) => {
  await page.goto('/sampleModal/sample_a/type_1')
  await page.waitForLoadState('networkidle')
  await expect(page).toHaveScreenshot('sample-a-type1.png')
})
```

- **ベースライン画像**: `tests/e2e/visual.spec.ts-snapshots/` に保存（Git 管理）
- **更新コマンド**: `pnpm test:visual`（`--update-snapshots` フラグ付き）
- **CI での差分検知**: `playwright test --project=visual`（更新なし）
- **ビューポート**: iPhone 13（スマートフォン専用アプリのため）

### セマンティック HTML の活用

Playwright は `getByRole` / `getByLabel` で要素を取得する。
コンポーネント内でセマンティック HTML を自然に書くことで、テストが堅牢になる。

```tsx
// ✅ Good - セマンティック HTML
<button onClick={handleClose}>閉じる</button>
<h1>タイトル</h1>
<label htmlFor="input">ラベル</label>
<input id="input" />

// ❌ Bad - role を無視した div のみ
<div onClick={handleClose}>閉じる</div>
<div>タイトル</div>
```

### Playwright で MSW を使う

Playwright の E2E テスト中も MSW が動作する。
テスト内で API の返値をカスタマイズできる。

```ts
test('エラー表示', async ({ page }) => {
  // MSW ハンドラーを上書き
  await page.goto('/sampleModal/sample_a/type_1?akr_code=123', {
    waitUntil: 'networkidle',
  })

  // このテスト内では独自のハンドラーを使いたい場合は
  // fixture で page を拡張
})
```

詳細は `.claude/rules/msw.md` を参照。
