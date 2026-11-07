import { cn } from '@/lib/cn'

export function Skeleton({ className }: { className?: string }) {
    return (
        <div aria-hidden className={cn('im-skeleton rounded-xl', className)} />
    )
}
