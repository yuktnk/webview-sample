# webview-sample — Claude Code 指示書

## プロジェクト概要

とあるWebViewアプリのフルリプレイスPoCプロジェクト。
`from` × `serviceType` の組み合わせで画面を切り替えるモーダル画面の実装サンプル。
ゆくゆくは3人程度のチームで継続開発予定。ビギナーエンジニアが多い想定。

---

## 技術スタック

| 役割 | ライブラリ | バージョン |
|------|-----------|-----------|
| ビルド | Vite | 8.x |
| UI | React | 19.x |
| 言語 | TypeScript（strict: true） | 6.x |
| ルーティング | TanStack Router（ファイルルーティング） | 1.x |
| サーバー状態管理 | TanStack Query | 5.x |
| バリデーション | Zod | 4.x |
| スタイリング | Tailwind CSS | 4.x |
| ローカル状態 | useState / useReducer（グローバル状態管理ライブラリなし） | - |
| APIクライアント | fetch（built-in）+ 薄いラッパー（axiosなし） | - |
| コンポーネントテスト | Storybook | 10.x |
| ユニットテスト | Vitest | 4.x |
| E2Eテスト | Playwright | 1.x |
| APIモック | MSW（Mock Service Worker） | 2.x |
| 条件クラス名 | clsx | 2.x |
| パッケージマネージャー | pnpm | 10.x |
| Node.js | 22.x（.nvmrcで固定） | - |

---

## 設計原則（重要）

### 1. 1ページ = 1WebView
- Native が都度 WebView を起動・閉じると JS コンテキストごとリセット
- ページ間の状態共有は不要 → Zustand / Jotai は使わない
- グローバル状態管理ライブラリ不要

### 2. 依存ライブラリは最小限
- axios → fetch（built-in）で代替
- Redux → TanStack Query + useState で代替
- 「使えそう」ではなく「使う理由がある」ものだけ入れる

### 3. TypeScript strict: true を妥協しない
- `any` は原則禁止。`unknown` + 型ガードで代替
- `ignoreBuildErrors` は絶対に使わない

### 4. テスト可能な設計
- Storybook + Playwright を主軸
- MSW でモックを一元管理（Storybook・Vitest・Playwright 全レイヤーで使い回す）
- セマンティック HTML を自然に書く → Playwright の `getByRole` / `getByLabel` が使える

---

## ディレクトリ構成

```
src/
├── routes/                          # TanStack Router ファイルルーティング（薄い定義のみ）
│   ├── __root.tsx                   # rootRoute（loader・共通レイアウト）
│   ├── index.tsx                    # / ルート
│   └── sampleModal/
│       ├── index.tsx                # /sampleModal?from=&serviceType=（Nativeからのクエリパラメータ形式）
│       └── $from/
│           └── $serviceType.tsx     # /sampleModal/$from/$serviceType（パスパラメータ形式）
│
├── pages/                           # ページ単位の実装
│   └── SampleModal/
│       ├── index.tsx                # CONTAINER_MAPでContainerを切り替えるだけ
│       └── containers/
│           ├── index.ts             # CONTAINER_MAP定義
│           ├── SampleA/
│           │   ├── Type1/
│           │   │   ├── index.tsx
│           │   │   └── index.stories.tsx
│           │   └── Type2/
│           │       ├── index.tsx
│           │       └── index.stories.tsx
│           └── SampleB/
│               └── Type1/
│                   ├── index.tsx
│                   └── index.stories.tsx
│
├── components/                      # 複数ページ共通コンポーネント
│   └── ui/                          # 汎用UI（LoadingView・ErrorView等）
│
├── lib/
│   ├── apiFetch.ts                  # fetchの薄いラッパー
│   └── queryClient.ts               # QueryClient インスタンス
│
├── queries/                         # TanStack Query queryOptions定義
│   ├── common.ts                    # userInfo・batchDate（全ページ共通API）
│   ├── sampleA.ts                   # SampleA用queryOptions（Type1・Type2）
│   └── sampleB.ts                   # SampleB用queryOptions（Type1）
│
├── types/                           # 共通型定義
│   ├── from.ts                      # FromType
│   ├── serviceType.ts               # ServiceType
│   └── api/                         # APIレスポンスの型
│       ├── common.ts                # UserInfoResponse・BatchDateResponse
│       ├── sampleA.ts               # SampleAType1Response・SampleAType2Response
│       └── sampleB.ts               # SampleBType1Response
│
├── bridge/                          # NativeBridge
│   └── index.ts                     # 型定義・呼び出しラッパー
│
├── mocks/                           # MSW（Storybook・Vitest・Playwright共通）
│   ├── browser.ts                   # Storybook・Playwright用
│   ├── data/
│   │   ├── common.ts                # モックデータ（userInfo・batchDate）
│   │   ├── sampleA.ts               # モックデータ（Type1・Type2）
│   │   └── sampleB.ts               # モックデータ（Type1）
│   └── handlers/
│       ├── index.ts                 # 全ハンドラー集約
│       ├── common.ts                # 共通API
│       ├── sampleA.ts               # SampleA API（Type1・Type2）
│       └── sampleB.ts               # SampleB API（Type1）
│
└── utils/                           # 純粋関数ユーティリティ
    ├── formatDate.ts                # ISO日付→日本語形式
    └── formatDate.test.ts           # Vitestテスト

tests/                               # Playwright E2E（srcの外）
└── e2e/
    ├── fixtures/
    │   ├── auth.ts                  # 認証fixture（PoC段階はpassthrough）
    │   └── nativeBridge.ts          # NativeBridgeモック（addInitScript + Proxy）
    └── sampleModal.spec.ts

.storybook/
├── main.ts
└── preview.ts

public/
└── mockServiceWorker.js             # MSW Service Worker（pnpm dlx msw initで生成済み）
```

