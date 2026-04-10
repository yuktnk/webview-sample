import type { ServiceType } from '../../types/serviceType'
import { Route } from '../../routes/sampleModal/$from/$serviceType'
import { CONTAINER_MAP } from './containers'

export const SampleModalPage = () => {
  const { from, serviceType } = Route.useParams()
  const map = CONTAINER_MAP[from] as Partial<Record<ServiceType, React.ComponentType>>
  const Container = map[serviceType]

  if (!Container) {
    return <div className="p-4 text-red-500">対応するコンテナが見つかりません</div>
  }

  return <Container />
}
