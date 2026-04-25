---
paths: ['src/**/*.tsx', 'src/**/*.ts']
---

# 設計原則・アーキテクチャ

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

**移行トリガー：**`eslint-plugin-react-hooks` 相当の機能がBiomeに追加されたタイミング。
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
├── assets/                          # 複数ページで共有するアセット
│   ├── icons/                       # 共有SVGアイコン（close・arrowなど）
│   └── images/                      # 共有画像（PNG・JPG等）
│
├── pages/                           # ページ単位の実装
│   └── sampleModal/
│       ├── assets/                  # sampleModal専用の画像
│       ├── index.tsx                # CONTAINER_MAPでContainerを切り替えるだけ
│       └── containers/
│           ├── index.ts             # CONTAINER_MAP定義
│           ├── sampleA/
│           │   ├── components/      # sampleA内で複数コンテナが共有するコンポーネント
│           │   ├── type1/
│           │   │   ├── index.tsx
│           │   │   └── index.stories.tsx
│           │   └── type2/
│           │       ├── index.tsx
│           │       └── index.stories.tsx
│           └── sampleB/
│               └── type1/
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
├── constants/                       # 定数定義
│   └── apiEndpoints.ts              # APIエンドポイントURL一元管理（api-design.md参照）
│
├── queries/                         # TanStack Query queryOptions定義
│   ├── common.ts                    # userInfo・batchDate（全ページ共通API）
│   ├── sampleA.ts                   # sampleA用queryOptions（type1・type2）
│   └── sampleB.ts                   # sampleB用queryOptions（type1）
│
├── types/                           # 共通型定義
│   ├── routing.ts                   # クエリパラメータ・パスパラメータの型と定数
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
    ├── sampleModal.spec.ts
    └── visual.spec.ts          # ビジュアルリグレッションテスト

.storybook/
├── main.ts
└── preview.ts

public/
└── mockServiceWorker.js             # MSW Service Worker（pnpm dlx msw initで生成済み）
```

詳細な配置ルールは `@.claude/rules/file-placement.md` を参照。
ルーティング設計の詳細は `@.claude/rules/routing.md` を参照。
