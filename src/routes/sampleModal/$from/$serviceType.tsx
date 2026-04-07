import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { FROM_VALUES } from '../../../types/from'
import { SERVICE_TYPE_VALUES } from '../../../types/serviceType'
import { userInfoQueryOptions, batchDateQueryOptions } from '../../../queries/common'
import { SampleModalPage } from '../../../pages/SampleModal'

export const Route = createFileRoute('/sampleModal/$from/$serviceType')({
  params: {
    parse: (params) => ({
      from: z.enum(FROM_VALUES).parse(params.from),
      serviceType: z.enum(SERVICE_TYPE_VALUES).parse(params.serviceType),
    }),
  },
  loader: ({ context: { queryClient } }) => Promise.all([
    queryClient.ensureQueryData(userInfoQueryOptions),
    queryClient.ensureQueryData(batchDateQueryOptions),
  ]),
  pendingComponent: () => <div>Loading...</div>,
  errorComponent: () => <div>Error!</div>,
  component: SampleModalPage,
})
