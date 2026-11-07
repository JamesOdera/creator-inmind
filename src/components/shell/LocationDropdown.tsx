// src/components/shell/LocationDropdown.tsx
import { Check } from 'lucide-react'
import { DropdownHeader, DropdownDivider } from '@/components/ui/dropdown'

const locations = [
    { code: 'KES', city: 'Nairobi', country: 'Kenya', active: true },
    { code: 'USD', city: 'New York', country: 'USA', active: false },
    { code: 'GBP', city: 'London', country: 'UK', active: false },
    { code: 'EUR', city: 'Berlin', country: 'Germany', active: false },
]

export function LocationDropdownContent() {
    return (
        <>
            <DropdownHeader title="Currency & Region" />
            <DropdownDivider />
            <div className="space-y-1">
                {locations.map((loc) => (
                    <button
                        key={loc.code}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-colors ${
                            loc.active
                                ? 'bg-im-violet/10 text-im-violet'
                                : 'text-im-ink hover:bg-im-surface'
                        }`}
                    >
                        <div>
                            <p className="text-[13px] font-medium">
                                {loc.code} · {loc.city}
                            </p>
                            <p className="text-[11px] text-im-muted">
                                {loc.country}
                            </p>
                        </div>
                        {loc.active && <Check className="size-4" />}
                    </button>
                ))}
            </div>
        </>
    )
}
