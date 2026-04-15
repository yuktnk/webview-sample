import { ErrorView } from '@/components/ui/ErrorView'
import { LoadingView } from '@/components/ui/LoadingView'
import { DataCard } from '@/pages/SampleModal/containers/SampleA/components/DataCard'
import { sampleAType2QueryOptions } from '@/queries/sampleA'
import { useQuery } from '@tanstack/react-query'

export function SampleAType2Container() {
  const { data, isLoading, isError } = useQuery(sampleAType2QueryOptions)

  if (isLoading) return <LoadingView />
  if (isError) return <ErrorView />

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{data?.result.title}</h1>
      <ul className="mt-4 space-y-2">
        {data?.result.items.map((item) => (
          <li key={item.label}>
            <DataCard label={item.label} value={item.count} />
          </li>
        ))}
      </ul>
    </div>
  )
}
