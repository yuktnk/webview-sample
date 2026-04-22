# ページ作成テンプレート

スキルが受け取るキャメルケース入力をもとに、キャメルケースのディレクトリと PascalCase のコンポーネント名で生成します。

## 変換ルール

```
入力: weeklyReport
  ↓
ディレクトリ: src/pages/weeklyReport/（キャメルケース）
ファイル名: weeklyReport.spec.ts（キャメルケース）
URL: /weeklyReport（キャメルケース）
コンポーネント名: WeeklyReport（アッパーキャメルケース）
```

---

## 1. ページコンポーネント

**ファイル**: `src/pages/{camelCase}/index.tsx`

例：`/create-page weeklyReport` の場合

```tsx
import type { ReactNode } from 'react'

export function WeeklyReport(): ReactNode {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Weekly Report</h1>
      {/* コンテンツをここに追加 */}
    </div>
  )
}
```

---

## 2. Storybook Story

**ファイル**: `src/pages/{camelCase}/index.stories.tsx`

例：`/create-page weeklyReport` の場合

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { WeeklyReport } from './index'

const meta: Meta<typeof WeeklyReport> = {
  component: WeeklyReport,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [],
    },
  },
}

export const Error: Story = {
  parameters: {
    msw: {
      handlers: [],
    },
  },
}
```

---

## 3. E2E テスト

**ファイル**: `tests/e2e/{camelCase}.spec.ts`

例：`/create-page weeklyReport` の場合

```ts
import { test, expect } from '@playwright/test'
import { nativeBridgeFixture } from './fixtures/nativeBridge'

test.describe('WeeklyReport', () => {
  test.use({ ...nativeBridgeFixture })

  test('ページが読み込まれる', async ({ page }) => {
    await page.goto('/weeklyReport') // ← ルーティング設定に合わせて URL を修正
    await expect(page.getByRole('heading')).toContainText('Weekly Report')
  })

  test('エラー状態を表示する', async ({ page }) => {
    // エラーハンドリングのテスト
    await page.goto('/weeklyReport') // ← ルーティング設定に合わせて URL を修正
    // 期待される動作をアサート
  })
})
```

---

## 使用例

### 例1: weeklyReport

```bash
/create-page weeklyReport
  → src/pages/weeklyReport/index.tsx
  → src/pages/weeklyReport/index.stories.tsx
  → tests/e2e/weeklyReport.spec.ts
  → URL: /weeklyReport
```

### 例2: userProfile

```bash
/create-page userProfile
  → src/pages/userProfile/index.tsx
  → src/pages/userProfile/index.stories.tsx
  → tests/e2e/userProfile.spec.ts
  → URL: /userProfile
```

---

## 手動追加が必要な項目

ルーティング・API・型定義などは必要に応じて追加：

### ルーティング

**`src/routes/weeklyReport/index.tsx`**

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { WeeklyReport } from '@/pages/weeklyReport'

export const Route = createFileRoute('/weeklyReport')({
  component: WeeklyReport,
})
```

### API クエリ

**`src/queries/weeklyReport.ts`**

```ts
import { queryOptions } from '@tanstack/react-query'
// API 定義
```

### 型定義

**`src/types/api/weeklyReport.ts`**

```ts
// APIレスポンス型
```

### MSW ハンドラー

**`src/mocks/handlers/weeklyReport.ts`**

```ts
import { http, HttpResponse } from 'msw'
// ハンドラー定義
```