---

## 実装済みのファイル一覧

### 設定ファイル
- `vite.config.ts` — Vite設定（TanStack Router・Tailwind・Storybook統合済み）
- `tsconfig.app.json` — strict: true
- `tsconfig.node.json` — strict: true
- `.nvmrc` — Node.js 22.22.2固定
- `.storybook/main.ts` — staticDirs: ['../public']設定済み
- `.storybook/preview.ts` — QueryClientProvider・MSW（msw-storybook-addon@2.x + patchあり）設定済み
- `playwright.config.ts` — webServer自動起動・chromium設定済み

### 型定義
- `src/types/from.ts` — `FROM_VALUES = ['sample_a', 'sample_b']`
- `src/types/serviceType.ts` — `SERVICE_TYPE_VALUES = ['type_1', 'type_2', 'type_3', 'type_4', 'type_5']`
- `src/types/api/common.ts` — `UserInfoResponse`・`BatchDateResponse`
- `src/types/api/sampleA.ts` — `SampleAType1Response`・`SampleAType2Response`
- `src/types/api/sampleB.ts` — `SampleBType1Response`

### ライブラリ
- `src/lib/apiFetch.ts` — fetchラッパー（credentials: 'include'・エラーハンドリング）
- `src/lib/queryClient.ts` — QueryClientインスタンス（retry: 1・staleTime: 5分）

### クエリ
- `src/queries/common.ts` — `userInfoQueryOptions`・`batchDateQueryOptions`
- `src/queries/sampleA.ts` — `sampleAType1QueryOptions`・`sampleAType2QueryOptions`
- `src/queries/sampleB.ts` — `sampleBType1QueryOptions`

### 共通UIコンポーネント
- `src/components/ui/LoadingView.tsx` — ローディング表示
- `src/components/ui/ErrorView.tsx` — エラー表示

### ユーティリティ
- `src/utils/formatDate.ts` — ISO日付→日本語形式（`2024-01-01` → `2024年01月01日`）
- `src/utils/formatDate.test.ts` — Vitestテスト

### NativeBridge
- `src/bridge/index.ts` — iOS（webkit）・Android（MebViewInterface）対応

### MSW
- `src/mocks/data/common.ts` — mockUserInfo・mockBatchDate
- `src/mocks/data/sampleA.ts` — mockSampleAType1Data・mockSampleAType2Data
- `src/mocks/data/sampleB.ts` — mockSampleBType1Data
- `src/mocks/handlers/common.ts` — `/api/user/info`・`/api/batch/date`
- `src/mocks/handlers/sampleA.ts` — `/api/sample_a/type_1`・`/api/sample_a/type_2`
- `src/mocks/handlers/sampleB.ts` — `/api/sample_b/type_1`
- `src/mocks/handlers/index.ts` — 全ハンドラー集約
- `src/mocks/browser.ts` — setupWorker

### ルーティング
- `src/routes/__root.tsx` — rootRoute（loader: userInfo・batchDate）
- `src/routes/index.tsx` — / ルート
- `src/routes/sampleModal/index.tsx` — クエリパラメータ形式（Nativeからの入口）
- `src/routes/sampleModal/$from/$serviceType.tsx` — パスパラメータ形式

### ページ・コンテナ
- `src/pages/SampleModal/index.tsx` — CONTAINER_MAPで切り替え
- `src/pages/SampleModal/containers/index.ts` — `satisfies`で型チェック済みCONTAINER_MAP
- `src/pages/SampleModal/containers/SampleA/Type1/index.tsx` — useQuery + LoadingView/ErrorView
- `src/pages/SampleModal/containers/SampleA/Type2/index.tsx` — useQuery + LoadingView/ErrorView
- `src/pages/SampleModal/containers/SampleB/Type1/index.tsx` — useQuery + LoadingView/ErrorView

### Storybook
- `src/pages/SampleModal/containers/SampleA/Type1/index.stories.tsx` — Default・Loading・Error
- `src/pages/SampleModal/containers/SampleA/Type2/index.stories.tsx` — Default・Loading・Error
- `src/pages/SampleModal/containers/SampleB/Type1/index.stories.tsx` — Default・Loading・Error

### Playwright E2E
- `tests/e2e/fixtures/auth.ts` — 認証fixture（PoC段階はpassthrough）
- `tests/e2e/fixtures/nativeBridge.ts` — webkit/MebViewInterfaceをaddInitScriptでモック
- `tests/e2e/sampleModal.spec.ts` — 5シナリオ（正常表示3件・エラー系2件）

