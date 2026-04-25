---
# paths 未定義: 既存ファイル編集時は不要。新規ファイル作成時に明示的参照。
---

# ファイル配置ルール

コンポーネント・フック・アセットの「どこに置くか」を定める。

**原則：「最初は最も近い場所に置いて、共有が必要になったら一段上に移動する」**

---

## コンポーネント・フック設計（スコープと配置）

UI コンポーネントとロジック（カスタムフック）は同じスコープ原則に従い、階層的に管理する。

### ディレクトリ構成

```
src/
├── components/ui/           ← 複数ページで使う汎用UI（LoadingView・ErrorViewなど）
├── hooks/                   # 複数ページで使う共通フック
└── pages/sampleModal/
    ├── components/          ← sampleModal内で複数コンテナが共有するコンポーネント
    ├── hooks/               # sampleModal内で複数コンテナが共有するフック
    └── containers/
        ├── sampleA/
        │   ├── components/  ← type1・type2が共有するコンポーネント
        │   ├── hooks/       # type1・type2が共有するフック
        │   ├── type1/
        │   │   ├── index.tsx
        │   │   ├── ChartWidget.tsx  # type1だけで使うコンポーネント
        │   │   └── hooks.ts         # type1だけで使うフック
        │   └── type2/
        │       └── index.tsx
        └── sampleB/
            └── type1/
                ├── index.tsx
                └── hooks.ts         # type1だけで使うフック
```

### スコープルール

| スコープ                | コンポーネント配置                      | フック配置                          |
| ----------------------- | --------------------------------------- | ----------------------------------- |
| type1 だけで使う        | `containers/sampleA/type1/` 内に配置    | `containers/sampleA/type1/hooks.ts` |
| type1・type2 両方で使う | `containers/sampleA/components/` に配置 | `containers/sampleA/hooks/` に配置  |
| sampleModal 全体で使う  | `pages/sampleModal/components/` に配置  | `pages/sampleModal/hooks/` に配置   |
| 複数ページで使う        | `src/components/` に配置                | `src/hooks/` に配置                 |

### 移動ルール

同じコンポーネントやフックを別の場所でも使いたくなったら、そのタイミングで一段上に移動する。
「いつか使い回すかも」で早めに汎用化しすぎると、本当に汎用なのか判断しにくくなるため避ける。

ファイル命名規則の詳細は `@.claude/rules/naming.md` を参照。

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
Tailwind で色・サイズを制御でき、追加の HTTP リクエストも発生しない。

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
