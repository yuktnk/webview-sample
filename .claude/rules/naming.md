# 命名規則

命名規則の一元管理。ESLint で自動チェックされる規則と、手動で守る規則を分けて記載する。

---

## ESLint で自動チェックされる規則

### ファイル名（`unicorn/filename-case`）

| ファイル種別    | ルール                      | 例                                       |
| --------------- | --------------------------- | ---------------------------------------- |
| `.ts` ファイル  | camelCase                   | `sampleA.ts`, `apiFetch.ts`, `common.ts` |
| `.tsx` ファイル | camelCase または PascalCase | `index.tsx`, `DataCard.tsx`              |

**除外（TanStack Router の記法）：**

- `__root.tsx` — ルートレイアウト
- `$param.tsx`（`$from.tsx`, `$serviceType.tsx` など）— 動的パスパラメータ

**除外（自動生成）：**

- `routeTree.gen.ts` — TanStack Router が自動生成するルートツリー

### TypeScript 型名（`@typescript-eslint/naming-convention`）

| 対象         | ルール     | 例                               |
| ------------ | ---------- | -------------------------------- |
| `type`       | PascalCase | `type UserInfoResponse = ...`    |
| `interface`  | PascalCase | `interface NativeBridge { ... }` |
| `enum`       | PascalCase | `enum ServiceType { ... }`       |
| 型パラメータ | PascalCase | `<T extends ...>`                |

### `type` vs `interface`（`@typescript-eslint/consistent-type-definitions`）

アプリケーションコードでは **`type` を使う**（`interface` は使わない）。

```ts
// ✅ OK
type UserInfoResponse = { userId: string }

// ❌ NG
interface UserInfoResponse {
  userId: string
}
```

**例外：`.d.ts` ファイル**

`viteEnv.d.ts` のような型宣言ファイルでは `interface` を使う。
`interface` は**宣言マージ**ができるため、Vite 等のグローバル型の拡張に必要。
`type` エイリアスは宣言マージができないため、既存の型を正しく上書きできない。

```ts
// ✅ viteEnv.d.ts（宣言マージが必要なため interface）
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
}
```

### JSX コンポーネントの使用（`react/jsx-pascal-case`）

| 対象     | ルール     | 例                                |
| -------- | ---------- | --------------------------------- |
| JSX タグ | PascalCase | `<LoadingView />`, `<DataCard />` |

---

## Import / Export ルール

### Default Export（単一の主要エクスポート）

ファイルが**単一の主要なエクスポート**を持つ場合のみ使用。

```tsx
// ✅ OK - Default Export の使用場所
export default function SampleModal() {} // ページコンポーネント
export default { component: SampleA } // ルート定義
export default userInfoQueryOptions // API クエリ（全体）
export default { title: '...' } // Story ファイル
```

**メリット：**

- インポート時に名前を指定する必要がない
- ファイル内の主要な責務が明確

### Named Export（複数エクスポート・再利用可能）

複数のエクスポート、またはユーティリティ・ライブラリ的な性質の場合に使用。

```tsx
// ✅ OK - Named Export の使用場所
export function DataCard() {} // UI コンポーネント
export function useSampleData() {} // カスタムフック
export function formatDate() {} // ユーティリティ関数
export type UserInfo = {} // 型定義
export const API_ENDPOINTS = {} // 定数
export const userInfoHandlers = [] // MSW ハンドラー
```

**メリット：**

- Tree-shaking に最適（未使用コードを自動削除）
- バンドルサイズが小さくなる
- 再利用性が高い

### ルール早見表

| 対象                           | Export タイプ    | 例                            |
| ------------------------------ | ---------------- | ----------------------------- |
| ページコンポーネント           | **Default**      | `src/pages/sampleModal/`      |
| UI コンポーネント              | Named            | `DataCard.tsx`                |
| カスタムフック                 | Named            | `useSampleData()`, `hooks.ts` |
| ユーティリティ関数             | Named            | `formatDate()`, `utils/`      |
| API クエリ定義                 | **Default**      | `src/queries/sampleA.ts`      |
| API 型定義                     | Named            | `src/types/api/sampleA.ts`    |
| MSW ハンドラー（集約）         | Named            | `handlers/index.ts`           |
| MSW ハンドラー（ドメイン単位） | Named            | `handlers/sampleA.ts`         |
| 定数・設定                     | Named            | `API_ENDPOINTS`               |
| ルート定義                     | **Default**      | `src/routes/*/index.tsx`      |
| Story                          | Named（Default） | `*.stories.tsx`               |

