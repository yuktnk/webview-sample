import { ErrorView } from '@/components/ui/ErrorView'
import { LoadingView } from '@/components/ui/LoadingView'
import { sampleBType1QueryOptions } from '@/queries/sampleB'
import { useQuery } from '@tanstack/react-query'

export function SampleBType1Container() {
  const { data, isLoading, isError } = useQuery(sampleBType1QueryOptions)

  if (isLoading) return <LoadingView />
  if (isError) return <ErrorView />

  return (
    <div className="p-1">
      <h1 className="text-2xl font-bold">{data?.result.name}</h1>
      <p className="mt-2">ステータス: {data?.result.status}</p>
      <p className="mt-1 text-xl">スコア: {data?.result.score}</p>
    </div>
  )
}
