'use client'

import { BadgeCheck, MapPin, Users, Eye } from 'lucide-react'
import type { Creator } from '@/lib/mock-data/types'
import { PlatformBadge } from '@/lib/platform'
import { Avatar } from '@/components/shell/Avatar'
import Link from 'next/link'
import { AddToListDropdown } from './AddToListDropdown'

const statusStyles = {
    Available: 'bg-emerald-50 text-emerald-700',
    Busy: 'bg-amber-50 text-amber-700',
    Contracted: 'bg-im-ink/5 text-im-muted',
}

function formatNumber(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
    return n.toString()
}

export function CreatorCard({
    creator,
    view = 'grid',
}: {
    creator: Creator
    view?: 'grid' | 'list'
}) {
    if (view === 'list') {
        return (
            <div className="im-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl p-4">
                <Link
                    href={`/creators/${creator.id}`}
                    className="flex items-center gap-3 group/name"
                >
                    <Avatar
                        initials={creator.avatarInitials}
                        src={creator.avatarUrl}
                        className="size-11 text-sm transition-transform group-hover/name:scale-105"
                    />
                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                            <p className="truncate text-[14px] font-semibold text-im-ink group-hover/name:text-im-violet transition-colors">
                                {creator.name}
                            </p>
                            {creator.verified && (
                                <BadgeCheck
                                    className="size-4 shrink-0 text-im-violet"
                                    strokeWidth={2}
                                />
                            )}
                        </div>
                        <p className="truncate text-[12px] text-im-muted">
                            {creator.handle}
                        </p>
                    </div>
                </Link>

                <div className="flex flex-wrap items-center gap-4 text-[12px] text-im-muted">
                    <PlatformBadge platform={creator.platform} />
                    <span className="flex items-center gap-1">
                        <Users className="size-3.5" />
                        {formatNumber(creator.followers)}
                    </span>
                    <span className="flex items-center gap-1">
                        <Eye className="size-3.5" />
                        {formatNumber(creator.avgViews)}
                    </span>
                    <span className="hidden md:inline">
                        {creator.engagementRate}% eng.
                    </span>
                    <span className="hidden md:flex items-center gap-1">
                        <MapPin className="size-3.5" />
                        {creator.location}
                    </span>
                    <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${statusStyles[creator.status]}`}
                    >
                        {creator.status}
                    </span>
                    <AddToListDropdown
                        creatorId={creator.id}
                        creatorName={creator.name}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="im-card group flex flex-col rounded-3xl p-5 transition-shadow hover:shadow-[0_14px_34px_-14px_rgba(10,10,11,0.12)]">
            <div className="flex items-start justify-between">
                <Link
                    href={`/creators/${creator.id}`}
                    className="flex items-center gap-3 group/name"
                >
                    <Avatar
                        initials={creator.avatarInitials}
                        src={creator.avatarUrl}
                        className="size-11 text-sm transition-transform group-hover/name:scale-105"
                    />
                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                            <p className="truncate text-[14px] font-semibold text-im-ink group-hover/name:text-im-violet transition-colors">
                                {creator.name}
                            </p>
                            {creator.verified && (
                                <BadgeCheck
                                    className="size-4 shrink-0 text-im-violet"
                                    strokeWidth={2}
                                />
                            )}
                        </div>
                        <p className="truncate text-[12px] text-im-muted">
                            {creator.handle}
                        </p>
                    </div>
                </Link>
                <PlatformBadge platform={creator.platform} />
            </div>
            <p className="mt-4 line-clamp-2 text-[12.5px] leading-relaxed text-im-muted">
                {creator.bio}
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-im-surface/60 p-3">
                <div>
                    <p className="text-[13px] font-semibold text-im-ink">
                        {formatNumber(creator.followers)}
                    </p>
                    <p className="text-[10.5px] text-im-muted">Followers</p>
                </div>
                <div>
                    <p className="text-[13px] font-semibold text-im-ink">
                        {creator.engagementRate}%
                    </p>
                    <p className="text-[10.5px] text-im-muted">Engagement</p>
                </div>
                <div>
                    <p className="text-[13px] font-semibold text-im-ink">
                        {formatNumber(creator.avgViews)}
                    </p>
                    <p className="text-[10.5px] text-im-muted">Avg. views</p>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11.5px] text-im-muted">
                    <MapPin className="size-3.5" />
                    <span>
                        {creator.location}, {creator.country}
                    </span>
                </div>
                <span
                    className={`rounded-full px-2 py-0.5 text-[10.5px] font-medium ${statusStyles[creator.status]}`}
                >
                    {creator.status}
                </span>
            </div>

            <AddToListDropdown
                creatorId={creator.id}
                creatorName={creator.name}
            />
        </div>
    )
}
