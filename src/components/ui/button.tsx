import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary'

/** Use on <Link> too: <Link className={buttonStyles('secondary')} /> */
export function buttonStyles(variant: Variant = 'primary', className?: string) {
    return cn(
        'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-colors',
        variant === 'primary'
            ? 'bg-im-ink text-white hover:opacity-90'
            : 'border border-black/8 bg-white hover:bg-black/2',
        className,
    )
}

export function Button({
    variant,
    className,
    type = 'button',
    ...props
}: ComponentPropsWithoutRef<'button'> & { variant?: Variant }) {
    return (
        <button
            type={type}
            className={buttonStyles(variant, className)}
            {...props}
        />
    )
}
