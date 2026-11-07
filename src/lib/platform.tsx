// src/lib/platform.tsx
import {
    InstagramIcon,
    TikTokIcon,
    XIcon,
    YouTubeIcon,
} from '@/components/icons'
import type { Platform } from '@/lib/mock-data/types'

export const platformConfig: Record<
    Platform,
    { icon: React.ElementType; color: string; bg: string }
> = {
    Instagram: {
        icon: InstagramIcon,
        color: 'text-pink-600',
        bg: 'bg-pink-50',
    },
    TikTok: {
        icon: TikTokIcon,
        color: 'text-im-ink',
        bg: 'bg-im-surface',
    },
    YouTube: {
        icon: YouTubeIcon,
        color: 'text-rose-600',
        bg: 'bg-rose-50',
    },
    X: {
        icon: XIcon,
        color: 'text-im-ink', // XIcon uses fill="currentColor", so this applies perfectly
        bg: 'bg-im-surface',
    },
}

export function PlatformBadge({ platform }: { platform: Platform }) {
    const config = platformConfig[platform]
    const Icon = config.icon

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${config.bg} ${config.color}`}
        >
            {/* 
                size={12} matches Tailwind's `size-3` (12px). 
                Custom icons accept `size` and `className` via IconProps.
                Lucide icons will gracefully ignore `size` and use `className="size-3"`.
            */}
            <Icon className="size-3" size={12} />
            {platform}
        </span>
    )
}
