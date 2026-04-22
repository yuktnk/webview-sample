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

- ページコンポーネント: `src/pages/sampleModal/index.tsx`
- コンテナ: `src/pages/sampleModal/containers/`
  - `sampleA/type1/index.tsx`
  - `sampleA/type2/index.tsx`
  - `sampleB/type1/index.tsx`
- ルーティング: `src/routes/sampleModal/` (クエリパラメータ形式) / `$from/$serviceType.tsx` (パスパラメータ形式)

## URL形式

### パスパラメータ形式（推奨）

```
/sampleModal/$from/$serviceType
```

例：

- `/sampleModal/sample_a/type_1`
- `/sampleModal/sample_a/type_2`
- `/sampleModal/sample_b/type_1`

### クエリパラメータ形式（Native 互換性）

```
/sampleModal?from={from}&serviceType={serviceType}
```

例：

- `/sampleModal?from=sample_a&serviceType=type_1`

## バリデーション

両URL形式とも Zod で以下をバリデーション：

- `from` — `z.enum(['sample_a', 'sample_b'])`
- `serviceType` — `z.enum(['type_1', 'type_2', ...])`

無効な値の場合は `ErrorView` を表示。

対応していないコンテナの場合は「対応するコンテナが見つかりません」を表示。

## NativeBridge

- `onClickClose()` — 閉じるボタンタップ時
- `sendTrack(params)` — 画面表示時・ボタンタップ時

詳細は `.claude/rules/native-bridge.md` を参照。

## E2E テスト

`tests/e2e/sampleModal.spec.ts` で以下をテスト：

- パスパラメータ形式の正常系・バリデーション
- クエリパラメータ形式の正常系
- 未対応のコンテナ組み合わせ時のエラー表示
