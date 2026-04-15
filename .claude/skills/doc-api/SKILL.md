---
name: doc-api
description: Generate API specification documentation from implementation files
disable-model-invocation: true
argument-hint: '[endpoint-name]'
---

# スキル：API ドキュメント生成

以下のファイルを参照して、`docs/skills/api/TEMPLATE.md` のフォーマットに従い
`docs/api/{エンドポイント名}.md` を生成してください。

## 参照するファイル

- `src/queries/{クエリファイル}.ts` — API URL・リクエストパラメータ
- `src/types/api/{型定義ファイル}.ts` — リクエスト・レスポンス型
- `src/mocks/handlers/{ハンドラーファイル}.ts` — モック実装
- `src/mocks/data/{モックデータファイル}.ts` — サンプルレスポンス

存在しないファイルはスキップしてください。

## 抽出する情報

| ファイル                  | 抽出する情報                             |
| ------------------------- | ---------------------------------------- |
| `src/queries/*.ts`        | エンドポイント URL・リクエストパラメータ |
| `src/types/api/*.ts`      | リクエスト・レスポンス型定義             |
| `src/mocks/handlers/*.ts` | MSW ハンドラーの実装                     |
| `src/mocks/data/*.ts`     | モックレスポンスの実例                   |

## 出力先

```
docs/api/{エンドポイント名}.md
```

ファイル名はエンドポイント名から推測してください（例：`GET /api/sample_a/type_1` → `sample_a_type_1.md`）

## 参考資料

詳細なテンプレートは [TEMPLATE.md](TEMPLATE.md) を参照。
