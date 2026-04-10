import { test as base } from '@playwright/test'

/**
 * NativeBridge fixture
 * addInitScriptでページロード前にwindow.webkit / window.MebViewInterfaceをモックする。
 * src/bridge/index.tsのgetBridge()がモジュール初期化時に呼ばれるためページナビゲーション前に設定が必要。
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(() => {
      const noop = () => { /* no-op */ }

      const messageHandlers = new Proxy({} as Record<string, { postMessage: (params?: string) => void }>, {
        get: () => ({ postMessage: noop }),
      })

      ;(window as unknown as Record<string, unknown>)['webkit'] = { messageHandlers }

      ;(window as unknown as Record<string, unknown>)['MebViewInterface'] = new Proxy(
        {} as Record<string, () => void>,
        { get: () => noop }
      )
    })
    await use(page)
  },
})

export const expect = base.expect
