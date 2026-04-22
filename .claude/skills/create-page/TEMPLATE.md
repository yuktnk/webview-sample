# ページ作成テンプレート

ページ名を `{PageName}` としたときの、生成ファイルのテンプレート例。

---

## 1. ページコンポーネント

**ファイル**: `src/pages/{PageName}/index.tsx`

```tsx
import { useState } from 'react'
import type { ReactNode } from 'react'

export function {PageName}(): ReactNode {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (isLoading) {
    return <div className="p-4">読み込み中...</div>
  }

  if (error) {
    return <div className="p-4 text-red-600">エラー: {error}</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{PageName}</h1>
      {/* コンテンツをここに追加 */}
    </div>
  )
}
```

---

## 2. Storybook Story

**ファイル**: `src/pages/{PageName}/index.stories.tsx`

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { {PageName} } from './index'

const meta: Meta<typeof {PageName}> = {
  component: {PageName},
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

**ファイル**: `tests/e2e/{pageName}.spec.ts`

```ts
import { test, expect } from '@playwright/test'
import { nativeBridgeFixture } from './fixtures/nativeBridge'

test.describe('{PageName}', () => {
  test.use({ ...nativeBridgeFixture })

  test('ページが読み込まれる', async ({ page }) => {
    await page.goto('/{pageName}')
    await expect(page.getByRole('heading')).toContainText('{PageName}')
  })

  test('エラー状態を表示する', async ({ page }) => {
    // エラーハンドリングのテスト
    await page.goto('/{pageName}')
    // 期待される動作をアサート
  })
})
```

---

## 使用例

```bash
/create-page Dashboard
  → src/pages/Dashboard/index.tsx
  → src/pages/Dashboard/index.stories.tsx
  → tests/e2e/dashboard.spec.ts
```

---

## 生成後の手動追加項目

必要に応じて以下を追加：

### ルーティング

**`src/routes/dashboard/index.tsx`**

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { Dashboard } from '@/pages/Dashboard'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})
```

### API クエリ

**`src/queries/dashboard.ts`**

```ts
import { queryOptions } from '@tanstack/react-query'
// API 定義
```

### 型定義

**`src/types/api/dashboard.ts`**

```ts
// APIレスポンス型
```

### MSW ハンドラー

**`src/mocks/handlers/dashboard.ts`**

```ts
import { http, HttpResponse } from 'msw'
// ハンドラー定義
```
