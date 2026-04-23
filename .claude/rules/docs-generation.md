---
paths: ['docs/**/*.md', '.claude/skills/generate-docs-*/**/*']
---

# ドキュメント自動生成

## 命名規則（重要）

自動ドキュメント生成スキルが正しく動作するには、以下の命名規則を **厳密に守る** 必要があります。

### ページドキュメント生成（`/generate-docs-pages`）

**ページ名** — キャメルケース（`sampleModal`）

```
src/pages/sampleModal/
├── index.tsx                                # ページコンポーネント
├── containers/
│   ├── sampleA/
│   │   ├── type1/
│   │   │   ├── index.tsx
│   │   │   └── index.stories.tsx            ✓ 必須
│   │   └── type2/
│   │       ├── index.tsx
│   │       └── index.stories.tsx            ✓ 必須
│   └── sampleB/
│       └── type1/
│           ├── index.tsx
│           └── index.stories.tsx            ✓ 必須
└── index.ts                                 # CONTAINER_MAP

src/routes/sampleModal/                      # キャメルケース
├── index.tsx
└── $from/$serviceType.tsx

tests/e2e/sampleModal.spec.ts                # キャメルケース・E2E テスト
```

**使用方法：**

```
/generate-docs-pages sampleModal
→ docs/pages/sampleModal.md を生成
  参照：Storybook（*.stories.tsx）+ E2E テスト（sampleModal.spec.ts）
```

### API ドキュメント生成（`/generate-docs-api`）

**API 名** — キャメルケース（`sampleA`、`sampleA_type_1`）

```
src/queries/sampleA.ts                       # キャメルケース
src/types/api/sampleA.ts                     # キャメルケース
src/mocks/handlers/sampleA.ts
src/mocks/data/sampleA.ts
```

**使用方法：**

```
/generate-docs-api sampleA
→ docs/api/sampleA.md を生成（複数 Type がある場合は sampleAType1, sampleAType2 も生成）
  参照：Query（sampleA.ts）+ Type（sampleA.ts）+ MSW ハンドラー

/generate-docs-api sampleAType1
→ docs/api/sampleAType1.md を生成（API 単位）
```

---

## ファイル対応表

| 種別             | パターン                      | ファイル                      |
| ---------------- | ----------------------------- | ----------------------------- |
| **ページ**       | sampleModal（キャメルケース） | src/pages/sampleModal/        |
| **ルート**       | sampleModal（キャメルケース） | src/routes/sampleModal/       |
| **E2E テスト**   | sampleModal.spec.ts           | tests/e2e/sampleModal.spec.ts |
| **ドキュメント** | sampleModal.md                | docs/pages/sampleModal.md     |
| **API**          | sampleA（キャメルケース）     | src/queries/sampleA.ts        |
| **型定義**       | sampleA（キャメルケース）     | src/types/api/sampleA.ts      |
| **MSW**          | sampleA（キャメルケース）     | src/mocks/handlers/sampleA.ts |
| **API Doc**      | sampleA.md（キャメルケース）  | docs/api/sampleA.md           |

---

## 運用ルール

- 実装・Story・E2Eテストが揃ったタイミングでドキュメントを生成する
- APIのレスポンス型が変わったら該当の `docs/pages/*.md` や `docs/api/*.md` も更新する
- ドキュメントが実態と乖離していると気づいたら即更新する（陳腐化を防ぐ）
