'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Users, DollarSign, Search } from 'lucide-react'
import Link from 'next/link'
import { Avatar } from '@/components/shell/Avatar'
import { PlatformBadge } from '@/lib/platform'
import { listStatusConfig, type CreatorList } from '@/lib/mock-data/lists'
import { Pagination } from '@/components/ui/pagination'
import { useCreatorsStore } from '@/lib/store/creatorsStore'

function formatCurrency(amount: number, currency: string = 'KES') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
    }).format(amount)
}

export function ListDetailDrawer({
    list,
    onClose,
}: {
    list: CreatorList // <-- No longer nullable
    onClose: () => void
}) {
    // ALL HOOKS ARE UNCONDITIONALLY CALLED AT THE VERY TOP
    const allCreators = useCreatorsStore((state) => state.creators)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedPlatform, setSelectedPlatform] = useState<'All' | string>(
        'All',
    )
    const [currentPage, setCurrentPage] = useState(1)

    const pageSize = 5

    const creatorsInList = allCreators.filter((c) =>
        list.creatorIds.includes(c.id),
    )

    const filteredCreators = useMemo(() => {
        return creatorsInList.filter((c) => {
            const matchesSearch =
                c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.handle.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesPlatform =
                selectedPlatform === 'All' || c.platform === selectedPlatform
            return matchesSearch && matchesPlatform
        })
    }, [creatorsInList, searchQuery, selectedPlatform])

    const paginatedCreators = useMemo(() => {
        const start = (currentPage - 1) * pageSize
        return filteredCreators.slice(start, start + pageSize)
    }, [filteredCreators, currentPage, pageSize])

    const handleFilterChange = (action: () => void) => {
        action()
        setCurrentPage(1)
    }

    const platforms = ['All', 'Instagram', 'TikTok', 'YouTube', 'X']

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-[#f4f4f7] shadow-2xl flex flex-col"
            >
                {/* Drawer Header */}
                <div className="flex items-start justify-between border-b border-black/6 bg-white px-6 py-4">
                    <div className="flex-1 min-w-0 mr-4">
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-[18px] font-semibold text-im-ink truncate">
                                {list.name}
                            </h2>
                            <span
                                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${listStatusConfig[list.status].cls}`}
                            >
                                {listStatusConfig[list.status].label}
                            </span>
                        </div>
                        <p className="text-[13px] text-im-muted line-clamp-2">
                            {list.description}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="grid size-9 shrink-0 place-items-center rounded-xl hover:bg-black/5"
                    >
                        <X className="size-5 text-im-muted" />
                    </button>
                </div>

                {/* Drawer Body */}
                <div className="flex-1 overflow-y-auto im-scroll p-6">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="im-card rounded-xl p-4 flex items-center gap-3">
                            <div className="grid size-10 place-items-center rounded-lg bg-im-surface text-im-violet">
                                <Users className="size-5" />
                            </div>
                            <div>
                                <p className="text-[12px] text-im-muted">
                                    Creators
                                </p>
                                <p className="text-[16px] font-semibold text-im-ink">
                                    {creatorsInList.length}
                                </p>
                            </div>
                        </div>
                        <div className="im-card rounded-xl p-4 flex items-center gap-3">
                            <div className="grid size-10 place-items-center rounded-lg bg-im-surface text-im-violet">
                                <DollarSign className="size-5" />
                            </div>
                            <div>
                                <p className="text-[12px] text-im-muted">
                                    Est. Budget
                                </p>
                                <p className="text-[16px] font-semibold text-im-ink">
                                    {formatCurrency(
                                        list.estimatedBudget,
                                        list.currency,
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="space-y-3 mb-4">
                        <label className="im-card flex h-11 items-center gap-2 rounded-xl px-3">
                            <Search className="size-4 text-im-muted shrink-0" />
                            <input
                                value={searchQuery}
                                onChange={(e) =>
                                    handleFilterChange(() =>
                                        setSearchQuery(e.target.value),
                                    )
                                }
                                placeholder="Search creators in this list..."
                                className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-im-muted/70"
                            />
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {platforms.map((p) => (
                                <button
                                    key={p}
                                    onClick={() =>
                                        handleFilterChange(() =>
                                            setSelectedPlatform(p),
                                        )
                                    }
                                    className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
                                        selectedPlatform === p
                                            ? 'bg-im-ink text-white'
                                            : 'border border-black/8 bg-white text-im-ink hover:bg-black/2'
                                    }`}
                                >
                                    {p === 'All' ? 'All Platforms' : p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <h3 className="text-[15px] font-semibold text-im-ink mb-3">
                        {filteredCreators.length} Creator
                        {filteredCreators.length !== 1 ? 's' : ''} Found
                    </h3>

                    {filteredCreators.length === 0 ? (
                        <div className="text-center py-8 text-[13px] text-im-muted im-card rounded-xl">
                            No creators match your search or filters.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {paginatedCreators.map((creator) => (
                                <Link
                                    key={creator.id}
                                    href={`/creators/${creator.id}`}
                                    className="block im-card rounded-xl p-4 hover:bg-white hover:shadow-md transition-all group"
                                    onClick={onClose}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <Avatar
                                                initials={
                                                    creator.avatarInitials
                                                }
                                                src={creator.avatarUrl}
                                                className="size-10 text-xs shrink-0"
                                            />
                                            <div className="min-w-0">
                                                <p className="text-[14px] font-semibold text-im-ink group-hover:text-im-violet transition-colors truncate">
                                                    {creator.name}
                                                </p>
                                                <p className="text-[12px] text-im-muted truncate">
                                                    {creator.handle}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <PlatformBadge
                                                platform={creator.platform}
                                            />
                                            <div className="text-right hidden sm:block">
                                                <p className="text-[13px] font-semibold text-im-ink">
                                                    {(
                                                        creator.followers / 1000
                                                    ).toFixed(1)}
                                                    k
                                                </p>
                                                <p className="text-[11px] text-im-muted">
                                                    Followers
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Drawer Pagination */}
                    {filteredCreators.length > pageSize && (
                        <div className="mt-6">
                            <Pagination
                                currentPage={currentPage}
                                totalItems={filteredCreators.length}
                                pageSize={pageSize}
                                onPageChange={setCurrentPage}
                                onPageSizeChange={() => {}}
                            />
                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
