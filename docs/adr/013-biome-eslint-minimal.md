# ADR-013: Biome をメインツールとし ESLint を最小構成で併用する

|            |            |
| ---------- | ---------- |
| **Status** | Accepted   |
| **Date**   | 2026-04-26 |

---

## Context

ADR-012 では「`eslint-plugin-react-hooks` 相当の機能が Biome に実装されるまで ESLint + Prettier を維持する」と決定した。

しかし改めて検討した結果、Biome + ESLint 最小構成（ハイブリッド構成）という第 3 の選択肢が有効であることがわかった。

### ハイブリッド構成の考え方

- **Biome**：Formatter（Prettier の代替）+ 汎用 Linter（ESLint の共通ルール）
- **ESLint**：Biome が代替できないプラグイン専用

Biome が対応できないプラグインは限られており、ESLint を「全部」ではなく「最小限」で維持すれば、Biome の速度優位と ESLint のエコシステムを両立できる。

### Prettier を廃止できる理由

Biome のフォーマット設定（`biome.json`）は Prettier と完全に互換する設定値（`quoteStyle`・`trailingCommas`・`semicolons`・`lineWidth` 等）を持っており、出力結果も実質的に同等。
`biome migrate prettier` コマンドで既存の Prettier 設定を `biome.json` に変換できる。

### ESLint で維持すべきプラグイン

| プラグイン                       | 役割                                         | Biome で代替できるか |
| -------------------------------- | -------------------------------------------- | -------------------- |
| `eslint-plugin-react-hooks`      | `rules-of-hooks`・`exhaustive-deps`          | ❌ 未対応            |
| `eslint-plugin-react-refresh`    | React Fast Refresh との互換性チェック        | ❌ 未対応            |
| `@tanstack/eslint-plugin-query`  | TanStack Query のベストプラクティス強制      | ❌ 未対応            |
| `eslint-plugin-jsx-a11y`         | アクセシビリティ（JSX）                      | ❌ 未対応            |
| `eslint-plugin-storybook`        | Storybook ファイルの構造チェック             | ❌ 未対応            |
| `eslint-plugin-unicorn`          | `filename-case`（ファイル名命名規則）        | ❌ 未対応            |
| `eslint-plugin-import`           | `import/order`（グループ順序）・`no-cycle`   | △ 部分対応           |
| `typescript-eslint`              | 型情報を使った安全チェック（`recommendedTypeChecked`） | ❌ 未対応  |

`import/order` については Biome の `organizeImports`（アシスト機能）が import の整列を行うが、グループ分け（builtin / external / internal）の定義や `no-cycle` の検知は ESLint のみ。

### ESLint から除去できるルール

Biome が同等のルールを持つため ESLint からは削除した。

| 削除した ESLint ルール                           | 対応する Biome ルール                          |
| ------------------------------------------------ | ---------------------------------------------- |
| `no-console`                                     | `suspicious/noConsole`                         |
| `@typescript-eslint/no-explicit-any`             | `suspicious/noExplicitAny`                     |
| `react/no-array-index-key`                       | `suspicious/noArrayIndexKey`                   |
| `@typescript-eslint/no-non-null-assertion`       | `style/noNonNullAssertion`                     |
| `no-nested-ternary`                              | `style/noNestedTernary`                        |
| `@typescript-eslint/array-type`                  | `style/useConsistentArrayType`                 |
| `prefer-template`                                | `style/useTemplate`                            |
| `react/self-closing-comp`                        | `style/useSelfClosingElements`                 |
| `@typescript-eslint/consistent-type-definitions` | `style/useConsistentTypeDefinitions`           |
| `@typescript-eslint/consistent-type-imports`     | `style/useImportType`                          |
| `react/jsx-curly-brace-presence`                 | `style/useConsistentCurlyBraces`               |
| `react/jsx-no-useless-fragment`                  | `complexity/noUselessFragments`                |
| `eqeqeq`                                         | `suspicious/noDoubleEquals`（recommended）     |
| `eslint-config-prettier`                         | Biome がフォーマッターを担当                   |
| `@eslint/js` （`js.configs.recommended`）        | Biome の `recommended` ルールが代替            |

---

## Decision

**Biome をメインツール（Formatter + 汎用 Linter）として採用し、ESLint はプラグイン専用の最小構成で併用する。Prettier は廃止する。**

### ツール構成

| ツール      | 役割                                                            |
| ----------- | --------------------------------------------------------------- |
| **Biome**   | Formatter（旧 Prettier）+ 汎用 Lint（旧 ESLint 共通ルール）     |
| **ESLint**  | Biome が代替できないプラグイン専用（Hooks・Query・a11y 等）     |
| ~~Prettier~~ | ~~廃止~~（Biome に統合）                                       |

### CI/CD の変更

| フェーズ      | 変更前                             | 変更後                             |
| ------------- | ---------------------------------- | ---------------------------------- |
| pre-commit    | `eslint` + `prettier --check`      | `eslint` + `biome check`           |
| CI quality    | `lint` + `format:check`            | `lint` + `biome`                   |

---

## Consequences

**メリット**

- Prettier が不要になり、依存パッケージが削減される（`prettier`・`prettier-plugin-organize-imports`・`eslint-config-prettier` を削除）
- Biome による lint + format が 10〜20 倍高速（Rust 製）→ CI 時間短縮
- `biome.json` 1 ファイルで formatter + 汎用 lint を管理（設定の簡略化）
- ESLint と Biome が重複するルールを持たなくなり、設定の意図が明確になる
- 将来 Biome に `rules-of-hooks` 相当が追加されれば ESLint を完全に除去できる

**デメリット・制約**

- ESLint + Biome の 2 ツール構成が残る（ADR-012 と同じデメリット）
- Biome の `organizeImports` と ESLint の `import/order` が干渉しないよう注意が必要
- `.d.ts` ファイル（宣言マージに `interface` が必要）は `useConsistentTypeDefinitions` を `off` にするオーバーライドが必要

**将来の移行見通し**

- Biome に `rules-of-hooks` 相当が実装されれば、ESLint を完全除去できる（設定ファイルの削除のみ・コード変更不要）
- React Compiler が普及すれば `rules-of-hooks` の意義が薄れ、ESLint 不要の純 Biome 構成になる可能性が高い
