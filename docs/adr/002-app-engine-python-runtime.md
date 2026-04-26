# ADR-002: App Engine ランタイムを Python にする

|            |            |
| ---------- | ---------- |
| **Status** | Accepted   |
| **Date**   | 2026-04-01 |

---

## Context

フルリプレイス後のアプリ（ADR-001）は Vite によるビルド成果物（HTML + JS + CSS）のみで動作する純粋な SPA である。
App Engine へのデプロイ時にどのランタイムを選ぶかを検討した。

### 選択肢

**Node.js ランタイム**

Next.js 時代の流れから Node.js ランタイムを継続することが考えられる。
しかし今回の SPA は SSR を一切行わないため、Node.js サーバーを起動する理由がない。
Node.js ランタイムを使うと、将来の開発者が「サーバーサイドで何かできるはず」と誤解し、
React Server Components や API Routes の実装を試みるリスクがある。
これはこのアプリの設計思想（静的ファイル配信・WebView 専用 SPA）と根本的に相容れない。

**Python ランタイム**

別の既存 SPA アプリも App Engine + Python ランタイムで静的ファイル配信を行っている。
Python ランタイムは静的ファイルの配信に使うだけであり、Python コードを書く必要はない。

---

## Decision

**App Engine のランタイムを Python にする。**

このアプリは静的ファイル配信のみで動作する設計であり、Node.js サーバーを必要としない。
別の既存 SPA アプリと Python ランタイムを統一することで、EOSL 対応を一元化する。

---

## Consequences

**メリット**

- Node.js サーバーが不要になり、インフラコストが削減される
- 既存 SPA アプリと統一されるため、EOSL 対応・インフラ管理の手間が減る
- ランタイムが Python であることで、Node.js 前提の機能（SSR・API Routes）を実装できない構造になり、設計の逸脱を防ぐ

**デメリット・制約**

- Storybook は本番サービスと分離したデプロイ構成が必要になる
