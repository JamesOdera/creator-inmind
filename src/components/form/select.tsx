// src/components/form/select.tsx
'use client'

import { Check, ChevronDown } from 'lucide-react'
import { Dropdown } from '@/components/ui/dropdown'

type SelectOption = {
    value: string
    label: string
}

type SelectProps = {
    label?: string
    options: SelectOption[]
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
}

export function Select({
    label,
    options,
    value,
    onChange,
    placeholder = 'Select an option',
    className,
}: SelectProps) {
    const selectedOption = options.find((opt) => opt.value === value)

    return (
        <div className={className}>
            {label && (
                <label className="block text-[13px] font-medium text-im-ink mb-1.5">
                    {label}
                </label>
            )}
            <Dropdown
                trigger={(isOpen) => (
                    <button
                        type="button"
                        className={`w-full flex items-center justify-between rounded-xl border border-black/10 bg-white px-4 py-2.5 text-[14px] text-left outline-none transition-colors focus:ring-2 focus:ring-im-violet/20 ${
                            isOpen ? 'ring-2 ring-im-violet/20' : ''
                        } ${!selectedOption ? 'text-im-muted' : 'text-im-ink'}`}
                    >
                        <span className="truncate">
                            {selectedOption
                                ? selectedOption.label
                                : placeholder}
                        </span>
                        <ChevronDown
                            className={`size-4 shrink-0 text-im-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        />
                    </button>
                )}
                width="w-full"
                align="left"
            >
                <div className="p-1 max-h-60 overflow-y-auto">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => onChange(opt.value)}
                            className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-[13px] font-medium transition-colors ${
                                value === opt.value
                                    ? 'bg-im-violet/10 text-im-violet'
                                    : 'text-im-ink hover:bg-im-surface'
                            }`}
                        >
                            <span className="truncate">{opt.label}</span>
                            {value === opt.value && (
                                <Check className="size-4 shrink-0" />
                            )}
                        </button>
                    ))}
                </div>
            </Dropdown>
        </div>
    )
}
