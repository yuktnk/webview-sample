# webview-sample — Claude Code 指示書

## プロジェクト概要

WebViewアプリのフルリプレイスPoCプロジェクトの実装サンプル。

---

## 技術スタック

| 役割                   | ライブラリ                                                | バージョン |
| ---------------------- | --------------------------------------------------------- | ---------- |
| ビルド                 | Vite                                                      | 8.x        |
| UI                     | React                                                     | 19.x       |
| 言語                   | TypeScript（strict: true）                                | 6.x        |
| ルーティング           | TanStack Router（ファイルルーティング）                   | 1.x        |
| サーバー状態管理       | TanStack Query                                            | 5.x        |
| バリデーション         | Zod                                                       | 4.x        |
| スタイリング           | Tailwind CSS                                              | 4.x        |
| ローカル状態           | useState / useReducer（グローバル状態管理ライブラリなし） | -          |
| APIクライアント        | fetch（built-in）+ 薄いラッパー（axiosなし）              | -          |
| コンポーネントテスト   | Storybook                                                 | 10.x       |
| ユニットテスト         | Vitest                                                    | 4.x        |
| E2Eテスト              | Playwright                                                | 1.x        |
| APIモック              | MSW（Mock Service Worker）                                | 2.x        |
| 条件クラス名           | clsx                                                      | 2.x        |
| Gitフック              | lefthook                                                  | 2.x        |
| コミット規約           | commitlint（Conventional Commits）                        | 20.x       |
| 機密情報検出           | secretlint                                                | 11.x       |
| 未使用コード検出       | knip                                                      | 6.x        |
| パッケージマネージャー | pnpm                                                      | 10.x       |
| Node.js                | 24.x（.nvmrcで固定）                                      | -          |

---

## 詳細ルール

以下のファイルを参照してください：

- **@.claude/rules/architecture.md** — 設計原則・ディレクトリ構成・コンポーネント設計
- **@.claude/rules/testing.md** — テスト戦略・Storybook・Playwright・Vitest ルール
- **@.claude/rules/msw.md** — MSW（Mock Service Worker）セットアップ・ハンドラー管理
- **@.claude/rules/native-bridge.md** — NativeBridge 使用方法・iOS / Android 差異
- **@.claude/rules/docs-generation.md** — ドキュメント自動生成・命名規則・スキル使用方法
- **@.claude/rules/known-issues.md** — 既知の不整合・要対応項目

---

## ドキュメント自動生成スキル

実装・Storybook・E2Eテストを完成させたら、以下のスキルでドキュメントを生成してください：

```bash
# ページドキュメント生成
/generate-docs-pages {ページ名}
# 例：/generate-docs-pages SampleModal

# API ドキュメント生成
/generate-docs-api {API名}
# 例：/generate-docs-api sampleA
```

詳細は `@.claude/rules/docs-generation.md` を参照。

---

## インフラ方針

App Engine のランタイムは Python を使用する。メインアプリは静的ファイルのみをデプロイ。

**環境構成：**

```
本番環境（GCP プロジェクト: production）
└── App Engine
    └── webview サービス（メインアプリのみ）

開発環境（GCP プロジェクト: development）
└── App Engine
    ├── webview サービス（メインアプリ）
    └── webview-storybook サービス（Storybook）
```

**デプロイ方法：**

```bash
# 本番環境へ（production プロジェクト）
pnpm build
gcloud app deploy app.yaml --project=production

# 開発環境へ（development プロジェクト）
pnpm build
gcloud app deploy app.yaml --project=development

# Storybook（開発環境のみ）
pnpm build:dev
gcloud app deploy app.webview-storybook.yaml --project=development
```

**なぜPythonか：**
このアプリは静的ファイル配信のみで動作する設計であり、Node.js サーバーを必要とするReact Server Components等の実装を意図的に防いでいる。別の既存SPA アプリもPythonランタイムで統一しており、EOSL対応を一元化するため。

**絶対にやってはいけないこと：**

- ランタイムを Node.js に変更すること
- サーバーコンポーネントを実装すること（Node.js ランタイムが必要になるため）
- 本番環境（webview サービス）に Storybook を含めること
- CI/CD で `app.dev.yaml` を使うこと（本番に Storybook が含まれるため）
