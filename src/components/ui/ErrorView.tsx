import { cn } from '@/utils/cn'

type Props = { className?: string; message?: string }

export function ErrorView({ className, message = 'エラーが発生しました' }: Props) {
  return <div className={cn('p-4 text-error-500', className)}>{message}</div>
}
