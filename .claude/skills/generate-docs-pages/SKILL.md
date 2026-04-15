---
name: generate-docs-pages
description: Generate screen specification documentation from implementation files
disable-model-invocation: true
argument-hint: '[page-name]'
---

# スキル：画面ドキュメント生成

以下のファイルを参照して、`TEMPLATE.md` のフォーマットに従い
`docs/pages/{画面名}.md` を生成してください。

## 参照するファイル

- `src/routes/{ルートパス}.tsx` — URL・パスパラメータ・バリデーション
- `src/pages/{ページ名}/containers/{Container名}/index.tsx` — APIコール・ロジック
- `src/pages/{ページ名}/containers/{Container名}/index.stories.tsx` — UIの状態一覧
- `tests/e2e/{specファイル}.spec.ts` — 画面の振る舞い・正常系・異常系
- `src/bridge/index.ts` — NativeBridge仕様

存在しないファイルはスキップしてください。

## 抽出する情報

| ファイル                         | 抽出する情報                                             |
| -------------------------------- | -------------------------------------------------------- |
| `src/routes/*.tsx`               | URL・パスパラメータ・クエリパラメータ・Zodバリデーション |
| `containers/*/index.tsx`         | 使用API・queryOptions・ローディング/エラー状態           |
| `containers/*/index.stories.tsx` | UIの状態一覧（Default・Loading・Error）                  |
| `tests/e2e/*.spec.ts`            | 正常系・異常系・NativeBridge呼び出し                     |
| `src/bridge/index.ts`            | NativeBridgeのメソッド定義                               |

## 出力先

```
docs/pages/{画面名}.md
```

## 参考資料

詳細なテンプレートは [TEMPLATE.md](TEMPLATE.md) を参照。
