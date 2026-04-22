---
name: create-page
description: Create a new page with required files (component, story, e2e test)
argument-hint: '[page-name in camelCase]'
---

# スキル：新しいページ作成

ページ名を引数に、必須ファイルを一括生成します。

## 生成ファイル

3 つのファイルを自動生成します：

1. **ページコンポーネント** — `src/pages/{PageName}/index.tsx`
2. **Storybook Story** — `src/pages/{PageName}/index.stories.tsx`
3. **E2E テスト** — `tests/e2e/{pageName}.spec.ts`

## ルール

### ページ名の形式

- **入力形式**: キャメルケース（例: `weeklyReport`, `dashboard`, `userProfile`）
- **自動変換**: キャメルケース → PascalCase
  - 入力: `weeklyReport` → ページディレクトリ: `WeeklyReport`
  - 入力: `dashboard` → ページディレクトリ: `Dashboard`
- **ファイル配置**: `src/pages/{PascalCase}/`
- **URL**: `/{キャメルケース}`
- **E2E テスト名**: `{キャメルケース}.spec.ts`

### 生成ファイルの要件

#### 1. ページコンポーネント（`index.tsx`）

```tsx
// ✅ 要件
- React 関数コンポーネント（named export）
- TypeScript strict 対応
- セマンティック HTML
- ローディング・エラー状態の考慮
```

#### 2. Storybook Story（`index.stories.tsx`）

```tsx
// ✅ 要件
- Default・Loading・Error の 3 点セット
- MSW ハンドラーでモック API を制御
- コンポーネント名は PascalCase
```

#### 3. E2E テスト（`{pageName}.spec.ts`）

```ts
// ✅ 要件
- Playwright テスト
- 基本テンプレート（正常系・異常系）
- fixtures: nativeBridge, auth を使用
```

## 参考資料

詳細なテンプレートは [TEMPLATE.md](TEMPLATE.md) を参照。

## 実装後

生成後、以下は必要に応じて **手動で追加**：

- `src/routes/{pageName}/` — ルーティング定義
- `src/queries/{pageName}.ts` — API Query 定義
- `src/types/api/{pageName}.ts` — API 型定義
- `src/mocks/handlers/{pageName}.ts` — MSW ハンドラー
- `src/pages/{PageName}/components/` — ページ固有コンポーネント
