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

### JSX コンポーネントの使用（`react/jsx-pascal-case`）

| 対象     | ルール     | 例                                |
| -------- | ---------- | --------------------------------- |
| JSX タグ | PascalCase | `<LoadingView />`, `<DataCard />` |

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
