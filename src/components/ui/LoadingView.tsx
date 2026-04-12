import { cn } from '@/utils/cn'

type Props = { className?: string }

export function LoadingView({ className }: Props) {
  return <div className={cn('p-4 text-gray-500', className)}>Loading...</div>
}
