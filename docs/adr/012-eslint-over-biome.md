# ADR-012: 現時点では ESLint + Prettier を維持し Biome への移行を見送る

|            |            |
| ---------- | ---------- |
| **Status** | Accepted   |
| **Date**   | 2026-04-01 |

---

## Context

JavaScript エコシステムでは Biome（旧 Rome）が ESLint + Prettier の代替として台頭している。
Biome はシングルバイナリで lint・format を処理するため、ESLint + Prettier の 2 ツール構成と比べて高速で設定がシンプルになる。

フルリプレイスにあたり、静的解析ツールを Biome に切り替えるかを検討した。

### Biome の優位点

|                        | ESLint + Prettier                       | Biome                      |
| ---------------------- | --------------------------------------- | -------------------------- |
| 実行速度               | △                                       | ✅ 10〜20倍高速（Rust 製） |
| 設定の複雑さ           | 🔴 2 ツール分                           | ✅ `biome.json` 1 ファイル |
| プラグインエコシステム | ✅ 豊富                                 | △ 成長中                   |
| React Hooks ルール     | ✅ `eslint-plugin-react-hooks` で対応   | ❌ 未対応                  |
| Storybook ルール       | ✅ `eslint-plugin-storybook` で対応     | ❌ 未対応                  |
| React Refresh ルール   | ✅ `eslint-plugin-react-refresh` で対応 | ❌ 未対応                  |

### Biome を採用しなかった理由

このプロジェクトが必要とする ESLint プラグインのうち、以下が Biome では代替できない。

**`eslint-plugin-react-hooks`（`rules-of-hooks`・`exhaustive-deps`）**
React の Hooks のルール（条件付き呼び出し禁止・依存配列の正確な記述）を強制するプラグイン。
これがないと、開発者が Hooks のルールを誤って使用しても検知できない。
このプロジェクトの品質方針（型安全・静的解析で防ぐ設計）において代替不可能なチェックである。

**`eslint-plugin-storybook`・`eslint-plugin-react-refresh`**
Storybook ファイルの構造チェックおよび React Fast Refresh との互換性チェック。

ESLint → Biome への切り替えは、コード変更を伴わない設定ファイルの置き換えのみで完了する（移行コストは低い）。
問題はコードではなく、**必要なプラグインが Biome に存在しないこと**である。

---

## Decision

**現時点では ESLint + Prettier を維持する。Biome への移行は `eslint-plugin-react-hooks` 相当の機能が Biome に実装された時点で改めて検討する。**

**移行トリガー**：Biome に `eslint-plugin-react-hooks`（`rules-of-hooks`・`exhaustive-deps`）相当のルールが追加されたタイミング。

---

## Consequences

**メリット（維持を選んだことで）**

- `rules-of-hooks`・`exhaustive-deps` など Hooks 品質チェックが維持される
- Storybook・React Refresh のルールが引き続き機能する
- 移行リスクなしに開発を継続できる

**デメリット・制約**

- ESLint + Prettier の 2 ツール構成が続くため、設定ファイルが 2 種類必要になる
- Biome の速度優位（10〜20 倍）は享受できない

**移行時の見通し**

- 移行トリガーが満たされた時点でのコスト：設定ファイルの置き換えのみ（コード変更不要・半日程度）
- Biome は後方互換の自動マイグレーションツールを提供しているため、移行リスクは低い
