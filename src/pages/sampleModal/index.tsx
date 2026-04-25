import { ErrorView } from '@/components/ui/ErrorView'
import type { FromType, ServiceType } from '@/types/routing'

import { CONTAINER_MAP } from './containers'

type Props = { from: FromType; serviceType: ServiceType }

export function SampleModalPage({ from, serviceType }: Props) {
  const map = CONTAINER_MAP[from] as Partial<Record<ServiceType, React.ComponentType>>
  const Container = map[serviceType]

  if (!Container) {
    return <ErrorView message="対応するコンテナが見つかりません" />
  }

  return <Container />
}
