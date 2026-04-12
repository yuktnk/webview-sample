/**
 * Nativeからのクエリパラメータ形式を受け付けるルート
 *
 * リプレイス前のNativeアプリが /sampleModal?from=&serviceType= でWebViewを起動するため、
 * 互換性のためにこのルートを維持している。
 *
 * SampleModalPageはpropsでfrom/serviceTypeを受け取る設計のため、
 * URLの形式に関わらず同じページコンポーネントを使い回せる。
 *
 * 将来Nativeがパスパラメータ形式に対応したら、このファイルを削除するだけで移行完了。
 * 移行先: src/routes/sampleModal/$from/$serviceType.tsx
 */
import { ErrorView } from '@/components/ui/ErrorView'
import { SampleModalPage } from '@/pages/SampleModal'
import { FROM_VALUES } from '@/types/from'
import { SERVICE_TYPE_VALUES } from '@/types/serviceType'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/sampleModal/')({
  validateSearch: z.object({
    from: z.enum(FROM_VALUES),
    serviceType: z.enum(SERVICE_TYPE_VALUES),
  }),
  errorComponent: ErrorView,
  component: function SampleModalQueryRoute() {
    const { from, serviceType } = Route.useSearch()
    return <SampleModalPage from={from} serviceType={serviceType} />
  },
})
