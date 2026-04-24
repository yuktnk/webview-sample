---
paths: ['src/**/*.tsx', 'src/**/*.ts']
---

# AIコードレビュー観点

品質ピラミッドが整った環境での AI による検査。自動ツールでは見えない「設計・パフォーマンス・セキュリティ」を補う。

---

## レビューしてほしい観点

### 設計・アーキテクチャ

- `routes/` が薄い定義になっているか（ロジックが `pages/` に分離されているか）
- Container が内部で切り替えロジックを持っていないか
- 複数バリエーション（from × serviceType など）がある場合、CONTAINER_MAP の追加だけで済むか
- ページ間の状態共有がないか（グローバル状態管理ライブラリ不要の原則）

### パフォーマンス

- 不要な再レンダリングが発生していないか
- TanStack Query の `queryKey` が適切に設定されているか
- 不要な `useEffect` を使っていないか
- API キャッシュ戦略が適切か

### セキュリティ

- API レスポンスを Zod でパースしているか
- クエリパラメータ・パスパラメータのバリデーションが抜けていないか
- 機密情報がコード中に含まれていないか（secretlint の補完）

### テスト

- Story が 3 点セット（Default・Loading・Error）揃っているか
- E2E テストで異常系がカバーされているか
- MSW ハンドラーが `handlers/index.ts` に集約されているか
- 重要なロジックに Vitest が存在するか

### NativeBridge

- NativeBridge を直接呼んでいるか（Redux 経由になっていないか）
- 呼び出しタイミングが仕様通りか（モジュール初期化時ではなくイベントハンドラ内か）
- iOS / Android 差異を考慮しているか

### TanStack Query・Router

- TanStack Query の `queryOptions` が `queries/` に定義されているか
- TanStack Router の `loader` に共通 API が集約されているか
- Zod バリデーションが適切か
- キャッシュ戦略（staleTime・gcTime）が妥当か

---

## レビュー不要な観点（ツールで担保済み）

| 観点                    | 担保しているツール            |
| ----------------------- | ----------------------------- |
| フォーマット            | Prettier                      |
| import の順番           | ESLint (`import/order`)       |
| any の使用              | ESLint                        |
| console.log の残留      | ESLint                        |
| 型の整合性              | TypeScript strict: true       |
| 未使用変数・ファイル    | knip                          |
| TanStack Query ベスプラ | @tanstack/eslint-plugin-query |
| コミット規約            | commitlint                    |
| 機密情報漏洩            | secretlint                    |
