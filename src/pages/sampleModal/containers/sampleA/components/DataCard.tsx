import { cn } from '@/utils/cn'

type Props = {
  label: string
  value: string | number
  className?: string
}

export function DataCard({ label, value, className }: Props) {
  return (
    <div className={cn('flex justify-between border-b pb-2', className)}>
      <span className="text-neutral-700">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}
