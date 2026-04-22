---
name: create-api
description: Create API query, types, and MSW handler/data files
argument-hint: '[api-name in camelCase] [endpoint URL]'
---

# スキル：API・型・モック定義の生成

API 名とエンドポイント URL を引数に、API 関連ファイルを一括生成します。

## 使用方法

```bash
/create-api {apiName} {endpointUrl}
```

**例：**

```bash
/create-api userData /api/user-data
/create-api listUsers /api/users
/create-api createProduct /api/products
```

## 生成ファイル

4 つのファイルを自動生成 + 1 つのファイルに追加：

1. **API Query** — `src/queries/{camelCase}.ts`
2. **API 型定義** — `src/types/api/{camelCase}.ts`
3. **MSW ハンドラー** — `src/mocks/handlers/{camelCase}.ts`
4. **モックデータ** — `src/mocks/data/{camelCase}.ts`
5. **エンドポイント追加** — `src/constants/apiEndpoints.ts` に URL を追加（入力値をそのまま使用）

## ルール

### API 名の形式

- **入力形式**: キャメルケース（例: `userData`, `productList`, `orderDetail`）
- **ファイル名**: キャメルケース（入力そのまま）
  - 入力: `userData` → ファイル: `userData.ts`
  - 入力: `productList` → ファイル: `productList.ts`

### エンドポイント URL の形式

スキル実行時に指定するエンドポイント URL の例：

```
/api/userData          # apiNameと同じパス
/api/user-data         # スネークケース
/api/v1/users          # バージョン付き
/users                 # ルートパス
```

**重要：** `/api` で始まる必要はありません。バックエンド仕様に合わせて自由に指定できます。

### HTTPメソッド

すべての API はデフォルトで **GET** で生成されます。POST・PUT・DELETE が必要な場合は、生成後に `src/mocks/handlers/{apiName}.ts` を手動で修正してください。

```ts
// デフォルト（GET）
http.get(API_ENDPOINTS.USER_DATA, () => ...)

// POST に変更する場合
http.post(API_ENDPOINTS.USER_DATA, () => ...)
```

### 生成ファイルの要件

#### 1. API Query（`src/queries/{apiName}.ts`）

```ts
// ✅ 要件
- TanStack Query queryOptions で定義
- queryKey は配列形式
- queryFn は apiFetch で API 呼び出し
```

#### 2. API 型定義（`src/types/api/{apiName}.ts`）

```ts
// ✅ 要件
- APIレスポンス型を定義
- TypeScript strict 対応
- 複数レスポンス型がある場合は複数定義可
```

#### 3. MSW ハンドラー（`src/mocks/handlers/{apiName}.ts`）

```ts
// ✅ 要件
- http.get / http.post etc で handler 定義
- /api/{apiName} パターンに対応
- handlers/index.ts に集約
```

#### 4. モックデータ（`src/mocks/data/{apiName}.ts`）

```ts
// ✅ 要件
;-型と合致するモックデータ - 複数パターンある場合は複数定義可
```

## 参考資料

詳細なテンプレートは [TEMPLATE.md](TEMPLATE.md) を参照。

## 実装後

生成後、以下は必要に応じて **手動で追加**：

- `src/mocks/handlers/index.ts` に handler を import・export
- `src/pages/{pageName}/index.tsx` で queryOptions を import して使用

**重要：** API URL は `API_ENDPOINTS` から参照する（自動追加）

詳細は [.claude/rules/api-design.md](./../rules/api-design.md) を参照。