---

## 動作確認済みURL

```
# クエリパラメータ形式（Nativeからの実際の入口）
http://localhost:5173/sampleModal?from=sample_a&serviceType=type_1  → SampleAType1Container
http://localhost:5173/sampleModal?from=sample_a&serviceType=type_2  → SampleAType2Container
http://localhost:5173/sampleModal?from=sample_b&serviceType=type_1  → SampleBType1Container
http://localhost:5173/sampleModal?from=invalid&serviceType=type_1   → Zodバリデーションエラー → errorComponent

# パスパラメータ形式（開発・将来の移行先）
http://localhost:5173/sampleModal/sample_a/type_1  → SampleAType1Container（APIコール済み）
http://localhost:5173/sampleModal/sample_a/type_2  → SampleAType2Container（APIコール済み）
http://localhost:5173/sampleModal/sample_b/type_1  → SampleBType1Container（APIコール済み）
http://localhost:5173/sampleModal/sample_a/type_3  → 「対応するコンテナが見つかりません」
http://localhost:5173/sampleModal/invalid/type_1   → Zodバリデーションエラー → errorComponent
```

---

## 起動コマンド

```bash
# 開発サーバー
pnpm dev

# Storybook
pnpm storybook

# ユニットテスト（Storybook stories含む）
pnpm test

# E2Eテスト（dev serverが自動起動）
pnpm playwright test

# ビルド
pnpm build
```

---

## 次のタスク

### 優先度中
- [ ] Playwright Visual Regression Test（@storybook/test-runner）

### 優先度低
- [ ] CI/CD設定（GitHub Actions）
- [ ] Chromatic連携（StorybookのVisual Regression）

---

## 重要な注意事項

### MSW
- `msw-storybook-addon@2.x` を使用。MSW v2.13.0との互換性問題（`worker.context`削除）を `patches/msw-storybook-addon@2.0.6.patch` で対応済み
- `public/mockServiceWorker.js` は `pnpm dlx msw init public/ --save` で生成済み
- 新しいAPIを追加したら `src/mocks/handlers/` にハンドラーを追加し `index.ts` に集約すること
- ハンドラーのURLパターンは `*/api/...` ではなく `/api/...`（相対パス）を使うこと（MSW v2の仕様）

### TanStack Router
- `src/routes/` はルート定義のみ。ロジックは `src/pages/` に置く
- `routeTree.gen.ts` は自動生成ファイル。手動編集しないこと
- パスパラメータのバリデーションは `params.parse` でZodを使う
- クエリパラメータのバリデーションは `validateSearch` でZodを使う

### ルーティング設計（2つのルートが存在する理由）

リプレイス前のNativeアプリがクエリパラメータ形式（`?from=&serviceType=`）でWebViewを起動するため、
互換性のためにクエリパラメータ形式のルートを維持している。

```
Native → /sampleModal?from=sample_a&serviceType=type_1
                ↓ validateSearch（Zod）
         SampleModalPage へ props を渡す（URLはそのまま）
```

ページコンポーネント（`SampleModalPage`）はルートの形式を知らない設計になっており、
`from` / `serviceType` を props で受け取るだけ。
これにより将来パスパラメータへ完全移行する際は、
`src/routes/sampleModal/index.tsx` を削除するだけで済む。

```
# 将来の移行後（index.tsx を削除するだけ）
Native → /sampleModal/sample_a/type_1
                ↓ params.parse（Zod）
         SampleModalPage へ props を渡す
```

### Storybook
- Storyは必ず **Default・Loading・Error** の3点セットで作る
- コンポーネントと同じディレクトリに `index.stories.tsx` として置く
- `import type { Meta, StoryObj }` は `@storybook/react-vite` からimportすること（`@storybook/react` は直接symlink されていない）
- MSWハンドラーはStory単位で `parameters.msw.handlers` でオーバーライド可能
- Loading: `delay('infinite')` で永続ローディング状態を再現
- Error: `HttpResponse.error()` で明示的にネットワークエラーを返す

### NativeBridge
- `getNativeBridge()` を呼び出すと実行時にwebkit / MebViewInterfaceの存在チェックが走る
- Storybook・Vitest環境ではこれらが存在しないため、コンポーネント内では必ずイベントハンドラ等の中で呼び出すこと（モジュールトップレベルでのimportは問題ない）

### 型安全
- `any` は禁止。`unknown` + 型ガードを使う
- APIレスポンスの型は `src/types/api/` に定義する
- `CONTAINER_MAP` は `satisfies Record<FromType, Partial<Record<ServiceType, React.ComponentType>>>` で型チェック

### 既知の不整合（要対応）
- `src/mocks/handlers/common.ts` が `{ result: ... }` でレスポンスをラップしているが、`src/queries/common.ts` の型はラップなしの `UserInfoResponse` / `BatchDateResponse`
- `userInfo`・`batchDate` はまだどのコンポーネントでも参照されていないため現状は問題なし
- 実際に使い始めるタイミングでハンドラー or クエリの型を統一すること
