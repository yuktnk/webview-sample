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
    └── sampleModal.spec.ts

.storybook/
├── main.ts
└── preview.ts

public/
└── mockServiceWorker.js             # MSW Service Worker（pnpm dlx msw initで生成済み）
```

---

## コンポーネント・フック設計（スコープとファイル配置）

**原則：「最初は最も近い場所に置いて、共有が必要になったら一段上に移動する」**

UI コンポーネントとロジック（カスタムフック）は同じスコープ原則に従い、階層的に管理します。

### ディレクトリ構成

```
src/
├── components/ui/           ← 複数ページで使う汎用UI（LoadingView・ErrorViewなど）
├── hooks/                   # 複数ページで使う共通フック
│   ├── useQuery.ts          # TanStack Query ラッパー（例）
│   └── useDebounce.ts
└── pages/sampleModal/
    ├── components/          ← sampleModal内で複数コンテナが共有するコンポーネント
    │   └── DataCard.tsx      ← 例: type1・type2の両方で使うデータ表示カード
    ├── hooks/                # sampleModal内で複数コンテナが共有するフック
    │   ├── useSampleDataFetch.ts
    │   └── useModalState.ts
    └── containers/
        ├── sampleA/
        │   ├── components/   ← type1・type2が共有するコンポーネント
        │   ├── hooks/        # type1・type2が共有するフック
        │   │   └── useCommonLogic.ts
        │   ├── type1/
        │   │   ├── index.tsx
        │   │   ├── ChartWidget.tsx   # type1だけで使うコンポーネント
        │   │   └── hooks.ts           # type1だけで使うフック
        │   └── type2/
        │       └── index.tsx
        └── sampleB/
            └── type1/
                ├── index.tsx
                └── hooks.ts           # type1だけで使うフック
```

### スコープルール

| スコープ                | コンポーネント配置                      | フック配置                          |
| ----------------------- | --------------------------------------- | ----------------------------------- |
| type1 だけで使う        | `containers/sampleA/type1/` 内に配置    | `containers/sampleA/type1/hooks.ts` |
| type1・type2 両方で使う | `containers/sampleA/components/` に配置 | `containers/sampleA/hooks/` に配置  |
| sampleModal 全体で使う  | `pages/sampleModal/components/` に配置  | `pages/sampleModal/hooks/` に配置   |
| 複数ページで使う        | `src/components/` に配置                | `src/hooks/` に配置                 |

### ファイル命名規則

詳細は `@.claude/rules/naming.md` を参照。

### 移動ルール

同じコンポーネントやフックを別の場所でも使いたくなったら、そのタイミングで一段上に移動します。
「いつか使い回すかも」で早めに汎用化しすぎると、本当に汎用なのか判断しにくくなるため避けます。

---

## アセット（画像）配置ルール

### 判断フロー

```
複数のページで使う？
  Yes → src/assets/icons/（SVG）または src/assets/images/（PNG・JPG等）
  No  → src/pages/{pageName}/assets/
```

### ディレクトリ構成

```
src/
├── assets/
│   ├── icons/          ← 全ページ共通のSVGアイコン（close.svg・arrow.svg など）
│   └── images/         ← 全ページ共通の画像（logo.png など）
│
└── pages/
    └── sampleModal/
        └── assets/     ← sampleModal専用の画像（banner.png など）
```

### ルール

- 画像は必ず JS/TS の `import` で参照する（CSS の `url()` や `<img src="...">` の文字列直書きは禁止）
- `public/` には URL 文字列で参照する必要があるファイルのみ置く（MSW の `mockServiceWorker.js` など）
- 最初はページ専用として `pages/{pageName}/assets/` に置き、複数ページで使うことが確定したら `src/assets/` に移動する

### SVG の使い方（`vite-plugin-svgr`）

SVG は `?react` suffix で React コンポーネントとして import する。
これにより Tailwind で色・サイズを制御でき、追加のHTTPリクエストも発生しない。

```tsx
// ✅ React コンポーネントとして import（色・サイズを Tailwind で制御）
import CloseIcon from '@/assets/icons/close.svg?react'
;<CloseIcon className="w-6 h-6 text-neutral-550" />

// ❌ URL として import（色変更不可・<img> タグが必要）
import closeUrl from '@/assets/icons/close.svg'
;<img src={closeUrl} alt="閉じる" />
```

### PNG の使い方

スマートフォンは画面密度が2〜3倍のため、2x サイズ（表示サイズの2倍の解像度）の PNG を用意する。

```tsx
import banner from '@/pages/sampleModal/assets/banner.png'

// 2x サイズの画像を 1x として表示（Retina 対応）
;<img src={banner} alt="バナー" />
```

### knip による未使用検知

`knip.config.ts` の compilers に画像拡張子を定義しているため、どこからも `import` されていない画像は knip が検知する。

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
