---
paths:
  ['src/**/*', 'tests/**/*', '.github/**/*', 'lefthook.yml', 'package.json']
---

# 品質保証の方針

品質を段階的に担保する。下層が崩れると上層が機能しないため、最下層のライブラリ健全性を最優先に整備する。

---

## 品質ピラミッド

```
    AI（Claude・Copilot）
    すべてのレイヤーをサポート
    ────────────────────────────
            Playwright
    ────────────────────────────
 Vitest        ｜      Storybook
（ロジック）    ｜    （UI・状態）
    ────────────────────────────
           静的解析
  型・lint・format・knip・secretlint
    ────────────────────────────
         ライブラリの健全性
   Dependabot・pnpm audit・EOL管理
```

**原則：下が崩れると上が機能しない。AI は土台が整った環境で、全レイヤーをサポートする生産性向上ツール。**

---

## ライブラリの健全性

現在の方針：**pnpm audit のみ**（Dependabot は将来検討）

| ツール     | 役割                    | タイミング    |
| ---------- | ----------------------- | ------------- |
| pnpm audit | 脆弱性検出 → Issue 作成 | main マージ時 |

### pnpm audit の方針

- **実行時期** — Drone で main へのマージ時に実行（リリース前検知）
- **結果** — 脆弱性が検出された場合のみ GitHub Issue を自動作成
- **ノイズ防止** — 脆弱性 0 件のときは Issue を立てない
- **対応** — Issue を見て開発者が手動でバージョンアップ PR を作成

### Dependabot は将来検討

ライブラリが 20+ に増えたタイミングで Dependabot 導入を検討する理由：

- 現在は管理するライブラリが少ない（手動管理で十分）
- PR が多くなると（グループ化しても）ノイズになる
- セキュリティ重視なら pnpm audit だけで OK
- feature・内部更新は意図的に進める

---

## 静的解析

| ツール                        | 役割                        |
| ----------------------------- | --------------------------- |
| TypeScript strict: true       | 型の整合性                  |
| ESLint                        | コードの品質ルール          |
| @tanstack/eslint-plugin-query | TanStack Query のベスプラ   |
| Prettier                      | フォーマットの統一          |
| knip                          | 未使用ファイル・export 検出 |
| secretlint                    | 秘密情報の漏洩チェック      |
| commitlint                    | コミットメッセージ形式統一  |

---

## Vitest / Storybook（同列）

### Vitest（ロジック層）

テスト対象：

- 純粋関数
- カスタムフック

**スコープ：**

- コンポーネントのレンダリングテストは書かない（Storybook で担保）
- 複雑なロジックが出てきたら書く、くらいの温度感でOK

### Storybook（UI 層）

**ルール：**

- Story は必ず **Default・Loading・Error** の3点セットで作る
- コンポーネントと同じディレクトリに `index.stories.tsx` として置く
- 開発環境の App Engine にデプロイして常時確認できる状態にする

**テスト対象：**

- UI の状態（Default・Loading・Error）
- 見た目・バリエーション（色・サイズ等）

---

## Playwright（E2E）

ルーティング → API → レンダリングの一気通貫フローを検証。

**対象：**

- 正常系：データが表示される
- 異常系：エラーハンドリング・バリデーション

**実装方針：**

- NativeBridge のモックは `addInitScript` + Proxy で実装
- MSW で API モックを統一（Storybook・Vitest・Playwright で同じハンドラーを使い回す）
- ファイルは画面単位で分割（`tests/e2e/{画面名}.spec.ts`）

---

## AIコードレビュー

詳細は `@.claude/rules/review.md` を参照。

品質ピラミッドが整った環境での人間による検査。自動ツールでは見えない「設計・パフォーマンス・セキュリティ」を補う。

---

## ローカル開発（lefthook）

**役割：ローカルで素早く気づく（開発者体験向上）**

`--no-verify` でスキップ可能なため、CI/CD が本番の砦。

### pre-commit（差分ファイルのみ・数秒）

- `lint` — ESLint
- `format-check` — Prettier
- `secretlint` — 秘密情報漏洩チェック

### pre-push（少し重くてもOK）

- `typecheck` — `tsc --noEmit --incremental`
- `test` — Vitest

### commit-msg

- `commitlint` — Conventional Commits 形式チェック

---

## CI/CD（Drone）

**役割：絶対に通過させる関門（品質保証）**

### PR のたびに走る（quality）

```
typecheck → lint → format:check → knip → secretlint → test → build
```

### main マージ時に走る

```
pnpm audit --audit-level=high
  → 脆弱性が検出された場合のみ Issue を自動作成
  → 脆弱性 0 件のときは Issue を立てない（ノイズ防止）
```

### main マージ後に走る

```
Storybook ビルド → 開発環境 App Engine にデプロイ
```

---

## 品質 CI（Drone・定期実行）

**役割：定点観測・劣化の早期検知**

### セキュリティ監査（master マージのタイミング）

```
pnpm audit --audit-level=high
  → 脆弱性が検出された場合のみ GitHub API で Issue を自動作成
  → 脆弱性 0 件のときは Issue を立てない（ノイズ防止）
```

### 定点観測（月イチ・毎月 1 日）

```
Lighthouse（パフォーマンス）
axe-playwright（アクセシビリティ）
bundle size（バンドルサイズ）
  ↓
品質ダッシュボード Issue にコメントとして記録
  ↓
時系列の品質ログになる
```

---

## ブランチ保護ルール（GitHub）

main ブランチへのマージを保護する設定。

### 必須条件

- **CI チェック必須** — quality・e2e が通らないとマージ不可
- **コードレビュー必須** — 最低 1 人以上の approval
- **最新ブランチ必須** — main の最新変更を反映してからマージ
- **会話解決必須** — コメント内容がすべて解決してからマージ

### 設定時期

- CI/CD（Drone）が動作してから設定（現在は未構築）
