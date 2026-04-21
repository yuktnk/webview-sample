# webview-sample TODO

## 優先度：高

### CLAUDE.md更新（Claude Codeで作業）

- [ ] CI/CDセクションを追加
  - PRのたびに走るjobs（quality）
  - mainマージ後のjobs（storybook deploy）
  - PRマージ前のjobs（e2e）
- [ ] copilot-instructions.mdをCLAUDE.mdと同内容で作成

---

## 優先度：中

### 実装

- [ ] SampleA/Type2 のAPIコール実装（Type1を参考に）
- [ ] SampleB/Type1 のAPIコール実装
- [ ] LoadingView・ErrorViewを`src/components/ui/`に共通コンポーネントとして切り出す
- [ ] リダイレクトアダプター実装（`src/routes/sampleModal/index.tsx`）
  - 旧URL（`?from=xxx&service_type=yyy`）→ 新URL（`/sampleModal/$from/$serviceType`）にリダイレクト

### Storybook

- [ ] 各ContainerのStory作成（Default・Loading・Error の3点セット）
  - SampleA/Type2
  - SampleB/Type1
- [ ] Storybookを開発環境のApp Engineにデプロイ

### Playwright E2E

- [ ] `tests/e2e/fixtures/auth.ts` — 認証fixture実装
- [ ] `tests/e2e/fixtures/nativeBridge.ts` — NativeBridgeモック（addInitScript + Proxy）
- [ ] `tests/e2e/sampleModal.spec.ts` — シナリオ実装
  - 正常系：データが表示される
  - 異常系：存在しないfromでエラー画面
  - 異常系：対応しない組み合わせで「対応するコンテナが見つかりません」
- [ ] PlaywrightをCIに組み込む

### ドキュメント

- [ ] `docs/skills/SCREEN_DOC_TEMPLATE.md` を作成（テンプレートを分離）
- [ ] `docs/screens/.gitkeep` を作成
- [ ] `docs/native-bridge.md` を作成
- [ ] `docs/api/endpoints.md` を作成
- [ ] SampleA/Type1のドキュメントを生成（スキルを使って）
  - Storybook・E2Eテストが揃ったタイミングで実施

---

## 優先度：低

### 品質

- [ ] カバレッジ閾値の設定（vitest.config.tsに追加）

### CI/CD（通常）

- [ ] GitHub Actionsのworkflowファイル作成
  - `.github/workflows/ci.yml`（quality・e2e）
  - `.github/workflows/deploy-storybook.yml`（開発環境へのデプロイ）

### 品質CI（Drone）

- [ ] 品質ダッシュボード用のissueを1本立てる（番号をDroneのyamlに記載）
- [ ] GitHubのPersonal Access Tokenを発行（repo権限）
- [ ] DroneのSecretsに`GITHUB_TOKEN`を登録
- [ ] `.drone.yml` に品質CIのpipelineを追加

#### セキュリティ監査（masterマージのタイミングで実行）

- [ ] `pnpm audit --audit-level=high` を実行
- [ ] 脆弱性が検出された場合のみGitHub APIでissueを自動作成
  - issueタイトル：`⚠️ [Security] 脆弱性が検出されました`
  - 脆弱性0件のときはissueを立てない（ノイズ防止）

#### 定点観測（月イチ・Droneのcron）

- [ ] Droneのcronを設定 → `0 9 1 * *`（毎月1日9時）
- [ ] 以下を実行して品質ダッシュボードissueにコメントとして記録
  - Lighthouse（パフォーマンス）
  - axe-playwright（アクセシビリティ）
  - bundle size
  - 日付・各スコアを表形式で出力 → 時系列の品質ログになる

---

## 現時点のスコア：74 / 100点

| レイヤー           | スコア | 主な課題                                        |
| ------------------ | ------ | ----------------------------------------------- |
| ライブラリの健全性 | 15/20  | pnpm audit未設定・EOL方針未明文化               |
| 静的解析           | 18/20  | @tanstack/eslint-plugin-query未設定             |
| Vitest / Storybook | 12/20  | テスト未記述・Storybookデプロイ未実施           |
| Playwright         | 8/20   | テスト未記述・CI未組み込み                      |
| AI活用             | 11/20  | Storybookデプロイ未実施・画面ドキュメント未整備 |
