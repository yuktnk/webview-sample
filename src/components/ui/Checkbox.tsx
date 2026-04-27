import { cn } from '@/utils/cn'

type Props = Omit<React.ComponentProps<'input'>, 'type'>

export function Checkbox({ className, ...props }: Props) {
  return <input type="checkbox" className={cn(className)} {...props} />
}
