# webview-sample — Claude Code 指示書

## プロジェクト概要

WebViewアプリのフルリプレイスPoCプロジェクトの実装サンプル。

---

## 技術スタック

| 役割                   | ライブラリ                                                | バージョン |
| ---------------------- | --------------------------------------------------------- | ---------- |
| ビルド                 | Vite                                                      | 8.x        |
| UI                     | React                                                     | 19.x       |
| 言語                   | TypeScript（strict: true）                                | 6.x        |
| ルーティング           | TanStack Router（ファイルルーティング）                   | 1.x        |
| サーバー状態管理       | TanStack Query                                            | 5.x        |
| バリデーション         | Zod                                                       | 4.x        |
| スタイリング           | Tailwind CSS                                              | 4.x        |
| ローカル状態           | useState / useReducer（グローバル状態管理ライブラリなし） | -          |
| APIクライアント        | fetch（built-in）+ 薄いラッパー（axiosなし）              | -          |
| コンポーネントテスト   | Storybook                                                 | 10.x       |
| ユニットテスト         | Vitest                                                    | 4.x        |
| E2Eテスト              | Playwright                                                | 1.x        |
| APIモック              | MSW（Mock Service Worker）                                | 2.x        |
| 条件クラス名           | clsx                                                      | 2.x        |
| Gitフック              | lefthook                                                  | 2.x        |
| コミット規約           | commitlint（Conventional Commits）                        | 20.x       |
| 機密情報検出           | secretlint                                                | 11.x       |
| 未使用コード検出       | knip                                                      | 6.x        |
| パッケージマネージャー | pnpm                                                      | 10.x       |
| Node.js                | 24.x（.nvmrcで固定）                                      | -          |

---

## 設計原則（重要）

### 1. 1ページ = 1WebView

- Native が都度 WebView を起動・閉じると JS コンテキストごとリセット
- ページ間の状態共有は不要 → Zustand / Jotai は使わない
- グローバル状態管理ライブラリ不要

### 2. 静的解析ツールの移行方針

現在はESLint + Prettierを使用している。将来的にBiomeへの移行を検討しているが、
以下の理由から現時点では移行しない。

- `eslint-plugin-react-hooks`（`rules-of-hooks`・`exhaustive-deps`）のBiome対応が未完了
- `eslint-plugin-react-refresh`・`eslint-plugin-storybook` も未対応

**移行トリガー：`eslint-plugin-react-hooks` 相当の機能がBiomeに追加されたタイミング。**
移行時はコード変更不要で設定ファイルの置き換えのみ（半日程度の作業）。

### 3. 依存ライブラリは最小限

- axios → fetch（built-in）で代替
- Redux → TanStack Query + useState で代替
- 「使えそう」ではなく「使う理由がある」ものだけ入れる

### 4. TypeScript strict: true を妥協しない

- `any` は原則禁止。`unknown` + 型ガードで代替
- `ignoreBuildErrors` は絶対に使わない

### 5. テスト可能な設計

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

## インフラ方針

App EngineのランタイムはPythonを使用する。

```yaml
# app.yaml
runtime: python312

handlers:
  - url: /.*
    static_files: dist/index.html
    upload: dist/index.html

  - url: /assets
    static_dir: dist/assets
```

**なぜPythonか：**
このアプリは静的ファイル配信のみで動作する設計であり、Node.jsサーバーを必要とするReact Server Components等の実装を意図的に防いでいる。別の既存SPAアプリもPythonランタイムで統一しており、EOSL対応を一元化するため。

**絶対にやってはいけないこと：**

- ランタイムをNode.jsに変更すること
- サーバーコンポーネントを実装すること（Node.jsランタイムが必要になるため）

---

## 次のタスク

### 優先度低

- [ ] CI/CD設定（GitHub Actions）
- [ ] Playwright Visual Regression Test（`toHaveScreenshot()`）← CI/CD整備と同時に導入

---

## 開発環境・コード品質

### Lefthook（導入済み）

- lefthook → ローカルで素早く気づく（開発者体験）
- CI/CD → 絶対に通過させる関門（品質保証）
- `--no-verify` でスキップできるため、CI/CDが本番の砦

**設計判断：**

- 型チェックはpre-pushに置く（pre-commitだと重い）
- lintとformatはステージングされたファイルのみ対象（`{staged_files}`）
- E2EテストはCI/CDのみ（Playwrightはローカルで走らせるには重すぎる）

設定は `lefthook.yml` を参照。

### CI/CD（GitHub Actions・未導入）

導入時の実行ステップ: `pnpm install` → `pnpm typecheck` → `pnpm lint` → `pnpm format:check` → `pnpm test` → `pnpm build`

---

## 重要な注意事項

### MSW

- `msw-storybook-addon@2.x` を使用（MSW v2との互換性問題は2.0.7で解消済み）
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

#### ZodによるAPIレスポンス検証（方針）

現状は手書き型定義のみだが、APIレスポンスはZodでパースする方針に移行する。

**理由：**

- OpenAPI specがないため、手書き型定義とAPIの実際のレスポンスが乖離するリスクがある
- Zodによる実行時パースはAPIの変更を即座に検知でき、バックエンド側の品質担保にもなる

```ts
// 現状（型アサーションのみ・実行時チェックなし）
const data = await apiFetch<{ result: SampleAType1Response }>('/api/sample_a/type_1')

// 移行後（Zodで実行時検証）
const SampleAType1Schema = z.object({ ... })
const data = SampleAType1Schema.parse(await apiFetch('/api/sample_a/type_1'))
```

**移行タイミング：** 実APIとの結合時。現状はMSWモックのみのため優先度低。

### 既知の不整合（要対応）

- `src/mocks/handlers/common.ts` が `{ result: ... }` でレスポンスをラップしているが、`src/queries/common.ts` の型はラップなしの `UserInfoResponse` / `BatchDateResponse`
- `userInfo`・`batchDate` はまだどのコンポーネントでも参照されていないため現状は問題なし
- 実際に使い始めるタイミングでハンドラー or クエリの型を統一すること
