---
paths: ['tsconfig*.json', 'eslint.config.ts', 'knip.config.ts']
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

### 概要

| ツール                        | 役割                        |
| ----------------------------- | --------------------------- |
| TypeScript strict mode        | 型の整合性・型安全性強化    |
| ESLint                        | コードの品質ルール          |
| eslint-plugin-jsx-a11y        | アクセシビリティ（JSX）     |
| @tanstack/eslint-plugin-query | TanStack Query のベスプラ   |
| Prettier                      | フォーマットの統一          |
| knip                          | 未使用ファイル・export 検出 |
| secretlint                    | 秘密情報の漏洩チェック      |
| commitlint                    | コミットメッセージ形式統一  |

### TypeScript 型安全性強化

5年プロダクション運用を想定し、`tsconfig.json` で以下を有効化：

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noPropertyAccessFromIndexSignature": true
  }
}
```

### ESLint 型安全性強化

`recommendedTypeChecked` を使用することで、型情報を活用した安全チェックが有効になる。

```ts
{
  '@typescript-eslint/prefer-nullish-coalescing': 'error',
  '@typescript-eslint/prefer-optional-chain': 'error',
  '@typescript-eslint/switch-exhaustiveness-check': 'error',
  '@typescript-eslint/no-unnecessary-condition': 'error',
  '@typescript-eslint/prefer-readonly': 'error',
  '@typescript-eslint/return-await': ['error', 'in-try-catch'],
}
```

### アクセシビリティ（`eslint-plugin-jsx-a11y`）

| レイヤー               | ツール                        | タイミング             | 検知できること                          |
| ---------------------- | ----------------------------- | ---------------------- | --------------------------------------- |
| **静的解析**（最速）   | `eslint-plugin-jsx-a11y`      | コード編集・コミット時 | JSX の書き方（alt 漏れ・role 誤用など） |
| **コンポーネント確認** | `@storybook/addon-a11y`       | Storybook 表示時       | 実際のコンポーネント単位の違反          |
| **E2E**（最終確認）    | `axe-playwright`（pnpm a11y） | CI・手動実行           | ページ全体の WCAG 準拠チェック          |

**原則：下層（ESLint）で防いで上層（axe）に到達させない。**

---

## AIコードレビュー

詳細は `@.claude/rules/review.md` を参照。

品質ピラミッドが整った環境での AI による検査。自動ツールでは見えない「設計・パフォーマンス・セキュリティ」を補う。
