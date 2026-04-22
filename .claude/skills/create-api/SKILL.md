---
name: create-api
description: Create API query, types, and MSW handler/data files
argument-hint: '[api-name in camelCase]'
---

# スキル：API・型・モック定義の生成

API 名を引数に、API 関連ファイルを一括生成します。

## 生成ファイル

4 つのファイルを自動生成します：

1. **API Query** — `src/queries/{camelCase}.ts`
2. **API 型定義** — `src/types/api/{camelCase}.ts`
3. **MSW ハンドラー** — `src/mocks/handlers/{camelCase}.ts`
4. **モックデータ** — `src/mocks/data/{camelCase}.ts`

## ルール

### API 名の形式

- **入力形式**: キャメルケース（例: `userData`, `productList`, `orderDetail`）
- **ファイル名**: キャメルケース（入力そのまま）
  - 入力: `userData` → ファイル: `userData.ts`
  - 入力: `productList` → ファイル: `productList.ts`

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

- `src/queries/{apiName}.ts` 内の queryFn を実装
- `src/mocks/handlers/index.ts` に handler を import・export
- `src/pages/{pageName}/index.tsx` で queryOptions を import して使用
