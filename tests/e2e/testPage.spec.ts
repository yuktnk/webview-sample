import { expect, test } from '@playwright/test'
import { nativeBridgeFixture } from './fixtures/nativeBridge'

test.describe('TestPage', () => {
  test.use({ ...nativeBridgeFixture })

  test('ページが読み込まれる', async ({ page }) => {
    await page.goto('/testPage') // ← ルーティング設定に合わせて URL を修正
    await expect(page.getByRole('heading')).toContainText('Test Page')
  })

  test('エラー状態を表示する', async ({ page }) => {
    // エラーハンドリングのテスト
    await page.goto('/testPage') // ← ルーティング設定に合わせて URL を修正
    // 期待される動作をアサート
  })
})
