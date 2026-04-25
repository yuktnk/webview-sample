import { expect, test } from './fixtures/nativeBridge'

/**
 * SampleModal E2Eテスト
 *
 * E2Eテストの責務:
 *   ルーティング → API → レンダリングの統合フローを確認する。
 *   コンポーネント単体の表示（Loading・Error状態）はStorybookで担保するため、
 *   ここでは正常系・ルーティング・バリデーションに絞る。
 */

test.describe('パスパラメータ形式 (/sampleModal/$from/$serviceType)', () => {
  test.describe('正常系', () => {
    test('sample_a/type_1 - データが表示される', async ({ page }) => {
      await page.goto('/sampleModal/sample_a/type_1')
      // getByRole()でセマンティックHTMLの確認
      await expect(page.getByRole('heading', { name: 'SampleA Type1 データ' })).toBeVisible()
      await expect(page.getByText('値', { exact: true })).toBeVisible()
      await expect(page.getByText('12345', { exact: true })).toBeVisible()
    })

    test('sample_a/type_2 - リスト形式のデータが表示される', async ({ page }) => {
      await page.goto('/sampleModal/sample_a/type_2')
      await expect(page.getByRole('heading', { name: 'SampleA Type2 データ' })).toBeVisible()
      await expect(page.getByText('アイテムA')).toBeVisible()
      await expect(page.getByText('アイテムB')).toBeVisible()
      await expect(page.getByText('アイテムC')).toBeVisible()
    })

    test('sample_b/type_1 - データが表示される', async ({ page }) => {
      await page.goto('/sampleModal/sample_b/type_1')
      await expect(page.getByRole('heading', { name: 'SampleB Type1 データ' })).toBeVisible()
      await expect(page.getByText('スコア: 85')).toBeVisible()
    })
  })

  test.describe('バリデーション', () => {
    test('無効なfromパラメータ - Zodバリデーションエラーが表示される', async ({ page }) => {
      await page.goto('/sampleModal/invalid/type_1')
      await expect(page.getByText('エラーが発生しました')).toBeVisible()
    })

    test('未対応のserviceType - コンテナが見つからないメッセージが表示される', async ({ page }) => {
      await page.goto('/sampleModal/sample_a/type_3')
      await expect(page.getByText('対応するコンテナが見つかりません')).toBeVisible()
    })
  })
})

test.describe('クエリパラメータ形式 (/sampleModal?from=&serviceType=)', () => {
  /**
   * Nativeアプリが実際に使うURL形式。
   * パスパラメータ形式と同じコンテナが表示されることを確認する。
   */
  test('sample_a/type_1 - データが表示される', async ({ page }) => {
    await page.goto('/sampleModal?from=sample_a&serviceType=type_1')
    await expect(page.getByRole('heading', { name: 'SampleA Type1 データ' })).toBeVisible()
  })

  test('sample_a/type_2 - データが表示される', async ({ page }) => {
    await page.goto('/sampleModal?from=sample_a&serviceType=type_2')
    await expect(page.getByRole('heading', { name: 'SampleA Type2 データ' })).toBeVisible()
  })

  test('無効なfromパラメータ - Zodバリデーションエラーが表示される', async ({ page }) => {
    await page.goto('/sampleModal?from=invalid&serviceType=type_1')
    await expect(page.getByText('エラーが発生しました')).toBeVisible()
  })
})
