---
paths: ['lefthook.yml', '.github/**/*', 'package.json']
---

# CI/CD・開発フロー

## ローカル開発（lefthook）

**役割：ローカルで素早く気づく（開発者体験向上）**

`--no-verify` でスキップ可能なため、CI/CD が本番の砦。

### pre-commit（差分ファイルのみ・数秒）

- `lint` — ESLint
- `biome-check` — Biome（lint + format）
- `secretlint` — 秘密情報漏洩チェック

### pre-push（少し重くてもOK）

- `typecheck` — `tsc --noEmit --incremental`（ローカルキャッシュ活用）
- `test` — Vitest

### commit-msg

- `commitlint` — Conventional Commits 形式チェック

---

## CI/CD（Drone）

**役割：絶対に通過させる関門（品質保証）**

### PR のたびに走る（quality）

```
typecheck → lint → biome → knip → secretlint → test → build
```

### main マージ時に走る

#### セキュリティ監査

```
pnpm audit --audit-level=high
  → 脆弱性が検出された場合のみ Issue を自動作成
  → 脆弱性 0 件のときは Issue を立てない（ノイズ防止）
```

#### 品質監査（パフォーマンス・アクセシビリティ・バンドルサイズ）

```
pnpm a11y                       # axe-playwright で WCAG 準拠性チェック
pnpm build:prd && pnpm bundle   # bundle size 分析（dist/bundle-analysis.html）
pnpm perf                       # Lighthouse パフォーマンス監査
```

**ポリシー：**

- **ブロッキング** — a11y・bundle size・Lighthouse のいずれかが重大な問題を検出した場合、マージをブロック
- **レポート化** — 各レポートは PR / Issue に自動コメント（時系列の品質ログ）
- **ノイズ防止** — 0 件 issue や改善した場合は簡潔に（冗長なコメントを避ける）

### main マージ後に走る

```
Storybook ビルド → 開発環境 App Engine にデプロイ
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
