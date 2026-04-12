import { describe, expect, it } from 'vitest'
import { formatDate } from './formatDate'

describe('formatDate', () => {
  it('ISO日付を日本語形式にフォーマットする', () => {
    expect(formatDate('2024-01-15')).toBe('2024年01月15日')
  })

  it('月・日が1桁の場合もゼロパディングのまま出力する', () => {
    expect(formatDate('2024-01-01')).toBe('2024年01月01日')
  })
})
