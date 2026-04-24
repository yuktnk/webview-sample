import { expect } from '@playwright/test'

import { test } from './fixtures/nativeBridge'

/**
 * Visual Regression Test
 *
 * スクリーンショット差分でUIの意図しない変更を検知する。
 * pnpm test:visual でベースライン更新、CI では差分検知のみ実行。
 *
 * ベースライン画像: tests/e2e/visual.spec.ts-snapshots/
 */

test.describe('visual regression', () => {
  test('sample_a/type_1', async ({ page }) => {
    await page.goto('/sampleModal/sample_a/type_1')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('sample-a-type1.png')
  })

  test('sample_a/type_2', async ({ page }) => {
    await page.goto('/sampleModal/sample_a/type_2')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('sample-a-type2.png')
  })

  test('sample_b/type_1', async ({ page }) => {
    await page.goto('/sampleModal/sample_b/type_1')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('sample-b-type1.png')
  })

  test('エラー表示', async ({ page }) => {
    await page.goto('/sampleModal/invalid/type_1')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('error-view.png')
  })

  test('コンテナ未定義', async ({ page }) => {
    await page.goto('/sampleModal/sample_a/type_3')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('container-not-found.png')
  })
})
