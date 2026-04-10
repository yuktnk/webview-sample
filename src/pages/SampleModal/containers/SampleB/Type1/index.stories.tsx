import type { Meta, StoryObj } from '@storybook/react-vite'
import { http, delay, HttpResponse } from 'msw'
import { SampleBType1Container } from '.'

const meta: Meta<typeof SampleBType1Container> = {
  component: SampleBType1Container,
}
export default meta
type Story = StoryObj<typeof SampleBType1Container>

export const Default: Story = {}

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/sample_b/type_1', async () => {
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
        http.get('/api/sample_b/type_1', () => HttpResponse.error()),
      ],
    },
  },
}
