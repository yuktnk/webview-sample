import type { Meta, StoryObj } from '@storybook/react-vite'
import { DataCard } from './DataCard'

const meta: Meta<typeof DataCard> = {
  component: DataCard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'スコア',
    value: 85,
  },
}

export const WithString: Story = {
  args: {
    label: 'ステータス',
    value: 'active',
  },
}

export const LongValue: Story = {
  args: {
    label: 'サンプル店舗',
    value: 'サンプル店舗1号店',
  },
}
