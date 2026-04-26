# ドキュメントテンプレート：画面仕様

このテンプレートに従い、AIが画面ドキュメントを生成します。

---

```markdown
# {画面名}

> 最終更新：{日付}

## 概要

{この画面が何をする画面か・1〜2行で}

---

## URL

| 項目   | 値                                  |
| ------ | ----------------------------------- |
| パス   | `/xxx/$from/$serviceType`           |
| 起動元 | Native アプリ（WebView として起動） |

### パスパラメータ

| パラメータ    | 型            | バリデーション  | 説明               |
| ------------- | ------------- | --------------- | ------------------ |
| `from`        | `FromType`    | `z.enum([...])` | 遷移元画面の識別子 |
| `serviceType` | `ServiceType` | `z.enum([...])` | サービス種別       |

### クエリパラメータ

| パラメータ   | 型       | 必須 | 説明       |
| ------------ | -------- | ---- | ---------- |
| `store_code` | `string` | ✅   | 店舗コード |

---

## UI

- **開発環境**: https://[dev-project].appspot.com/storybook/?path=/story/{story-path}
- **ローカル**: http://localhost:6006/?path=/story/{story-path}

---

## 使用 API

- [GET /api/sample_a/type_1](../api/sample_a_type_1.md)
- [GET /api/sample_a/type_2](../api/sample_a_type_2.md)

---

## NativeBridge

この画面から呼び出す NativeBridge のメソッド一覧。

| メソッド            | 呼び出しタイミング         | パラメータ             |
| ------------------- | -------------------------- | ---------------------- |
| `onClickClose()`    | 閉じるボタンタップ時       | なし                   |
| `sendTrack(params)` | 画面表示時・ボタンタップ時 | トラッキングパラメータ |

詳細は [NativeBridge 仕様](../native-bridge.md) を参照。

---

## 振る舞い（E2E テストより）

`tests/e2e/xxx.spec.ts` で自動テスト済み。

### 正常系

- [ ] 正常なパスパラメータでアクセスするとデータが表示される
- [ ] ローディング中はローディング表示が出る

### 異常系

- [ ] 存在しない `from` でアクセスするとエラー画面が表示される
- [ ] 存在しない組み合わせ（CONTAINER_MAP にない）は「対応するコンテナが見つかりません」が表示される

---

## 関連ファイル

\`\`\`
src/routes/xxx/$from/$serviceType.tsx
src/pages/Xxx/index.tsx
src/pages/Xxx/containers/
src/queries/xxx.ts
src/mocks/handlers/xxx.ts
tests/e2e/xxx.spec.ts
\`\`\`
```
