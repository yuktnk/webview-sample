/* eslint-disable react-refresh/only-export-components */
import { createFileRoute, useRouter } from '@tanstack/react-router'

import { CONTAINER_MAP } from '@/pages/sampleModal/containers'
import type { FromType, ServiceType } from '@/types/routing'

type RouteNode = {
  id: string
  path?: string
  children?: RouteNode[]
}

function RootPage() {
  const isDev = import.meta.env.MODE === 'development'
  const router = useRouter()

  if (!isDev) {
    // 本番環境：空のページ
    return <div />
  }

  // 開発環境：リンク集を動的生成

  // 1. 動的パスを含まないページをリスト化
  const collectRoutes = (
    node: RouteNode,
    routes: RouteNode[] = [],
  ): RouteNode[] => {
    const id = node.id
    // パスパラメータ（$ を含む）がなく、ルートページ / とparent __ を除外
    if (id && id !== '__root__' && id !== '/' && !id.includes('$')) {
      routes.push(node)
    }
    if (node.children) {
      node.children.forEach((child) => {
        collectRoutes(child, routes)
      })
    }
    return routes
  }

  const staticRoutes = collectRoutes(router.routeTree as unknown as RouteNode)

  // 2. CONTAINER_MAP から利用可能な from と serviceType の組み合わせを取得
  const containerRoutes = Object.entries(CONTAINER_MAP).flatMap(
    ([fromType, serviceTypes]) =>
      Object.keys(serviceTypes).map((serviceType) => ({
        from: fromType as FromType,
        serviceType: serviceType as ServiceType,
      })),
  )

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">webview-sample</h1>
      <p className="text-gray-600 mb-8">開発環境用のページリンク</p>

      {staticRoutes.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">静的ページ</h2>
          <ul className="space-y-2">
            {staticRoutes.map((route: RouteNode) => {
              const path = route.path ?? route.id
              const id = route.id

              return (
                <li key={id}>
                  <a href={path} className="text-blue-600 hover:underline">
                    {id}
                  </a>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {containerRoutes.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">コンテナページ</h2>
          <ul className="space-y-2">
            {containerRoutes.map(({ from, serviceType }) => (
              <li key={`${from}-${serviceType}`}>
                <a
                  href={`/sampleModal?from=${from}&serviceType=${serviceType}`}
                  className="text-blue-600 hover:underline"
                >
                  {from} / {serviceType}
                </a>
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
