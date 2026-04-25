---
paths: ['src/routes/**/*.tsx', 'src/types/routing.ts']
---

# ルーティング設計

## 概要

このアプリは以下の2つのルート形式をサポートしている。

- **クエリパラメータ形式**：Native からのリクエスト互換性のため
- **パスパラメータ形式**：標準的な SPA ルーティング

## パラメータ定義

### FromType

ページの種類を識別する値。

```ts
type FromType = 'sample_a' | 'sample_b'
```

| 値         | 説明           |
| ---------- | -------------- |
| `sample_a` | SampleA ページ |
| `sample_b` | SampleB ページ |

### ServiceType

ページ内のサービス・表示形式を識別する値。

```ts
type ServiceType = 'type_1' | 'type_2' | 'type_3' | 'type_4' | 'type_5'
```

| 値       | 説明       |
| -------- | ---------- |
| `type_1` | Type1 表示 |
| `type_2` | Type2 表示 |
| `type_3` | Type3 表示 |
| `type_4` | Type4 表示 |
| `type_5` | Type5 表示 |

## ルート一覧

### クエリパラメータ形式

Native からのリクエストに対応。

```
/sampleModal?from={FromType}&serviceType={ServiceType}
```

**バリデーション**：Zod の `z.enum()` で `FromType` と `ServiceType` を検証

### パスパラメータ形式

標準的な SPA ルーティング。

```
/sampleModal/{FromType}/{ServiceType}
```

**バリデーション**：Zod の `params.parse()` で `FromType` と `ServiceType` を検証

## エラーハンドリング

### バリデーションエラー

無効な `FromType` または `ServiceType` が渡された場合、`ErrorView` を表示。

```
/sampleModal?from=invalid&serviceType=type_1
→ "エラーが発生しました"
```

### コンテナが見つからない

`FromType` は有効だが、対応する `ServiceType` が定義されていない場合。

```
/sampleModal/sample_a/type_3
→ "対応するコンテナが見つかりません"
```

## 実装詳細

- `src/types/routing.ts` — `FromType` / `ServiceType` の定義
- `src/routes/sampleModal/index.tsx` — クエリパラメータ形式のルート定義
- `src/routes/sampleModal/$from/$serviceType.tsx` — パスパラメータ形式のルート定義
