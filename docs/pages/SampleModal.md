# SampleModal 画面仕様

## 概要

SampleModal はコンテナベースのモーダル画面。

`from` と `serviceType` パラメータによって表示するコンテナを動的に切り替えます。

## パラメータ

詳細は [routing.md](../routing.md) を参照。

| パラメータ    | 型          | 例                     | 説明               |
| ------------- | ----------- | ---------------------- | ------------------ |
| `from`        | FromType    | `sample_a`, `sample_b` | ページ種別         |
| `serviceType` | ServiceType | `type_1`, `type_2`     | サービス・表示形式 |

## コンテナ一覧

### SampleA Type1

パス: `/sampleModal/sample_a/type_1`

**表示内容**:

- タイトル
- 数値型データ
- 日付データ

**API**: [GET /api/sample_a/type_1](../api/endpoints.md#get-appsample_atype_1)

**UI**: [Storybook](https://[dev-project].appspot.com/storybook/?path=/story/samplea-type1-container)

---

### SampleA Type2

パス: `/sampleModal/sample_a/type_2`

**表示内容**:

- タイトル
- リスト形式のデータ（ラベル・カウント）

**API**: [GET /api/sample_a/type_2](../api/endpoints.md#get-appsample_atype_2)

**UI**: [Storybook](https://[dev-project].appspot.com/storybook/?path=/story/samplea-type2-container)

---

### SampleB Type1

パス: `/sampleModal/sample_b/type_1`

**表示内容**:

- タイトル
- ステータス
- スコア

**API**: [GET /api/sample_b/type_1](../api/endpoints.md#get-apisample_btype_1)

**UI**: [Storybook](https://[dev-project].appspot.com/storybook/?path=/story/sampleb-type1-container)

---

## 実装

- ページコンポーネント: `src/pages/SampleModal/index.tsx`
- コンテナ: `src/pages/SampleModal/containers/`
  - `SampleA/Type1/index.tsx`
  - `SampleA/Type2/index.tsx`
  - `SampleB/Type1/index.tsx`
