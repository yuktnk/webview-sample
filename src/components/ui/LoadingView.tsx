import { cn } from '@/utils/cn'

type Props = { className?: string }

export function LoadingView({ className }: Props) {
  return <div className={cn('p-4 text-neutral-500', className)}>Loading...</div>
}
