import { test as base } from '@playwright/test'

/**
 * 認証fixture
 * PoC段階では認証不要。
 * 実際の実装ではCookieやトークンをここで設定する。
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    // TODO: 本番実装時はここでセッションCookieやAuthヘッダーを設定する
    // 例: await page.context().addCookies([{ name: 'session', value: 'xxx', ... }])
    await use(page)
  },
})

export const expect = base.expect
