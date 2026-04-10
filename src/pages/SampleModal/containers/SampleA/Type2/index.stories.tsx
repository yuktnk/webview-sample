import type { Meta, StoryObj } from '@storybook/react-vite'
import { http, delay, HttpResponse } from 'msw'
import { SampleAType2Container } from '.'

const meta: Meta<typeof SampleAType2Container> = {
  component: SampleAType2Container,
}
export default meta
type Story = StoryObj<typeof SampleAType2Container>

export const Default: Story = {}

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/sample_a/type_2', async () => {
          await delay('infinite')
        }),
      ],
    },
  },
}

export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/sample_a/type_2', () => HttpResponse.error()),
      ],
    },
  },
}
