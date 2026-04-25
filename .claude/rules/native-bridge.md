---
paths: ['src/bridge/**/*']
---

# NativeBridge 仕様

## 概要

Web アプリと Native アプリ（iOS / Android）間の通信インターフェース。

実装は `src/bridge/index.ts` を参照。

## Android（WebView）

`MebViewInterface` オブジェクト経由で通信。

```ts
;(window as unknown as Record<string, unknown>)['MebViewInterface']
```

## iOS（WKWebView）

`webkit.messageHandlers` を通じて通信。

```ts
;(window as unknown as Record<string, unknown>)['webkit'].messageHandlers
```

---

## コンポーネント内での使用ルール

**重要：** NativeBridge の呼び出しはモジュールトップレベルではなく、**イベントハンドラ内**で実行してください。

```ts
// ❌ ダメ（モジュール初期化時に実行される）
const bridge = getNativeBridge()
bridge.doSomething()

// ✅ OK（ユーザー操作時に実行）
function handleButtonClick() {
  const bridge = getNativeBridge()
  bridge.doSomething()
}
```

### 理由

Storybook・Vitest 環境では `webkit` / `MebViewInterface` が存在しないため、
モジュールトップレベルで呼び出すと実行時エラーが発生します。

イベントハンドラ内で呼び出すことで、実際に Native と通信する時点で判定できます。

---

## NativeBridge メソッド一覧

詳細は `src/bridge/index.ts` の型定義を参照。

```ts
interface NativeBridge {
  onClickClose(): void // 閉じるボタンタップ時
  sendTrack(params): void // 画面表示時・ボタンタップ時（トラッキング）
  // ... その他メソッド
}
```
