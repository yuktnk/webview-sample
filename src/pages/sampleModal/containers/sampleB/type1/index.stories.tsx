import type { Meta, StoryObj } from '@storybook/react-vite'
import { delay, HttpResponse, http } from 'msw'

import { API_ENDPOINTS } from '@/constants/apiEndpoints'

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
        http.get(API_ENDPOINTS.SAMPLE_B_TYPE1, async () => {
          await delay('infinite')
        }),
      ],
    },
  },
}

export const ErrorStory: Story = {
  parameters: {
    msw: {
      handlers: [http.get(API_ENDPOINTS.SAMPLE_B_TYPE1, () => HttpResponse.error())],
    },
  },
}
