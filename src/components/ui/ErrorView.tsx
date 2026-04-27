import { cn } from '@/utils/cn'

type Props = { className?: string; message?: string; error?: Error }

export function ErrorView({ className, message = 'エラーが発生しました', error }: Props) {
  return <div className={cn('p-4 text-error-500', className)}>{error?.message ?? message}</div>
}
