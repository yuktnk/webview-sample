# ADR-009: Next.js を使わず Vite + React（SPA）にする

|            |            |
| ---------- | ---------- |
| **Status** | Accepted   |
| **Date**   | 2026-04-01 |

---

## Context

旧実装は Next.js で構築されていたが、このアプリは iOS/Android ネイティブアプリ内の WebView であり、実態は SPA と変わらない。

### 旧実装での Next.js の使われ方

```ts
// 全ページに getInitialProps + saga END が存在する
MyPage.getInitialProps = async (context) => {
  const store = context.reduxStore
  store.dispatch(actions.fetchData())
  store.dispatch(END) // ← SSR のための saga 終了
  await store.sagaTask.toPromise()
  return {}
}
```

このパターンが全ページに存在していたが、WebView として起動された場合 **SSR の結果は使われない**。
ブラウザで JS が読み込まれた後、再度 API フェッチが走る（ハイドレーション後の再取得）。

SSR の恩恵（初期表示の高速化・SEO）はいずれも WebView では意味をなさない。

### 選択肢の比較

|                        | Next.js                         | **Vite + React（SPA）** | Remix |
| ---------------------- | ------------------------------- | ----------------------- | ----- |
| SSR / RSC              | ✅                              | ❌（不要）              | ✅    |
| Node.js サーバーが必要 | 🔴（App Router）                | ✅ 不要                 | 🔴    |
| 静的ファイルのみで動作 | △（output: export 時のみ）      | ✅ 常に                 | ❌    |
| Python ランタイム維持  | △                               | ✅                      | ❌    |
| HMR 速度               | △（webpack ベース）             | ✅ Vite は高速          | △     |
| バンドルサイズ         | △                               | ✅ 最適化しやすい       | △     |
| SPA ファーストの継続性 | 🔴 App Router で SSR 寄りに進化 | ✅                      | ❌    |

### Python ランタイムとの連動

App Engine のランタイムを Python で統一している（[ADR-002](./002-app-engine-python-runtime.md)）。
これは「Node.js サーバーを持たない = 静的ファイルのみ配信」という制約でもある。

Next.js の App Router（React Server Components）は Node.js サーバーが必須であるため、
この制約と根本的に相容れない。

---

## Decision

**Next.js を採用せず、Vite + React による SPA 構成にする。**

```
ビルド成果物：静的ファイル（HTML + JS + CSS）のみ
配信：App Engine（Python ランタイム）から静的ファイルとして配信
```

---

## Consequences

**メリット**

- Node.js サーバーが不要なため、Python ランタイムを維持できる（[ADR-002](./002-app-engine-python-runtime.md) の制約を守れる）
- 静的ファイルのみのデプロイになり、サーバー管理の複雑さがない
- Vite の高速な HMR により開発体験が向上する
- SSR / RSC / `getInitialProps` のような概念が存在しないため、コードが単純になる

**デメリット・制約**

- SEO が必要になった場合はこの選択を再考する必要がある（現状 WebView のため不要）
- React Server Components・Server Actions など今後の React エコシステムの進化の一部を活かせない可能性がある
