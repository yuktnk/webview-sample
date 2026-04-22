import type { Meta, StoryObj } from '@storybook/react-vite'
import { TestPage } from './index'

const meta: Meta<typeof TestPage> = {
  component: TestPage,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [],
    },
  },
}

export const Error: Story = {
  parameters: {
    msw: {
      handlers: [],
    },
  },
}
