# ADR-008: TypeScript strict モードを妥協しない

|            |            |
| ---------- | ---------- |
| **Status** | Accepted   |
| **Date**   | 2026-04-01 |

---

## Context

旧実装では TypeScript を導入しているにもかかわらず、型チェックの恩恵をほぼ受けられていなかった。

```json
// 旧実装の tsconfig.json
{ "compilerOptions": { "strict": false } }
```

```js
// 旧実装の next.config.js
typescript: {
  ignoreBuildErrors: true
} // 型エラーを無視してビルドが通る
```

この状態では以下が無効化されていた。

| 無効化されていた設定  | 影響                            |
| --------------------- | ------------------------------- |
| `strictNullChecks`    | `null` / `undefined` の見落とし |
| `noImplicitAny`       | 暗黙の `any` が通過する         |
| `strictFunctionTypes` | 関数型の不整合を見逃す          |

### 具体的な被害

- `: any` を使用しているファイル：83 ファイル・146 箇所
- `@ts-ignore` / `@ts-nocheck`：5 箇所（エラーを隠蔽）
- `tsc --strict` を実行した場合：**841 エラー**が噴出（`strict: false` で隠蔽中）

型が緩いコードは、ライブラリ更新時に「何が壊れるか」の予測が立てにくい。
コンパイラを通過してもランタイムで初めてクラッシュする箇所が多数生じる。
これがフルリプレイスを選んだ理由の一つでもある（ADR-001 参照）。

### フルリプレイスでの方針

TypeScript を使うなら、型チェックを全力で使う。
`strict: true` は「厳しい設定」ではなく「TypeScript 本来の使い方」である。

---

## Decision

**TypeScript の `strict: true` を有効にし、`ignoreBuildErrors` は使わない。`any` は原則禁止とし、`unknown` + 型ガードで代替する。**

```json
// tsconfig.json
{ "compilerOptions": { "strict": true } }
```

---

## Consequences

**メリット**

- `null` / `undefined` の見落とし・暗黙の `any`・関数型の不整合をコンパイル時に検出できる
- TanStack Router の `validateSearch`・Zod スキーマの型推論は `strict: true` 前提で設計されており、他の技術選定の恩恵が最大化される
- ライブラリ更新時に影響箇所をコンパイラが一覧してくれる

**デメリット・制約**

- 既存コードへ strict を後から有効化すると大量の型エラーが噴出する（フルリプレイスで最初から有効化することで回避）
- `any` で逃げる誘惑を抑える規律が継続的に必要になる
