# NativeBridge 仕様

## 概要

Web アプリと Native アプリ（iOS / Android）間の通信インターフェース。

## 実装

`src/bridge/index.ts` を参照。

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

## コンポーネント内での使用

NativeBridge の呼び出しはモジュールトップレベルではなく、**イベントハンドラ内**で実行してください。

```ts
// ❌ ダメ（モジュール初期化時に実行される）
const bridge = getNativeBridge()

// ✅ OK（ユーザー操作時に実行）
function handleButtonClick() {
  const bridge = getNativeBridge()
  bridge.doSomething()
}
```

**理由**: Storybook・Vitest 環境では `webkit` / `MebViewInterface` が存在しないため、
モジュールトップレベルで呼び出すと実行時エラーが発生します。
