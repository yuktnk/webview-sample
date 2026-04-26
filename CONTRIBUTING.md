# Contributing Guide

## コミットメッセージ

[Conventional Commits](https://www.conventionalcommits.org/) 形式を使う。commitlint で自動チェックされる。

```
feat: ログアウト処理を追加
fix: Android で onClickClose が呼ばれない問題を修正
refactor: SampleA コンテナを分割
docs: ADR-014 を追加
chore: 依存パッケージを更新
```

---

## PR を出す前のチェックリスト

```bash
pnpm typecheck   # 型エラーなし
pnpm lint        # ESLint エラーなし
pnpm biome       # Biome lint + format エラーなし
pnpm test        # Vitest 全テスト通過
pnpm knip        # 未使用ファイル・export なし
```

lefthook が pre-commit と pre-push で一部を自動チェックする。

---

## コマンド一覧

```bash
# 開発
pnpm local           # 開発サーバー起動（MSW自動起動）
pnpm storybook       # Storybook

# テスト
pnpm test            # Vitest（Storybook stories含む）
pnpm test:watch      # Vitest ウォッチモード
pnpm test:coverage   # カバレッジレポート生成
pnpm test:e2e        # Playwright E2E（dev server自動起動）
pnpm test:visual     # ビジュアルリグレッション（スナップショット更新）
pnpm a11y            # アクセシビリティ監査

# 静的解析
pnpm typecheck       # 型チェック
pnpm lint            # ESLint
pnpm lint:fix        # ESLint 自動修正
pnpm biome           # Biome lint + format チェック
pnpm biome:fix       # Biome 自動修正
pnpm knip            # 未使用コード・依存関係の検出

# ビルド
pnpm build:local     # ローカル本番用
pnpm build:dev       # GCP dev プロジェクト
pnpm build:stg       # GCP stg プロジェクト
pnpm build:prd       # GCP prd プロジェクト
pnpm bundle          # バンドルサイズ分析（dist/bundle-analysis.html）
```

---

## 実装時のルール

新機能を実装する前に以下を一読する。

| 何をするか | 参照先 |
| --- | --- |
| ファイルをどこに置くか | [.claude/rules/file-placement.md](.claude/rules/file-placement.md) |
| 命名規則 | [.claude/rules/naming.md](.claude/rules/naming.md) |
| ルーティング・パラメータ | [.claude/rules/routing.md](.claude/rules/routing.md) |
| API 設計（エンドポイント追加） | [.claude/rules/api-design.md](.claude/rules/api-design.md) |
| デザインシステム（Tailwind の使い方） | [.claude/rules/design-system.md](.claude/rules/design-system.md) |
| NativeBridge の呼び出し | [.claude/rules/native-bridge.md](.claude/rules/native-bridge.md) |

---

## テストの書き方

テスト戦略の詳細は [.claude/rules/testing.md](.claude/rules/testing.md) を参照。

### 最低限のルール

- **新しいコンテナ**を追加したら Storybook の Story を3点セット（Default・Loading・Error）揃える
- **ユーティリティ関数・カスタムフック**に Vitest を書く
- **API モックハンドラー**は `src/mocks/handlers/` に集約する（Story・Vitest・Playwright で共通利用）

---

## 設計方針に迷ったら

[docs/adr/](docs/adr/) に技術的な意思決定の記録がある。「なぜこの構成か」を知りたいときはここを先に確認する。

新しい技術的決定をした場合は ADR を追加する（番号は連番）。
