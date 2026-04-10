import type { Meta, StoryObj } from '@storybook/react-vite'
import { http, delay, HttpResponse } from 'msw'
import { SampleAType1Container } from '.'

const meta: Meta<typeof SampleAType1Container> = {
  component: SampleAType1Container,
}
export default meta
type Story = StoryObj<typeof SampleAType1Container>

export const Default: Story = {}

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/sample_a/type_1', async () => {
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
        http.get('/api/sample_a/type_1', () => HttpResponse.error()),
      ],
    },
  },
}
