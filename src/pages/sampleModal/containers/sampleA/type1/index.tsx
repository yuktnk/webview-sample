import { ErrorView } from '@/components/ui/ErrorView'
import { LoadingView } from '@/components/ui/LoadingView'
import { DataCard } from '@/pages/sampleModal/containers/sampleA/components/DataCard'
import { sampleAType1QueryOptions } from '@/queries/sampleA'
import { formatDate } from '@/utils/formatDate'
import { useQuery } from '@tanstack/react-query'

export function SampleAType1Container() {
  const { data, isLoading, isError } = useQuery(sampleAType1QueryOptions)

  if (isLoading) return <LoadingView />
  if (isError) return <ErrorView />

  return (
    <div className="p-1">
      <h1 className="text-2xl font-bold">{data?.result.title}</h1>
      <div className="mt-1 space-y-1">
        <DataCard label="値" value={data?.result.value ?? 0} />
        <DataCard
          label="日付"
          value={data?.result.date ? formatDate(data.result.date) : 'N/A'}
        />
      </div>
    </div>
  )
}