---

## Import 順序

### グループ分けルール

import 文は以下の順序で整列する：

```ts
// グループ 1: Node.js 標準モジュール
import fs from 'fs'
import path from 'path'

// グループ 2: 外部ライブラリ（node_modules）
import { QueryClient } from '@tanstack/react-query'
import React from 'react'
import { clsx } from 'clsx'

// グループ 3: 内部モジュール（@/ エイリアス）
import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import { userInfoQueryOptions } from '@/queries/userInfo'
import type { UserInfo } from '@/types/api/userInfo'

// グループ 4: 相対パス
import { DataCard } from './components/DataCard'
import './index.css'
```

### 型 import の統一

`@typescript-eslint/consistent-type-imports` により、型は自動的に `import type` に統一される。

```ts
// ✅ 自動修正される
import type { UserInfo } from '@/types/api/userInfo'
import type { Props } from './component.tsx'
```

### 自動矯正の仕組み

| ツール                            | 役割                                 | コマンド        |
| --------------------------------- | ------------------------------------ | --------------- |
| **ESLint** (`import/order`)       | import 順序を検出・エラー → 自動修正 | `pnpm lint:fix` |
| **Prettier** (`organize-imports`) | import の並び替え（空行・整形）      | `pnpm format`   |

- **順序の検知・修正は ESLint が担当**。`import/order` は `error` なので、違反があると `pnpm lint` が失敗する
- **Prettier は順序ルールを持たない**（TypeScript の organize imports を実行するだけ）。ESLint と競合しないよう `newlines-between: 'ignore'` を設定している

**開発フロー：**

```bash
pnpm lint:fix && pnpm format
```

**CI/CD では：**

```bash
pnpm lint          # エラー検出
pnpm format:check  # フォーマット検証
```

---

## 手動で守る規則

ESLint では検査できないため、コードレビュー時に確認する。

### ディレクトリ名

常に camelCase。

```
src/pages/sampleModal/                        ✓ camelCase
src/pages/sampleModal/containers/sampleA/     ✓ camelCase
src/pages/sampleModal/containers/sampleA/type1/  ✓ camelCase
```

### コンポーネント関数名

エクスポートされる React コンポーネントは PascalCase。

```tsx
// ✓
export function SampleAType1() { ... }
export function DataCard() { ... }

// ✗
export function sampleAType1() { ... }
```

### カスタムフック名

`use` プレフィックス + camelCase。

```ts
// ✓
function useModalState() { ... }
function useSampleDataFetch() { ... }
```

---

## ファイル種別ごとの命名パターン

| ファイル               | ケース                                          | 具体例                                             |
| ---------------------- | ----------------------------------------------- | -------------------------------------------------- |
| ページコンポーネント   | `index.tsx`                                     | `src/pages/sampleModal/index.tsx`                  |
| 名前付きコンポーネント | PascalCase                                      | `DataCard.tsx`, `LoadingView.tsx`                  |
| ストーリー             | `index.stories.tsx` / `{Component}.stories.tsx` | `DataCard.stories.tsx`                             |
| API クエリ             | camelCase                                       | `sampleA.ts`, `common.ts`                          |
| API 型定義             | camelCase                                       | `src/types/api/sampleA.ts`                         |
| MSW ハンドラー         | camelCase                                       | `sampleA.ts`, `common.ts`                          |
| カスタムフック（単体） | `hooks.ts`                                      | `containers/sampleA/type1/hooks.ts`                |
| カスタムフック（複数） | `use{Name}.ts`                                  | `hooks/useModalState.ts`                           |
| E2E テスト             | `{pageName}.spec.ts`                            | `sampleModal.spec.ts`                              |
| ドキュメント           | camelCase                                       | `docs/pages/sampleModal.md`, `docs/api/sampleA.md` |
