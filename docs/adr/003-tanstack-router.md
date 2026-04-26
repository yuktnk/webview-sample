# ADR-003: TanStack Router を採用する

|            |            |
| ---------- | ---------- |
| **Status** | Accepted   |
| **Date**   | 2026-04-01 |

---

## Context

このアプリは iOS/Android ネイティブアプリ内に埋め込まれた WebView であり、
各 WebView は Native によって個別に起動され、閉じると JS コンテキストごとリセットされる。

```
Native App
├── WebView（単発・使い捨て）: 画面A
│       ↓ nativeBridge.onClickOpenModalB()
├── WebView（単発・使い捨て）: モーダル画面B
│       ↓ nativeBridge.onClickClose()
└── Native 画面に戻る
```

この構造から、Router に求められる要件は一般的な SPA と異なる。

| 項目                                       | 実態                                         |
| ------------------------------------------ | -------------------------------------------- |
| ページ間のクライアントサイドナビゲーション | **発生しない**                               |
| SPA キャッシュ・遷移速度の恩恵             | **得られない**                               |
| Router に求められるもの                    | **クエリパラメータ管理・バリデーションのみ** |

### 旧実装の問題

旧WebViewアプリの特定画面は `from` パラメータで 13 種類の画面を出し分ける `switch` 文を持ち、
クエリパラメータの型が `string | string[] | undefined` のまま。型安全がゼロでテストも困難な状態だった。

また全ページで `PageWrapper（HOC）→ dispatch → ConfigSaga → Redux state` という経路で
共通 API（userInfo・batchDate・basicSetting）を毎回叩いており、構造が複雑だった。

### 選択肢の比較

|                            | Router なし         | React Router                  | **TanStack Router**                  |
| -------------------------- | ------------------- | ----------------------------- | ------------------------------------ |
| クエリパラメータの型安全   | △ 自前 Zod          | △ 自前 Zod                    | ✅ `validateSearch` でネイティブ統合 |
| PageWrapper + Saga の廃止  | △ `useQuery` で近似 | △ `useQuery` で近似           | ✅ `loader` で完全廃止               |
| Loading / Error の一元管理 | ❌ 各ページで書く   | ❌ 各ページで書く             | ✅ ルートレベルで統一                |
| リダイレクトアダプター     | ❌                  | ✅                            | ✅                                   |
| 5 年後の SPA 適合度        | -                   | △ Remix 統合で SSR 寄りに進化 | ✅ SPA ファースト継続                |
| 学習コスト                 | 低                  | 低                            | 中                                   |

> **重要な前提**：このアプリにおける Router の価値は「ルーティング機能」ではなく、
> 「クエリパラメータ管理 + loader パターン」にある。

TanStack Router の実質的な優位性は以下の 2 点。

**① `validateSearch`（Zod 統合）**
全ページのクエリパラメータ・パスパラメータが型安全になり、バリデーション失敗時の `errorComponent` が自動で表示される。

**② `loader`**
ルートレベルで API の事前フェッチを宣言でき、`PageWrapper + ConfigSaga` を完全に廃止できる。
`pendingComponent` / `errorComponent` をルートに設定することで、各ページの `isLoading` / `isError` 分岐が消える。

```tsx
// rootRoute.loader で共通 API を一元管理
const rootRoute = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: ({ context: { queryClient } }) =>
    Promise.all([
      queryClient.ensureQueryData(userInfoQueryOptions),
      queryClient.ensureQueryData(batchDateQueryOptions),
    ]),
  pendingComponent: LoadingView,
  errorComponent: ErrorView,
})
```

---

## Decision

**TanStack Router（ファイルルーティング）+ TanStack Query を採用する。**

Router の責務はクエリパラメータ・パスパラメータの型安全管理と、`loader` による全ページ共通 API の一元管理に限定する。

---

## Consequences

**メリット**

- 全ページのパラメータが Zod で型安全になり、バリデーションエラーが `errorComponent` で自動ハンドリングされる
- `rootRoute.loader` で共通 API を一元管理することで、旧来の `PageWrapper + Redux Saga` を廃止できる
- ファイルルーティングにより `routes/` が薄い定義のみになり、ロジックが `pages/` に分離される
- クエリパラメータ形式・パスパラメータ形式の 2 ルートを共存させ、Native 側の移行を段階的に行える

**デメリット・制約**

- React Router より学習コストが高い
- エコシステムが React Router より小さい
- `loader` / `validateSearch` の設計を活かすには `routes/` を薄く保つ規律が必要になる（詳細は `.claude/rules/routing.md` 参照）
