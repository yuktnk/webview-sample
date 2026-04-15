# webview-sample ドキュメント

WebView アプリの設計・実装に関するドキュメント。

## 目次

- **[pages/](./pages/)** — 画面ごとの仕様・パラメータ・API
- **[api/](./api/)** — API エンドポイント単位のドキュメント

## 設計・実装ガイド

詳細な設計原則・アーキテクチャ・ルールは [`.claude/rules/`](../.claude/rules/) に整理しています。

- `architecture.md` — 設計原則・ディレクトリ構成・ルーティング設計
- `testing.md` — テスト戦略・役割分担
- `msw.md` — MSW（Mock Service Worker）
- `native-bridge.md` — NativeBridge 仕様
- `docs-generation.md` — ドキュメント自動生成

## Storybook

最新の UI コンポーネント表示は Storybook で確認してください。

- **開発環境**: `https://[dev-project].appspot.com/storybook`
- **ローカル**: `pnpm storybook` で `http://localhost:6006` にアクセス
