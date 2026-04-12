/**
 * パスパラメータ形式のルート
 *
 * 開発時の直接アクセスや、将来Nativeがパスパラメータ形式に移行した際の受け口。
 * クエリパラメータ形式との移行背景は src/routes/sampleModal/index.tsx のコメントを参照。
 */
import { ErrorView } from '@/components/ui/ErrorView'
import { SampleModalPage } from '@/pages/SampleModal'
import { FROM_VALUES, SERVICE_TYPE_VALUES } from '@/types/routing'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

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
