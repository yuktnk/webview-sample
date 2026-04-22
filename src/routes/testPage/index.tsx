import { TestPage } from '@/pages/testPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/testPage/')({
  component: TestPage,
})
