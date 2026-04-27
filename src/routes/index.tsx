/* eslint-disable react-refresh/only-export-components */
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'

import { CONTAINER_MAP } from '@/pages/sampleModal/containers'
import type { FromType, ServiceType } from '@/types/routing'

type RouteInfo = { id: string }

function RootPage() {
  const isDev = import.meta.env.MODE === 'development'
  const router = useRouter()

  if (!isDev) {
    // 本番環境：空のページ
    return <div />
  }

  // 1. 動的パスを含まないページをリスト化（routesById で全ルートをフラットに取得）
  const staticRoutes = Object.values(
    router.routesById as unknown as Record<string, RouteInfo>,
  ).filter((route) => route.id !== '__root__' && route.id !== '/' && !route.id.includes('$'))

  // 2. CONTAINER_MAP から利用可能な from と serviceType の組み合わせを取得
  const containerRoutes = Object.entries(CONTAINER_MAP).flatMap(([fromType, serviceTypes]) =>
    Object.keys(serviceTypes).map((serviceType) => ({
      from: fromType as FromType,
      serviceType: serviceType as ServiceType,
    })),
  )

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">webview-sample</h1>
      <p className="text-neutral-600 mb-8">開発環境用のページリンク</p>

      {staticRoutes.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">静的ページ</h2>
          <ul className="space-y-2">
            {staticRoutes.map((route) => (
              <li key={route.id}>
                <Link to={route.id} className="text-primary-600 hover:underline">
                  {route.id}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {containerRoutes.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">コンテナページ</h2>
          <ul className="space-y-2">
            {containerRoutes.map(({ from, serviceType }) => (
              <li key={`${from}-${serviceType}`}>
                <Link
                  to="/sampleModal"
                  search={{ from, serviceType }}
                  className="text-primary-600 hover:underline"
                >
                  {from} / {serviceType}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: RootPage,
})
