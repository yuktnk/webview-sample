import { cn } from '@/utils/cn'

type Props = React.ComponentProps<'button'>

export function Button({ type = 'button', children, className, ...props }: Props) {
  return (
    <button type={type} className={cn(className)} {...props}>
      {children}
    </button>
  )
}
