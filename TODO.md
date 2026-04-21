# webview-sample TODO

## 優先度：高

### CLAUDE.md更新（Claude Codeで作業）

- [ ] 品質ピラミッドのセクションを追加
  - Vitest と Storybook は同列（上下関係なし）
  - ライブラリの健全性をピラミッドの最下層として追加
- [ ] lefthookの設定を更新
  - secretlintをpre-commitに追加
  - 現在のpackage.jsonのscriptsに合わせて修正
- [ ] CI/CDセクションを追加
  - PRのたびに走るjobs（quality）
  - mainマージ後のjobs（storybook deploy）
  - PRマージ前のjobs（e2e）
- [ ] Dependabotセクションを追加
  - .github/dependabot.ymlの設定例
  - グループ化の方針（storybook・tanstack・vitest系）
  - patch: auto-merge / minor: グループPR / major: 手動レビュー必須
- [ ] ライブラリ健全性セクションを追加
- [ ] @tanstack/eslint-plugin-queryの設定を追加
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
- [ ] axe-playwrightをE2Eに組み込む（アクセシビリティ自動チェック）
- [ ] Lighthouseによるパフォーマンス計測

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

---

## CLAUDE.md追記タスク（Claude Codeで作業）

### AIコードレビューの観点を追加

#### レビューしてほしい観点

**設計・アーキテクチャ**

- routes/が薄い定義になっているか（ロジックがpages/に分離されているか）
- Containerが内部で切り替えロジックを持っていないか
- CONTAINER_MAPへの追加だけで済む設計になっているか

**パフォーマンス**

- 不要な再レンダリングが発生していないか
- useQueryのqueryKeyが適切に設定されているか
- 不要なuseEffectを使っていないか

**セキュリティ**

- APIレスポンスをZodでパースしているか
- クエリパラメータのバリデーションが抜けていないか

**テスト**

- Storyが3点セット（Default・Loading・Error）揃っているか
- E2Eテストで異常系がカバーされているか
- MSWハンドラーがhandlers/index.tsに集約されているか

**NativeBridge**

- nativeBridgeを直接呼んでいるか（Redux経由になっていないか）
- 呼び出しタイミングが仕様通りか

**TanStack Query・Router**

- TanStack QueryのqueryOptionsが queries/ に定義されているか
- TanStack Routerのloaderに共通APIが集約されているか
- Zodバリデーションが適切か

#### 指摘不要な観点（ツールで担保済み）

- フォーマット（Prettierで担保）
- importの順番（prettier-plugin-organize-importsで担保）
- anyの使用（ESLintで担保）
- console.logの残留（ESLintで担保）
- 型の整合性（TypeScript strict: trueで担保）
- 未使用変数・ファイル（knipで担保）
