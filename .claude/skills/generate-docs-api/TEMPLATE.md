# API 仕様書テンプレート

このテンプレートに従い、API ドキュメントを記述します。

---

````markdown
# GET /api/sample_a/type_1

## 説明

{このAPIの簡単な説明・1〜2行で}

## リクエスト

| パラメータ   | 型       | 必須 | 説明                   |
| ------------ | -------- | ---- | ---------------------- |
| `store_code` | `string` | ✅   | 店舗コード             |
| `date`       | `string` | ✅   | 対象日付（YYYY-MM-DD） |

## レスポンス

```ts
type SampleAType1Response = {
  id: string
  title: string
  value: number
  date: string
}
```
````

## モック

`src/mocks/handlers/sampleA.ts`

```

```
