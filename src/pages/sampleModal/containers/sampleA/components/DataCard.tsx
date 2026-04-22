import { cn } from '@/utils/cn'

type Props = {
  label: string
  value: string | number
  className?: string
}

/**
 * SampleA (Type1・Type2) で使うデータ表示カード
 *
 * Type1ではタイトル・値を表示
 * Type2ではリストの各アイテムに使う
 */
export function DataCard({ label, value, className }: Props) {
  return (
    <div className={cn('flex justify-between border-b pb-2', className)}>
      <span className="text-gray-700">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}
