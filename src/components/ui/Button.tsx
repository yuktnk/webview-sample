import { cn } from '@/utils/cn'

type Props = React.ComponentProps<'button'>

export function Button({ type = 'button', children, className, ...props }: Props) {
  return (
    <button type={type} className={cn('cursor-pointer disabled:opacity-50', className)} {...props}>
      {children}
    </button>
  )
}
