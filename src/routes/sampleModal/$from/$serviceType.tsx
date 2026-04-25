/**
 * パスパラメータ形式のルート
 *
 * 開発時の直接アクセスや、将来Nativeがパスパラメータ形式に移行した際の受け口。
 * クエリパラメータ形式との移行背景は src/routes/sampleModal/index.tsx のコメントを参照。
 */
import { createFileRoute } from '@tanstack/react-router'

import { z } from 'zod'

import { ErrorView } from '@/components/ui/ErrorView'
import { LoadingView } from '@/components/ui/LoadingView'
import { SampleModalPage } from '@/pages/sampleModal'
import { FROM_VALUES, SERVICE_TYPE_VALUES } from '@/types/routing'

export const Route = createFileRoute('/sampleModal/$from/$serviceType')({
  params: {
    parse: (params) => ({
      from: z.enum(FROM_VALUES).parse(params.from),
      serviceType: z.enum(SERVICE_TYPE_VALUES).parse(params.serviceType),
    }),
  },
  pendingComponent: LoadingView,
  errorComponent: ErrorView,
  component: function SampleModalPathRoute() {
    const { from, serviceType } = Route.useParams()
    return <SampleModalPage from={from} serviceType={serviceType} />
  },
})
