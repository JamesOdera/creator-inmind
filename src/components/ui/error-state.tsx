'use client'

import { RotateCw, TriangleAlert } from 'lucide-react'
import { Button } from './button'
import { StateIllustration, StatePanel } from './empty-state'

export function ErrorState({
    title = 'Something went wrong',
    description = "We couldn't load this page. Try again, and if it keeps happening let us know.",
    onRetry,
    digest,
    variant = 'page',
    fill,
}: {
    title?: string
    description?: string
    onRetry?: () => void
    digest?: string
    variant?: 'page' | 'card' | 'inline'
    fill?: boolean
}) {
    return (
        <StatePanel variant={variant} fill={fill}>
            <StateIllustration
                icon={TriangleAlert}
                size={variant === 'inline' ? 44 : 64}
            />
            <h3 className="-mt-2 text-[18px] font-medium text-im-ink">
                {title}
            </h3>
            <p className="mt-2 max-w-105 text-[13.5px] leading-relaxed text-im-muted">
                {description}
            </p>
            {onRetry && (
                <div className="mt-6">
                    <Button onClick={onRetry}>
                        <RotateCw className="size-3.5" />
                        Try again
                    </Button>
                </div>
            )}
            {digest && (
                <p className="mt-4 text-[11px] text-im-muted/70">
                    Error ID: {digest}
                </p>
            )}
        </StatePanel>
    )
}
