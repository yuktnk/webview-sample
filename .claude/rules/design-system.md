---
paths: ['src/**/*.tsx', 'tailwind.config.ts']
---

# デザインシステム

デザインシステムの一貫性を強制するルール。このプロジェクトでは、**定義されたトークンのみを使用**することで、誰がコードを書いても同じルールに従う環境を実現します。

---

## 設計原則

### 1. 定義値のみ使用

カラー・フォント・スペーシング・角丸・シャドウなど、すべての値は **`tailwind.config.ts` で定義されたもののみ** を使用します。

arbitrary value（`p-[13px]`）や未定義の Tailwind デフォルト値の使用は禁止。

### 2. 単位の統一（px）

Native 側で `html font-size` を制御していないため rem の値が予測不可能になる。そのため、すべての寸法値（fontSize・spacing・borderRadius）を **px で統一**。
→ なぜ px を選んだかは [ADR-005](../../docs/adr/005-tailwind-css.md)（「px を採用・rem を禁止した理由」節）を参照

### 3. スマートフォン専用設計

このアプリは **iPhone・Android スマートフォンからのみ起動**される設計です。

- メディアクエリ（`md:`・`lg:` など）は使用しない
- ダークモード対応は実装しない
- ビューポート幅は固定（スマートフォンサイズのみ対応）

### 4. プロダクト独自のトークン命名

トークン名は **Tailwind CSS の命名規則に従わず、プロダクト独自** の命名になります。

例：

```ts
// Tailwind 標準: primary-50, primary-500, primary-900
// プロダクト独自: 将来、色の意味に基づいた名称に変更される可能性
colors: {
  primary: {
    /* ... */
  }
}
```

トークンの名称変更時は、`.claude/rules/design-system.md` でアナウンスします。

### 5. 将来への柔軟性

後から rem に移行したい場合、**`tailwind.config.ts` を変更するだけで OK**。HTML のクラス名は変更不要です。

```ts
// 現在（px版）
spacing: { 4: '16px' }

// 将来（rem版に移行）
spacing: { 4: '1rem' }

// HTML は変更なし
<div className="p-4">  // 自動で 1rem に追従
```

---

## 実装（Tailwind CSS）

### ✅ 許可（定義されたトークン）

```tsx
<div className="p-4">           // 16px（定義済み）
<div className="mt-1">          // 4px（定義済み）
<div className="text-lg">       // 18px（定義済み）
<div className="rounded-md">    // 6px（定義済み）
<div className="bg-primary-500"> // 定義済みカラー
```

### ❌ 禁止（arbitrary value・rem・未定義値）

```tsx
// これらは使用禁止
<div className="p-[13px]">       // arbitrary spacing
<div className="text-[15px]">    // arbitrary fontSize
<div className="rounded-[5px]">  // arbitrary borderRadius
<div className="bg-[#0ea5e9]">   // arbitrary color
<div className="mt-[1rem]">      // rem 単位
<div className="p-5">            // Tailwind デフォルト（定義外）
```

---

## 禁止事項

| 項目                         | 例              | 理由                       |
| ---------------------------- | --------------- | -------------------------- |
| arbitrary spacing            | `p-[13px]`      | 設計システムの一貫性を崩す |
| arbitrary fontSize           | `text-[15px]`   | 予測不可能な値             |
| arbitrary borderRadius       | `rounded-[5px]` | タイポグラフィシステム外   |
| arbitrary color              | `bg-[#0ea5e9]`  | カラーパレット外           |
| rem 単位                     | `mt-[1rem]`     | WebView での値が不確定     |
| 未定義の Tailwind デフォルト | `p-5`           | 設計システム外             |

---

## トークン一覧

定義されているすべてのトークン（色・スペーシング・フォント・角丸・シャドウ）は **[`tailwind.config.ts`](../../tailwind.config.ts)** に記載されています。

新しい値が必要な場合は、`tailwind.config.ts` に追加してください。

---

## 実装時のガイドライン

実装中によくあるシーンごとの対応方法。

### 新しいコンポーネント作成時

**1. まず既存トークンで対応できるか確認**

```tsx
// ❌ これは何？と思ったら
<div className="p-?">

// ✅ tailwind.config.ts を見て、定義されたトークンから選ぶ
<div className="p-1">    // 4px
<div className="p-2">    // 8px
<div className="p-4">    // 16px
```

**2. 「ちょうどいい値がない」と感じたら、一度立ち止まる**

```
「13px が必要」と思ったら：
- 本当に 13px？それとも 12px か 16px でいい？
- デザイナーに確認すべき？
- それとも既存トークンで妥協できる？
```

**3. 本当に新しい値が必要なら、config に追加**

```ts
// tailwind.config.ts に追加
spacing: {
  // ...
  '13px': '13px',  // コメント: [コンポーネント名] の [理由]
}

// その後、実装
<div className="p-13px">
```

### トークン追加時

```
ステップ：
1. tailwind.config.ts に値を追加
2. コミットメッセージに「なぜこの値が必要か」を書く
   例: "feat: spacing に 13px を追加（CardAction パディング）"

注：tailwind.config.ts が単一の情報源なため、メンテナンスはそこだけで完結します。
```

### 「この値、あったっけ？」という時

```bash
# grep で探す
grep -r "mt-\|p-\|text-\|rounded-" src --include="*.tsx" | grep "4\|8\|12\|16"

# または tailwind.config.ts を見直す
# 定義されたトークンのみが有効
```

### デザイン変更で色が変わった時

```ts
// tailwind.config.ts の色を更新するだけで OK
colors: {
  primary: {
    500: '#0ea5e9',  // ← この値を変更
  }
}

// すべての bg-primary-500 が自動で新色に追従
// コンポーネントの修正は不要
```

### レビュー時のチェックリスト

```
□ arbitrary value（[13px] など）がない？
□ rem を使ってない？
□ Tailwind デフォルト値（p-5 など未定義）を使ってない？
□ 新しい値を追加した場合、tailwind.config.ts に記載された？
```

### 「設計システムに準拠しているか不安」という時

```
判断フロー：
1. tailwind.config.ts に定義されている？
   → Yes: OK
   → No: 次へ

2. arbitrary value（[] の中に直接値）を使ってない？
   → Yes（使ってない）: OK
   → No（使ってる）: NG → config に追加してから使う

3. rem や未定義の Tailwind 値を使ってない？
   → Yes: OK
   → No: 修正
```

---

## 運用ルール

1. **実装前に** — 必要な値が config に定義されているか確認（`tailwind.config.ts` を見る）
2. **新しい値が必要なら** — `tailwind.config.ts` に追加してから実装開始
3. **新しい値追加時** — コミットメッセージに「なぜこの値が必要か」を記載
4. **コードレビュー時** — チェックリストで確認
5. **デザイン変更時** — `tailwind.config.ts` を更新（コンポーネント修正不要）

この方針により、誰がコードを書いても設計システムに準拠することが保証されます。
