import { useQuery } from '@tanstack/react-query'
import { ErrorView } from '../../../../../components/ui/ErrorView'
import { LoadingView } from '../../../../../components/ui/LoadingView'
import { sampleAType1QueryOptions } from '../../../../../queries/sampleA'
import { formatDate } from '../../../../../utils/formatDate'

export function SampleAType1Container() {
  const { data, isLoading, isError } = useQuery(sampleAType1QueryOptions)

  if (isLoading) return <LoadingView />
  if (isError) return <ErrorView />

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{data?.result.title}</h1>
      <p className="text-lg mt-2">値: {data?.result.value}</p>
      <p className="text-sm text-gray-500 mt-1">
        日付: {data?.result.date ? formatDate(data.result.date) : ''}
      </p>
    </div>
  )
}
