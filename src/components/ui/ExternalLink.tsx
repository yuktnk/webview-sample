import { cn } from '@/utils/cn'

type HttpUrl = `http://${string}` | `https://${string}`

type Props = Omit<React.ComponentProps<'a'>, 'href' | 'target' | 'rel'> & {
  href: HttpUrl
}

export function ExternalLink({ href, children, className, ...props }: Props) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cn(className)} {...props}>
      {children}
    </a>
  )
}
