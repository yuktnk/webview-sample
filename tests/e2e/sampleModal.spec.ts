import { expect, test } from './fixtures/nativeBridge'

test.describe('SampleModal', () => {
  test('sample_a/type_1 - データが表示される', async ({ page }) => {
    await page.goto('/sampleModal/sample_a/type_1')
    await expect(page.getByText('SampleA Type1 データ')).toBeVisible()
    await expect(page.getByText('値: 12345')).toBeVisible()
  })

  test('sample_a/type_2 - データが表示される', async ({ page }) => {
    await page.goto('/sampleModal/sample_a/type_2')
    await expect(page.getByText('SampleA Type2 データ')).toBeVisible()
    await expect(page.getByText('アイテムA')).toBeVisible()
  })

  test('sample_b/type_1 - データが表示される', async ({ page }) => {
    await page.goto('/sampleModal/sample_b/type_1')
    await expect(page.getByText('SampleB Type1 データ')).toBeVisible()
    await expect(page.getByText('スコア: 85')).toBeVisible()
  })

  test('無効なfromパラメータ - エラーコンポーネントが表示される', async ({
    page,
  }) => {
    await page.goto('/sampleModal/invalid/type_1')
    await expect(page.getByText('エラーが発生しました')).toBeVisible()
  })

  test('未対応のserviceType - コンテナが見つからないメッセージが表示される', async ({
    page,
  }) => {
    await page.goto('/sampleModal/sample_a/type_3')
    await expect(
      page.getByText('対応するコンテナが見つかりません'),
    ).toBeVisible()
  })
})
