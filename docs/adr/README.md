# Architecture Decision Records

このディレクトリは、プロジェクトの重要な技術的決定を記録した ADR（Architecture Decision Record）を管理します。

---

## ADR とは

「なぜそう決めたか」を未来の自分やチームに伝えるためのドキュメントです。
実装ルール（**どうやるか**）は `.claude/rules/` に、決定の背景（**なぜそうしたか**）はここに記録します。

## フォーマット

各 ADR は以下の 4 セクションで構成します。

| セクション       | 内容                                                |
| ---------------- | --------------------------------------------------- |
| **Status**       | `Accepted` / `Superseded by ADR-XXX` / `Deprecated` |
| **Context**      | 何が問題で、どんな選択肢があったか                  |
| **Decision**     | 何を決めたか（1〜2 文で端的に）                     |
| **Consequences** | この決定がもたらすメリット・デメリット・制約        |

## 一覧

| #                                             | タイトル                                                     | ステータス |
| --------------------------------------------- | ------------------------------------------------------------ | ---------- |
| [ADR-001](./001-full-replace.md)              | フルリプレイスを採用する                                     | Accepted   |
| [ADR-002](./002-app-engine-python-runtime.md) | App Engine ランタイムを Python にする                        | Accepted   |
| [ADR-003](./003-tanstack-router.md)           | TanStack Router を採用する                                   | Accepted   |
| [ADR-004](./004-no-global-state-library.md)   | グローバル状態管理ライブラリを使わない                       | Accepted   |
| [ADR-005](./005-tailwind-css.md)              | Tailwind CSS を採用する                                      | Accepted   |
| [ADR-006](./006-test-strategy.md)             | テスト戦略（Storybook + Playwright + MSW の 3 層）を採用する | Accepted   |
| [ADR-007](./007-fetch-over-axios.md)          | axios を使わず fetch + 薄いラッパーにする                    | Accepted   |
| [ADR-008](./008-typescript-strict.md)         | TypeScript strict モードを妥協しない                         | Accepted   |
| [ADR-009](./009-vite-react-over-nextjs.md)    | Next.js を使わず Vite + React（SPA）にする                   | Accepted   |
| [ADR-010](./010-tanstack-query.md)            | TanStack Query をサーバー状態管理に採用する                  | Accepted   |
| [ADR-011](./011-zod.md)                       | バリデーションを Zod に統一する                              | Accepted   |
| [ADR-012](./012-eslint-over-biome.md)         | 現時点では ESLint + Prettier を維持し Biome への移行を見送る | Superseded |
| [ADR-013](./013-biome-eslint-minimal.md)      | Biome をメインツールとし ESLint を最小構成で併用する         | Accepted   |
