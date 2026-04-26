# webview-sample ドキュメント

プロジェクトのドキュメント置き場。

## 目次

- **[adr/](./adr/)** — 技術的決定の経緯（Architecture Decision Record）※手動管理
- **[pages/](./pages/)** — 画面ごとの仕様・パラメータ・API ※スキルで自動生成
- **[api/](./api/)** — API エンドポイント単位のドキュメント ※スキルで自動生成

## ドキュメント生成方法

実装完了（Story + E2E テスト）後、Claude に `/generate-docs-pages` / `/generate-docs-api` スキルを実行してもらい、自動生成します。

詳細な使い方・運用ルールは [`@.claude/rules/docs-generation.md`](./../.claude/rules/docs-generation.md) を参照してください。

## Storybook

最新の UI コンポーネント表示は Storybook で確認してください。

- **開発環境**: `https://[dev-project].appspot.com/storybook`
- **ローカル**: `pnpm storybook` で `http://localhost:6006` にアクセス
