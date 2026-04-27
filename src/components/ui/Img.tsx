import { cn } from '@/utils/cn'

type Props = Omit<
  React.ComponentProps<'img'>,
  'alt' | 'width' | 'height' | 'loading' | 'decoding' | 'fetchPriority'
> & {
  alt: string
  width: number | string
  height: number | string
  priority?: boolean
}

export function Img({ alt, width, height, priority = false, className, ...props }: Props) {
  return (
    <img
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'auto' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      className={cn(className)}
      {...props}
    />
  )
}
