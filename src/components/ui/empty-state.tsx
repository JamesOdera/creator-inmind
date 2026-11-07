import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Card } from './card'
import { Reveal } from './reveal'

type Variant = 'page' | 'card' | 'inline'

const spacing: Record<Variant, string> = {
    page: 'py-16',
    card: 'py-12',
    inline: 'py-6',
}

const pageMinHeight = 'min-h-[min(520px,calc(100dvh_-_220px))]'

export function StateIllustration({
    icon: Icon,
    size = 64,
}: {
    icon: LucideIcon
    size?: number
}) {
    return (
        <div
            aria-hidden
            className="relative flex items-center justify-center"
            style={{ width: size * 2, height: size * 2 }}
        >
            {[0, 1, 2].map((i) => (
                <span
                    key={i}
                    className="im-ring absolute rounded-full border border-im-ink/15"
                    style={{
                        width: size,
                        height: size,
                        animationDelay: `${i * 1.05}s`,
                    }}
                />
            ))}
            <span
                className="relative flex items-center justify-center rounded-3xl bg-im-ink text-white shadow-[0_12px_32px_rgba(10,10,11,0.2)]"
                style={{ width: size, height: size }}
            >
                <Icon
                    style={{ width: size * 0.4, height: size * 0.4 }}
                    strokeWidth={1.75}
                />
            </span>
        </div>
    )
}

/** Full-width centered shell shared by EmptyState and ErrorState. */
export function StatePanel({
    variant = 'page',
    fill,
    children,
    className,
}: {
    variant?: Variant
    /** Stretch to the full height of the parent (parent must have a height) */
    fill?: boolean
    children: ReactNode
    className?: string
}) {
    const body = (
        <Reveal
            className={cn(
                'flex w-full flex-col items-center justify-center px-6 text-center',
                spacing[variant],
                variant === 'page' && !fill && pageMinHeight,
                fill && 'h-full',
                className,
            )}
        >
            {children}
        </Reveal>
    )

    return variant === 'page' ? (
        <Card padding="none" className={cn('w-full', fill && 'h-full')}>
            {body}
        </Card>
    ) : (
        body
    )
}

export type EmptyStateProps = {
    icon: LucideIcon
    title: string
    description?: string
    action?: ReactNode
    secondaryAction?: ReactNode
    /** page: fills the page in a card · card: fills the card it sits in · inline: compact */
    variant?: Variant
    /** Fill the full height of the parent instead of a minimum height */
    fill?: boolean
    className?: string
}

export function EmptyState({
    icon,
    title,
    description,
    action,
    secondaryAction,
    variant = 'page',
    fill,
    className,
}: EmptyStateProps) {
    return (
        <StatePanel variant={variant} fill={fill} className={className}>
            <StateIllustration icon={icon} size={variant === 'inline' ? 44 : 64} />
            <h3 className="-mt-2 text-[18px] font-medium text-im-ink">{title}</h3>
            {description && (
                <p className="mt-2 max-w-105 text-[13.5px] leading-relaxed text-im-muted">
                    {description}
                </p>
            )}
            {(action || secondaryAction) && (
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                    {action}
                    {secondaryAction}
                </div>
            )}
        </StatePanel>
    )
}
