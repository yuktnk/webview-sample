# ADR-007: axios を使わず fetch + 薄いラッパーにする

|            |            |
| ---------- | ---------- |
| **Status** | Accepted   |
| **Date**   | 2026-04-01 |

---

## Context

旧実装は axios を API クライアントとして使用していた。

```ts
// 旧実装：axios を直接使用・レスポンスの型が any
axios.get('/core/v2/user/user_info/').then((res) => res.data.result)
```

フルリプレイスにあたり、axios を継続するか、ブラウザ built-in の `fetch` に置き換えるかを検討した。

### 比較

|                          | axios                   | fetch（built-in）                     |
| ------------------------ | ----------------------- | ------------------------------------- |
| バンドルサイズ           | 🔴 +11KB                | ✅ 0KB（built-in）                    |
| `credentials: 'include'` | `withCredentials: true` | `credentials: 'include'`              |
| 4xx/5xx エラー           | ✅ 自動 throw           | ラッパーで `!res.ok` チェック（1 行） |
| JSON パース              | ✅ 自動                 | `.json()` 1 行                        |
| WebView 互換性           | ✅                      | ✅（モダン WebView はすべて対応）     |
| 依存ライブラリ数         | 🔴 外部依存             | ✅ なし                               |

### 判断

このアプリで axios が提供する機能のうち、実際に必要なものは以下の 2 つだけ。

1. `credentials: 'include'`（セッション Cookie の送信）
2. 4xx/5xx でのエラー throw

どちらも `fetch` の薄いラッパー 5 行で実現できる。
このアプリに必要な機能だけを見ると、axios を外部依存として維持するメリットがないと判断した。

---

## Decision

**axios を削除し、ブラウザ built-in の `fetch` + 薄いラッパー（`src/lib/apiFetch.ts`）に置き換える。**

```ts
export const apiFetch = <T>(path: string, options?: RequestInit): Promise<T> =>
  fetch(path, { credentials: 'include', ...options }).then((res) => {
    if (!res.ok) throw new Error(`API Error: ${res.status}`)
    return res.json() as Promise<T>
  })
```

---

## Consequences

**メリット**

- バンドルサイズが 11KB 削減される
- 外部依存が 1 つ減り、アップデート・脆弱性対応の手間がなくなる
- TanStack Query の `queryFn` に集約する設計と相性がよい

**デメリット・制約**

- axios のインターセプター相当の処理が必要になった場合は `apiFetch.ts` のラッパーを拡張する
- `fetch` を各所で直接呼ぶと MSW のモック範囲から外れ、Storybook・テストでの動作が保証されなくなる（詳細は `.claude/rules/api-design.md` 参照）
