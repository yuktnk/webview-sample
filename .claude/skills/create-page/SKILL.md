---
name: create-page
description: Create a new page with required files (component, story, e2e test)
argument-hint: '[page-name in camelCase]'
---

# スキル：新しいページ作成

ページ名を引数に、必須ファイルを一括生成します。

## 生成ファイル

4 つのファイルを自動生成します：

1. **ルーティング定義** — `src/routes/{camelCase}/index.tsx`
2. **ページコンポーネント** — `src/pages/{camelCase}/index.tsx`
3. **Storybook Story** — `src/pages/{camelCase}/index.stories.tsx`
4. **E2E テスト** — `tests/e2e/{camelCase}.spec.ts`

## ルール

### ページ名の形式

- **入力形式**: キャメルケース（例: `weeklyReport`, `dashboard`, `userProfile`）
- **ディレクトリ**: キャメルケース（入力そのまま）
  - 入力: `weeklyReport` → ディレクトリ: `src/pages/weeklyReport/`
  - 入力: `dashboard` → ディレクトリ: `src/pages/dashboard/`
- **コンポーネント名**: アッパーキャメルケース（自動変換）
  - 入力: `weeklyReport` → 関数名: `export function WeeklyReport()`
  - 入力: `dashboard` → 関数名: `export function Dashboard()`
- **URL**: `/{キャメルケース}` （ディレクトリと同じ）
- **E2E テスト名**: `{キャメルケース}.spec.ts`

### 生成ファイルの要件

#### 1. ルーティング定義（`src/routes/{camelCase}/index.tsx`）

```tsx
// ✅ 要件
- TanStack Router ファイルベースルーティング対応
- createFileRoute で route を定義
- コンポーネントを import・export
```

#### 2. ページコンポーネント（`src/pages/{camelCase}/index.tsx`）

```tsx
// ✅ 要件
- React 関数コンポーネント（named export）
- TypeScript strict 対応
- セマンティック HTML
```

#### 3. Storybook Story（`src/pages/{camelCase}/index.stories.tsx`）

```tsx
// ✅ 要件
- Default・Loading・Error の 3 点セット
- MSW ハンドラーでモック API を制御
- コンポーネント名は PascalCase
```

#### 4. E2E テスト（`tests/e2e/{camelCase}.spec.ts`）

```ts
// ✅ 要件
- Playwright テスト
- 基本テンプレート（正常系・異常系）
- fixtures: nativeBridge を使用
```

## 参考資料

詳細なテンプレートは [TEMPLATE.md](TEMPLATE.md) を参照。

## 実装後

生成後、以下は必要に応じて **手動で追加** または **`/create-api` スキルで生成**：

- `src/queries/{camelCase}.ts` — API Query 定義（例: `weeklyReport.ts`）
- `src/types/api/{camelCase}.ts` — API 型定義（例: `weeklyReport.ts`）
- `src/mocks/handlers/{camelCase}.ts` — MSW ハンドラー（例: `weeklyReport.ts`）
- `src/mocks/data/{camelCase}.ts` — モックデータ（例: `weeklyReport.ts`）
- `src/pages/{camelCase}/components/` — ページ固有コンポーネント（例: `src/pages/weeklyReport/components/`）

API 関連は `/create-api {apiName}` スキルで一括生成できます。
