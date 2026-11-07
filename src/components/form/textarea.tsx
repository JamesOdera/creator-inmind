// src/components/form/textarea.tsx
'use client'

import { forwardRef } from 'react'

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string
    error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, className, ...props }, ref) => {
        return (
            <div className={className}>
                {label && (
                    <label className="block text-[13px] font-medium text-im-ink mb-1.5">
                        {label}{' '}
                        {props.required && (
                            <span className="text-rose-500">*</span>
                        )}
                    </label>
                )}
                <textarea
                    ref={ref}
                    className={`w-full rounded-xl border bg-white px-4 py-2.5 text-[14px] text-im-ink outline-none transition-colors placeholder:text-im-muted/70 focus:ring-2 focus:ring-im-violet/20 resize-none ${
                        error
                            ? 'border-rose-200 focus:ring-rose-200'
                            : 'border-black/10'
                    }`}
                    {...props}
                />
                {error && (
                    <p className="mt-1.5 text-[12px] text-rose-500">{error}</p>
                )}
            </div>
        )
    },
)
Textarea.displayName = 'Textarea'
