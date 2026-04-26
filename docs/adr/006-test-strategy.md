# ADR-006: テスト戦略（Storybook + Playwright + MSW の 3 層）を採用する

|            |            |
| ---------- | ---------- |
| **Status** | Accepted   |
| **Date**   | 2026-04-01 |

---

## Context

旧実装のテスト状況は以下のとおりで、実質テストが存在しない状態だった。

- ユニットテスト：395 ファイル中 4 ファイルのみ（カバレッジ事実上 0%）
- コンポーネントテスト：なし（Storybook は入っているが Story は 3 ファイルのみ）
- E2E テスト：なし
- NativeBridge（`window.webkit` / `window.AndroidBridge`）のモックが未整備

### テストがない状態の問題

- リファクタリング・機能追加時のデグレードを自動検知できない
- エラー状態・ローディング状態の UI を確認するには本番に近い環境で条件を作り出すしかない
- これがフルリプレイスを選んだ理由の一つでもある（ADR-001 参照）

### テストピラミッドの設計

```
         ┌─────────────────────┐
         │   E2E（Playwright）  │  ← WebView の動作をエンドツーエンドで保証
         ├─────────────────────┤
         │  Storybook          │  ← コンポーネントの UI・状態を視覚的に保証
         ├─────────────────────┤
         │  ユニット（Vitest）  │  ← ユーティリティ・カスタムフックのロジック保証
         └─────────────────────┘
```

**基本方針：Storybook + Playwright を中心に据え、Vitest はユーティリティ関数・カスタムフックの最小限に留める。**

コンポーネントのレンダリングテストは Storybook の Story で担保し、ユニットテストのボイラープレートを最小化する。

### MSW によるモック統一

|                          | MSW | Playwright `route()` のみ | axios-mock-adapter |
| ------------------------ | --- | ------------------------- | ------------------ |
| Storybook でも使える     | ✅  | ❌                        | ❌                 |
| Vitest でも使える        | ✅  | ❌                        | ❌                 |
| Playwright でも使える    | ✅  | ✅                        | ❌                 |
| モック定義を一箇所に集約 | ✅  | ❌（各テストに分散）      | ❌                 |

MSW を使うことで Storybook・Vitest・Playwright の全レイヤーで同じモック定義を使い回せる。
「Storybook では動いたのに Playwright では動かない」という乖離を防ぐ。

### NativeBridge のモック

`window.webkit` / `window.AndroidBridge` は Playwright の `addInitScript` で Proxy オブジェクトとしてモックし、
呼び出し履歴をアサーションできるようにする。これにより Native との契約をテストで保証できる。

---

## Decision

**Storybook（コンポーネント状態管理）+ Playwright（E2E）を主軸に、MSW でモックを統一する。**

各レイヤーの責務：

- **Vitest**：ユーティリティ関数・カスタムフックの純粋なロジックテストのみ
- **Storybook**：コンポーネント単位の状態（Loading / Error / Default の 3 点セット）管理と UI カタログ
- **Playwright**：ルーティング → API → レンダリングの統合フロー確認。異常系（Zod バリデーション失敗など）もカバー
- **MSW**：上記 3 つすべてで共通利用するモック層

---

## Consequences

**メリット**

- Storybook に Story を書くことで「エラー状態の UI を誰も確認していない」問題が解消される
- MSW のモックハンドラーを一箇所に集約することで、レイヤー間の乖離が生まれない
- Playwright の `getByRole` / `getByLabel` が使えるセマンティック HTML を自然に書くことになる（Tailwind との相乗効果）
- NativeBridge の呼び出しをテストで保証できる

**デメリット・制約**

- 各コンポーネントに Default・Loading・Error の 3 状態の Story を用意する運用が必要になる
- MSW の恩恵（全レイヤーでのモック共有）を活かすにはハンドラーの集約を維持する規律が必要になる
- Storybook と Playwright の責務を明確に分離しないと重複テストが生まれやすい
