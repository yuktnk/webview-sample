import { test } from '@playwright/test'
import { checkA11y, injectAxe } from 'axe-playwright'

test.describe('Accessibility Audit', () => {
  test('sampleModal should be accessible', async ({ page }) => {
    await page.goto('/sampleModal/sample_a/type_1')
    await injectAxe(page)
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    })
  })
})
