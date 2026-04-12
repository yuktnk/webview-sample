# webview-sample

WebViewアプリのフルリプレイスPoCプロジェクトの実装サンプル。

## 技術スタック

| 役割                   | ライブラリ                                  |
| ---------------------- | ------------------------------------------- |
| ビルド                 | Vite 8.x                                    |
| UI                     | React 19.x                                  |
| 言語                   | TypeScript 6.x（strict: true）              |
| ルーティング           | TanStack Router 1.x（ファイルルーティング） |
| サーバー状態管理       | TanStack Query 5.x                          |
| バリデーション         | Zod 4.x                                     |
| スタイリング           | Tailwind CSS 4.x                            |
| コンポーネントテスト   | Storybook 10.x                              |
| ユニットテスト         | Vitest 4.x                                  |
| E2Eテスト              | Playwright 1.x                              |
| APIモック              | MSW 2.x                                     |
| パッケージマネージャー | pnpm 10.x                                   |
| Node.js                | 24.x（`.nvmrc`で固定）                      |

## セットアップ

```bash
# Node.jsバージョンを合わせる（nvmを使っている場合）
nvm use

# 依存パッケージインストール
pnpm install
```

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

## ディレクトリ構成

```
src/
├── routes/        # ルート定義（薄い定義のみ。ロジックはpages/に置く）
├── pages/         # ページ・コンテナ実装
├── components/    # 共通UIコンポーネント
├── queries/       # TanStack Query queryOptions定義
├── types/         # 型定義
├── lib/           # fetchラッパー・QueryClientインスタンス
├── bridge/        # NativeBridge（iOS/Android対応）
├── mocks/         # MSWハンドラー・モックデータ
└── utils/         # 純粋関数ユーティリティ

tests/
└── e2e/           # Playwright E2Eテスト
```

## 新しいコンテナの追加手順

1. `src/types/api/` にAPIレスポンス型を追加
2. `src/mocks/data/` にモックデータを追加
3. `src/mocks/handlers/` にMSWハンドラーを追加し `index.ts` に集約
4. `src/queries/` に `queryOptions` を追加
5. `src/pages/SampleModal/containers/` にコンテナを実装（`LoadingView`・`ErrorView` を使う）
6. `src/pages/SampleModal/containers/index.ts` の `CONTAINER_MAP` に登録
7. `index.stories.tsx` を作成（Default・Loading・Error の3点セット）

## 設計・実装の詳細

設計方針・注意事項の詳細は [CLAUDE.md](./CLAUDE.md) を参照。
