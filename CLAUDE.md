# webview-sample — Claude Code 指示書

## プロジェクト概要

WebViewアプリのフルリプレイスPoCプロジェクトの実装サンプル。

---

## 技術スタック

| 役割                   | ライブラリ                                                | バージョン |
| ---------------------- | --------------------------------------------------------- | ---------- |
| ビルド                 | Vite                                                      | 8.x        |
| UI                     | React                                                     | 19.x       |
| 言語                   | TypeScript（strict mode + 型安全性強化）                  | 6.x        |
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

## ドキュメント体系

プロジェクトのドキュメントは以下の役割で分けられています。

| ファイル/ディレクトリ                  | 役割                                                     | 対象        |
| -------------------------------------- | -------------------------------------------------------- | ----------- |
| **README.md**                          | プロジェクト概要・クイックスタート・ナビゲーション       | すべての人  |
| **CLAUDE.md**（このファイル）          | Claude Code 指示書・技術スタック・全体方針・インフラ構成 | Claude Code |
| **[.claude/rules/](./.claude/rules/)** | 実装ルール・ガイドライン・ポリシー（詳細）               | 開発者・AI  |
| **[docs/](./docs/)**                   | 生成ドキュメント（画面仕様・API仕様・Storybook リンク）  | すべての人  |

---

## 詳細ルール

以下のファイルを参照してください：

- **@.claude/rules/architecture.md** — 設計原則・ディレクトリ構成
- **@.claude/rules/file-placement.md** — コンポーネント・フック・アセットの配置ルール
- **@.claude/rules/routing.md** — ルーティング設計・パラメータ定義・エラーハンドリング
- **@.claude/rules/naming.md** — 命名規則（ESLint 自動チェック範囲・手動で守る規則）
- **@.claude/rules/api-design.md** — API 設計ポリシー・1-1-1-1 ルール・エンドポイント一元管理
- **@.claude/rules/testing.md** — テスト戦略・Storybook・Playwright・Vitest・MSW ルール
- **@.claude/rules/quality.md** — 品質ピラミッド・静的解析・ライブラリ健全性
- **@.claude/rules/ci.md** — lefthook・CI/CD（Drone）・ブランチ保護
- **@.claude/rules/review.md** — AI コードレビュー観点
- **@.claude/rules/native-bridge.md** — NativeBridge 使用方法・iOS / Android 差異
- **@.claude/rules/design-system.md** — デザインシステム・トークン管理・単位統一・arbitrary value 禁止
- **@.claude/rules/docs-generation.md** — ドキュメント自動生成スキルの使い方

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
本番環境（GCP プロジェクト: prd）
└── App Engine
    └── webview サービス（メインアプリのみ）

ステージング環境（GCP プロジェクト: stg）
└── App Engine
    └── webview サービス（メインアプリのみ）

開発環境（GCP プロジェクト: dev）
└── App Engine
    ├── webview サービス（メインアプリ）
    └── webview-storybook サービス（Storybook）

ローカル開発
└── vite --mode local（MSW でモック）
```

**ビルドモード一覧：**

| モード | 用途                 | コマンド                          |
| ------ | -------------------- | --------------------------------- |
| local  | ローカル開発         | `pnpm local` / `pnpm build:local` |
| dev    | GCP dev プロジェクト | `pnpm build:dev`                  |
| stg    | GCP stg プロジェクト | `pnpm build:stg`                  |
| prd    | GCP prd プロジェクト | `pnpm build:prd`                  |

**デプロイ方法：**

```bash
# ローカル開発
pnpm local                 # vite で --mode local をロード
pnpm build:local           # ビルド

# GCP prd（本番）へデプロイ
pnpm build:prd
gcloud app deploy app.yaml --project=prd

# GCP stg（ステージング）へデプロイ
pnpm build:stg
gcloud app deploy app.yaml --project=stg

# GCP dev（開発）へデプロイ
pnpm build:dev
gcloud app deploy app.yaml --project=dev

# Storybook（GCP dev 環境のみ）
pnpm build:dev
pnpm storybook:build
gcloud app deploy app.webview-storybook.yaml --project=dev
```

**なぜPythonか：**
このアプリは静的ファイル配信のみで動作する設計であり、Node.js サーバーを必要とするReact Server Components等の実装を意図的に防いでいる。別の既存SPA アプリもPythonランタイムで統一しており、EOSL対応を一元化するため。

**絶対にやってはいけないこと：**

- ランタイムを Node.js に変更すること
- サーバーコンポーネントを実装すること（Node.js ランタイムが必要になるため）
- 本番環境（webview サービス）に Storybook を含めること
- CI/CD で `app.dev.yaml` を使うこと（本番に Storybook が含まれるため）
