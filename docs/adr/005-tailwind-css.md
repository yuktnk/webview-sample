# ADR-005: Tailwind CSS を採用する

|            |            |
| ---------- | ---------- |
| **Status** | Accepted   |
| **Date**   | 2026-04-01 |

---

## Context

旧実装は `styled-components v5` + `classnames` を使用していた。
フルリプレイスにあたり、スタイリング手法を検討した。

### 旧実装の問題

**① ランタイムコスト**
styled-components は実行時に CSS を生成・`<style>` タグに注入するため、WebView のレンダリングに余分なコストがかかる。

**② Playwright との相性**
自動生成されるクラス名（`sc-abc123`）はビルドや構造変化で変わるため、テストセレクタが不安定になる。

**③ React 18 との相性問題**
styled-components v5 は React 18 の Concurrent Mode との相性問題が報告されており、v6 への移行か代替が必要だった。

### 選択肢の比較

|                  | **Tailwind CSS** | styled-components v6 | CSS Modules | Panda CSS    |
| ---------------- | ---------------- | -------------------- | ----------- | ------------ |
| ランタイムコスト | ✅ ゼロ          | 🔴 あり              | ✅ ゼロ     | ✅ ゼロ      |
| Playwright 相性  | ✅               | 🔴                   | △           | ✅           |
| 動的スタイル     | △（clsx で補完） | ✅                   | 🔴          | ✅           |
| 学習コスト       | △                | ✅（既存から最小）   | ✅          | 🔴           |
| 5 年後の将来性   | ✅ 業界標準      | △ 縮小傾向           | ✅ 安定     | △ まだ新しい |
| 移行コスト       | 🔴 書き直し必要  | ✅ 最小              | 🔴          | 🔴           |

### Tailwind が決定打になった理由

**Playwright との設計思想の一致**
Tailwind を使うとセマンティック HTML を書くことが自然なアプローチになる。
これが Playwright 推奨のセレクタ戦略と一致する。

```tsx
// ❌ styled-components：自動生成クラスに頼りがちなセレクタ
page.locator('.sc-abc123') // ビルドで壊れる

// ✅ Tailwind + セマンティック HTML：安定したセレクタ
page.getByRole('button', { name: '送信' })
page.getByLabel('店舗コード')
```

styled-components v6 は移行コストが最小だが、Playwright との相性とランタイムコストの問題が解消されず、5 年後の縮小リスクもあるため不採用とした。

---

## Decision

**Tailwind CSS を採用する。**

動的スタイルの条件分岐には `clsx` を補助的に使う。

---

## Consequences

**メリット**

- ランタイムコストがゼロ（ビルド時に静的 CSS 生成・未使用クラスは purge）
- セマンティック HTML を自然に書くことになり、Playwright の `getByRole` / `getByLabel` による安定したテストが書ける
- デザイントークンを `tailwind.config.ts` で一元管理でき、任意の値の直書きを防げる
- Vite プラグインとしてネイティブ統合されており設定がシンプル

**px を採用・rem を禁止した理由**

このアプリは iOS/Android ネイティブアプリ内の WebView として起動される。
Native 側が `html` タグの `font-size` を制御しないため、`1rem = 16px` の前提が崩れ rem の値が予測不可能になる。

そのため、`tailwind.config.ts` のすべてのトークン（spacing・fontSize・borderRadius）を px 単位に統一した。

```ts
// tailwind.config.ts：トークンを px で定義
spacing: { 1: '4px', 2: '8px', 4: '16px' }
fontSize: { sm: '12px', base: '14px', lg: '18px' }
```

将来 rem に切り替えたい場合は `tailwind.config.ts` の値を変更するだけでよく、コンポーネントの HTML クラスは変更不要。トークンで抽象化されているため移行コストが低い。

**デメリット・制約**

- ユーティリティクラスへの慣れが必要（学習コスト）
- デザイントークンの一元管理を活かすには、トークン外の任意の値（arbitrary value）や rem 単位の混在を避ける規律が必要になる（詳細は `.claude/rules/design-system.md` 参照）
