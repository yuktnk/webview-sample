import { useQuery } from '@tanstack/react-query'
import { sampleAType2QueryOptions } from '../../../../../queries/sampleA'
import { LoadingView } from '../../../../../components/ui/LoadingView'
import { ErrorView } from '../../../../../components/ui/ErrorView'

export const SampleAType2Container = () => {
  const { data, isLoading, isError } = useQuery(sampleAType2QueryOptions)

  if (isLoading) return <LoadingView />
  if (isError) return <ErrorView />

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{data?.result.title}</h1>
      <ul className="mt-4 space-y-2">
        {data?.result.items.map((item) => (
          <li key={item.label} className="flex justify-between border-b pb-1">
            <span>{item.label}</span>
            <span className="font-bold">{item.count}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
