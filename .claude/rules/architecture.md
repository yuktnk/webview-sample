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
    └── sampleModal.spec.ts

.storybook/
├── main.ts
└── preview.ts

public/
└── mockServiceWorker.js             # MSW Service Worker（pnpm dlx msw initで生成済み）
```

---

## コンポーネント設計（スコープとファイル配置）

**原則：「最初は最も近い場所に置いて、共有が必要になったら一段上に移動する」**

```
src/
├── components/ui/           ← 複数ページで使う汎用UI（LoadingView・ErrorViewなど）
└── pages/SampleModal/
    ├── components/          ← SampleModal内で複数コンテナが共有するコンポーネント
    │   └── DataCard.tsx      ← 例: Type1・Type2の両方で使うデータ表示カード
    └── containers/
        ├── SampleA/
        │   ├── components/   ← Type1・Type2が共有するコンポーネント
        │   ├── Type1/
        │   │   └── index.tsx
        │   └── Type2/
        │       └── index.tsx
        └── SampleB/
            └── Type1/
                ├── index.tsx
                └── ChartWidget.tsx  ← Type1だけで使う場合、同階層に配置
```

**ルール：**

| スコープ                | 置き場所                                |
| ----------------------- | --------------------------------------- |
| Type1 だけで使う        | `containers/SampleA/Type1/` 内に配置    |
| Type1・Type2 両方で使う | `containers/SampleA/components/` に配置 |
| SampleModal 全体で使う  | `pages/SampleModal/components/` に配置  |
| 複数ページで使う        | `src/components/` に配置                |

同じコンポーネントを別の場所でも使いたくなったら、そのタイミングで一段上に移動する。
「いつか使い回すかも」で早めに汎用化しすぎると、本当に汎用なのか判断しにくくなるため避ける。

---

## ルーティング設計

### 概要

このアプリは以下の2つのルート形式をサポートしています。

- **クエリパラメータ形式**：Native からのリクエスト互換性のため
- **パスパラメータ形式**：標準的な SPA ルーティング

### パラメータ定義

#### FromType

ページの種類を識別する値。

```ts
type FromType = 'sample_a' | 'sample_b'
```

有効な値：

| 値         | 説明           |
| ---------- | -------------- |
| `sample_a` | SampleA ページ |
| `sample_b` | SampleB ページ |

#### ServiceType

ページ内のサービス・表示形式を識別する値。

```ts
type ServiceType = 'type_1' | 'type_2' | 'type_3' | 'type_4' | 'type_5'
```

有効な値：

| 値       | 説明       |
| -------- | ---------- |
| `type_1` | Type1 表示 |
| `type_2` | Type2 表示 |
| `type_3` | Type3 表示 |
| `type_4` | Type4 表示 |
| `type_5` | Type5 表示 |

### ルート一覧

#### クエリパラメータ形式

Native からのリクエストに対応。

```
/sampleModal?from={FromType}&serviceType={ServiceType}
```

例：

```
/sampleModal?from=sample_a&serviceType=type_1
/sampleModal?from=sample_b&serviceType=type_2
```

**バリデーション**：Zod の `z.enum()` で `FromType` と `ServiceType` を検証

#### パスパラメータ形式

標準的な SPA ルーティング。

```
/sampleModal/{FromType}/{ServiceType}
```

例：

```
/sampleModal/sample_a/type_1
/sampleModal/sample_b/type_2
```

**バリデーション**：Zod の `params.parse()` で `FromType` と `ServiceType` を検証

### エラーハンドリング

#### バリデーションエラー

無効な `FromType` または `ServiceType` が渡された場合、`ErrorView` を表示。

```
/sampleModal?from=invalid&serviceType=type_1
→ "エラーが発生しました"
```

#### コンテナが見つからない

`FromType` は有効だが、対応する `ServiceType` が定義されていない場合。

```
/sampleModal/sample_a/type_3
→ "対応するコンテナが見つかりません"
```

### 実装詳細

- `src/types/routing.ts` — `FromType` / `ServiceType` の定義
- `src/routes/sampleModal/index.tsx` — クエリパラメータ形式のルート定義
- `src/routes/sampleModal/$from/$serviceType.tsx` — パスパラメータ形式のルート定義
