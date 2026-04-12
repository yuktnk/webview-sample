import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { FROM_VALUES } from '../../../types/from'
import { SERVICE_TYPE_VALUES } from '../../../types/serviceType'
import { SampleModalPage } from '../../../pages/SampleModal'
import { ErrorView } from '../../../components/ui/ErrorView'

export const Route = createFileRoute('/sampleModal/$from/$serviceType')({
  params: {
    parse: (params) => ({
      from: z.enum(FROM_VALUES).parse(params.from),
      serviceType: z.enum(SERVICE_TYPE_VALUES).parse(params.serviceType),
    }),
  },
  pendingComponent: () => <div>Loading...</div>,
  errorComponent: ErrorView,
  component: function SampleModalPathRoute() {
    const { from, serviceType } = Route.useParams()
    return <SampleModalPage from={from} serviceType={serviceType} />
  },
})
