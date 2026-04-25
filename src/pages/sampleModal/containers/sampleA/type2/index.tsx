import { useQuery } from '@tanstack/react-query'

import { ErrorView } from '@/components/ui/ErrorView'
import { LoadingView } from '@/components/ui/LoadingView'
import { DataCard } from '@/pages/sampleModal/containers/sampleA/components/DataCard'
import { sampleAType2QueryOptions } from '@/queries/sampleA'

export function SampleAType2Container() {
  const { data, isLoading, isError } = useQuery(sampleAType2QueryOptions)

  if (isLoading) return <LoadingView />
  if (isError) return <ErrorView />
  if (!data) return null

  return (
    <div className="p-1">
      <h1 className="text-2xl font-bold">{data.result.title}</h1>
      <ul className="mt-1 space-y-1">
        {data.result.items.map((item) => (
          <li key={item.label}>
            <DataCard label={item.label} value={item.count} />
          </li>
        ))}
      </ul>
    </div>
  )
}
