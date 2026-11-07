// src/components/form/date-input.tsx
'use client'

import { Calendar } from 'lucide-react'

type DateInputProps = {
    label?: string
    value: string
    onChange: (value: string) => void
    className?: string
    min?: string
    max?: string
}

export function DateInput({
    label,
    value,
    onChange,
    className,
    min,
    max,
}: DateInputProps) {
    return (
        <div className={className}>
            {label && (
                <label className="block text-[13px] font-medium text-im-ink mb-1.5">
                    {label}
                </label>
            )}
            <div className="relative">
                {/* 
                    [color-scheme:light] ensures the native date picker popup 
                    remains light-themed even if the user's OS is in dark mode.
                    pl-11 makes room for our custom calendar icon on the left.
                */}
                <input
                    type="date"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    min={min}
                    max={max}
                    className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 pl-11 text-[14px] text-im-ink outline-none transition-colors focus:ring-2 focus:ring-im-violet/20 [color-scheme:light]"
                />
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-im-muted pointer-events-none" />
            </div>
        </div>
    )
}
