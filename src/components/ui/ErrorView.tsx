import { cn } from '@/utils/cn'

type Props = { className?: string }

export function ErrorView({ className }: Props) {
  return <div className={cn('p-4 text-red-500', className)}>エラーが発生しました</div>
}
