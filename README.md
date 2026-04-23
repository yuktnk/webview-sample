# webview-sample

WebViewアプリのフルリプレイスPoCプロジェクトの実装サンプル。

## クイックスタート

```bash
# Node.jsバージョンを合わせる
nvm use

# 依存パッケージインストール
pnpm install

# 開発サーバー起動
pnpm dev
```

Storybook: `pnpm storybook`

## コマンド一覧

```bash
# 開発サーバー（MSW自動起動）
pnpm dev

# Storybook
pnpm storybook

# ユニットテスト（Storybook stories含む）
pnpm test

# ユニットテスト（ウォッチモード）
pnpm test:watch

# カバレッジレポート生成
pnpm test:coverage

# E2Eテスト（dev serverが自動起動）
pnpm test:e2e

# ビルド
pnpm build

# 型チェック
pnpm typecheck

# Lintチェック
pnpm lint

# Lint自動修正
pnpm lint:fix

# コード整形
pnpm format

# コード整形の確認（変更なし）
pnpm format:check

# 未使用コード・依存関係の検出
pnpm knip
```

## 動作確認URL

開発サーバー起動後に以下のURLで確認できる。

| URL                                             | 表示内容                                    |
| ----------------------------------------------- | ------------------------------------------- |
| `/sampleModal?from=sample_a&serviceType=type_1` | SampleAType1Container                       |
| `/sampleModal?from=sample_a&serviceType=type_2` | SampleAType2Container                       |
| `/sampleModal?from=sample_b&serviceType=type_1` | SampleBType1Container                       |
| `/sampleModal?from=invalid&serviceType=type_1`  | Zodバリデーションエラー                     |
| `/sampleModal/sample_a/type_1`                  | SampleAType1Container（パスパラメータ形式） |
| `/sampleModal/sample_a/type_3`                  | 「対応するコンテナが見つかりません」        |
| `/sampleModal/invalid/type_1`                   | Zodバリデーションエラー                     |

## 詳細情報

| 項目                         | 場所                                                               |
| ---------------------------- | ------------------------------------------------------------------ |
| **技術スタック**             | [CLAUDE.md](./CLAUDE.md)                                           |
| **設計原則・アーキテクチャ** | [.claude/rules/architecture.md](./.claude/rules/architecture.md)   |
| **API 設計ポリシー**         | [.claude/rules/api-design.md](./.claude/rules/api-design.md)       |
| **テスト戦略**               | [.claude/rules/testing.md](./.claude/rules/testing.md)             |
| **品質保証**                 | [.claude/rules/quality.md](./.claude/rules/quality.md)             |
| **デザインシステム**         | [.claude/rules/design-system.md](./.claude/rules/design-system.md) |
| **ドキュメント**             | [docs/](./docs/)                                                   |
| **実装ルール一覧**           | [.claude/rules/](./.claude/rules/)                                 |
