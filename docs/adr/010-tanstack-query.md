# ADR-010: TanStack Query をサーバー状態管理に採用する

|            |            |
| ---------- | ---------- |
| **Status** | Accepted   |
| **Date**   | 2026-04-01 |

---

## Context

旧実装では Redux + Redux Saga で API レスポンスを管理していた。
フルリプレイスにあたり、サーバーデータの取得・キャッシュ管理をどうするかを検討した。

### 旧実装の問題

Redux 18 モジュールの約 80% は「サーバーデータのキャッシュ置き場」として使われていた。

```ts
// API 1本のために Action / Saga / Reducer の3ファイルが必要
dispatch(actions.fetchWeeklyReport(date))
// → weeklyReportSaga → APIService.fetchWeeklyReport
// → put(actions.weeklyReportCompleted(data))
// → state.weeklyReport.weeklyReport.weeklyReport  ← 同名が3段ネスト
```

また全ページで `PageWrapper（HOC）→ ConfigSaga → Redux state` という経路で
共通 API を毎回叩く構造が固定されており、初期化フローが把握しにくかった。

### 選択肢の比較

|                                     | **TanStack Query**          | SWR                       | Redux + Saga         | useState + fetch |
| ----------------------------------- | --------------------------- | ------------------------- | -------------------- | ---------------- |
| キャッシュ・重複排除                | ✅                          | ✅                        | 🔴 自前              | ❌               |
| `staleTime` / `gcTime` 制御         | ✅ 細かく制御可能           | △ `dedupingInterval` のみ | 🔴 自前              | ❌               |
| プリフェッチ（ルート loader 連携）  | ✅ `ensureQueryData`        | △ 都度実装                | ❌                   | ❌               |
| `queryOptions` の定義・再利用       | ✅ ファイルをまたいで再利用 | ❌                        | ❌                   | ❌               |
| TanStack Router `loader` 連携       | ✅ ネイティブ統合           | △ 自前                    | ❌                   | △                |
| ローディング / エラー状態の一元管理 | ✅                          | ✅                        | 🔴 各 Reducer に分散 | ❌               |
| DevTools                            | ✅                          | ❌                        | ✅（Redux DevTools） | ❌               |
| ボイラープレート                    | ✅ 最小                     | ✅ 最小                   | 🔴 膨大              | ✅ 最小          |

### SWR を採用しなかった理由

SWR はシンプルで優れたライブラリだが、以下の点で TanStack Query が勝る。

**① TanStack Router の `loader` との統合**

```ts
// TanStack Router の loader で prefetch する際の API
// TanStack Query: queryClient.ensureQueryData(queryOptions) でそのまま使える
const rootRoute = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(userInfoQueryOptions),
})

// SWR: loader との公式統合がなく、自前で実装が必要
```

**② `queryOptions` による定義の再利用**

```ts
// queryKey・queryFn・staleTime をひとまとめに定義し、
// loader・useSuspenseQuery・prefetch のすべてで同じオブジェクトを参照できる
export default queryOptions({
  queryKey: ['userInfo'],
  queryFn: async () => { ... },
  staleTime: 5 * 60 * 1000,
})
```

SWR にはこの「オプションをオブジェクトとして持ち歩く」パターンがない。

---

## Decision

**TanStack Query をサーバーデータのキャッシュ・フェッチ管理に採用する。**

旧 Redux + Saga は以下のとおり置き換える：

| 旧実装                                 | 新実装                                            |
| -------------------------------------- | ------------------------------------------------- |
| Redux + Saga（API レスポンスの置き場） | TanStack Query（`useQuery` / `useSuspenseQuery`） |
| PageWrapper → ConfigSaga（共通 API）   | `rootRoute.loader` + `ensureQueryData`            |
| `mapStateToProps` でデータ取得         | `useQuery(queryOptions)` で直接取得               |

---

## Consequences

**メリット**

- API 1 本の追加が `queries/`・`types/`・`handlers/`・`mock` の 4 ファイルで完結する（Action/Saga/Reducer 3 ファイルが不要になる）
- `rootRoute.loader` で共通 API を一元管理できるため、`PageWrapper + ConfigSaga` を廃止できる
- `queryOptions` を loader・`useSuspenseQuery`・prefetch の 3 箇所で使い回せるため、queryKey の重複定義が生まれない
- `staleTime`・`gcTime` で各 API のキャッシュ戦略を細かく制御できる
- ベストプラクティスの逸脱は `@tanstack/eslint-plugin-query` で自動検知される

**デメリット・制約**

- `queryKey` の設計（キーの命名・依存関係）に一定の規律が必要になる
- `staleTime` のデフォルトが 0 のため、意図せず再フェッチが走ることがある（各クエリに明示的な設定が推奨される）
