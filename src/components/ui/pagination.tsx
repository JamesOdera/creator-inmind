// src/components/ui/pagination.tsx
'use client'

import { useState } from 'react'
import {
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from 'lucide-react'
import { Dropdown } from '@/components/ui/dropdown'

type PaginationProps = {
    currentPage: number
    totalItems: number
    pageSize: number
    onPageChange: (page: number) => void
    onPageSizeChange: (size: number) => void
}

export function Pagination({
    currentPage,
    totalItems,
    pageSize,
    onPageChange,
    onPageSizeChange,
}: PaginationProps) {
    // 1. Hooks MUST be declared at the top level, before any early returns
    const totalPages = Math.ceil(totalItems / pageSize)
    const [goToValue, setGoToValue] = useState('')
    const [isEditing, setIsEditing] = useState(false)

    // 2. Early return AFTER hooks
    if (totalItems === 0) return null

    const startItem = (currentPage - 1) * pageSize + 1
    const endItem = Math.min(currentPage * pageSize, totalItems)

    const getPages = () => {
        const pages: (number | string)[] = []
        const maxVisible = 5

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i)
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages)
            } else if (currentPage >= totalPages - 2) {
                pages.push(
                    1,
                    '...',
                    totalPages - 3,
                    totalPages - 2,
                    totalPages - 1,
                    totalPages,
                )
            } else {
                pages.push(
                    1,
                    '...',
                    currentPage - 1,
                    currentPage,
                    currentPage + 1,
                    '...',
                    totalPages,
                )
            }
        }
        return pages
    }

    const handleGoToChange = (value: string) => {
        setGoToValue(value.replace(/\D/g, '')) // Only allow digits
    }

    const handleGoToSubmit = () => {
        const num = Number(goToValue)
        if (num >= 1 && num <= totalPages) {
            onPageChange(num)
        }
        setIsEditing(false)
        setGoToValue('') // Reset after submit
    }

    const btnBase =
        'grid size-10 place-items-center rounded-xl text-[13px] font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
    const btnNormal = 'im-card text-im-muted hover:bg-black/5 hover:text-im-ink'
    const btnActive = 'bg-im-ink text-white shadow-sm'

    return (
        <div className="mt-6 flex flex-col gap-4 border-t border-black/6 pt-5 sm:flex-row sm:items-center sm:justify-between">
            {/* Left: Info & Page Size */}
            <div className="flex flex-wrap items-center gap-4">
                <p className="text-[13px] text-im-muted">
                    Showing{' '}
                    <span className="font-semibold text-im-ink">
                        {startItem}
                    </span>{' '}
                    to{' '}
                    <span className="font-semibold text-im-ink">{endItem}</span>{' '}
                    of{' '}
                    <span className="font-semibold text-im-ink">
                        {totalItems}
                    </span>{' '}
                    results
                </p>

                {/* Custom Styled Page Size Dropdown (Opens UPWARDS) */}
                <Dropdown
                    position="top"
                    trigger={(isOpen) => (
                        <button
                            className={`im-card flex items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-medium text-im-ink transition-colors hover:bg-black/5 ${
                                isOpen ? 'ring-2 ring-im-violet/20' : ''
                            }`}
                        >
                            {pageSize} per page
                            <ChevronDown
                                className={`size-3.5 text-im-muted transition-transform duration-200 ${
                                    isOpen ? 'rotate-180' : ''
                                }`}
                            />
                        </button>
                    )}
                    width="w-40"
                    align="left"
                >
                    <div className="p-1">
                        {[10, 25, 50, 100].map((size) => (
                            <button
                                key={size}
                                onClick={() => {
                                    onPageSizeChange(size)
                                    onPageChange(1)
                                }}
                                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-[13px] font-medium transition-colors ${
                                    pageSize === size
                                        ? 'bg-im-violet/10 text-im-violet'
                                        : 'text-im-ink hover:bg-im-surface'
                                }`}
                            >
                                {size} per page
                                {pageSize === size && (
                                    <Check className="size-4" />
                                )}
                            </button>
                        ))}
                    </div>
                </Dropdown>
            </div>

            {/* Right: Pagination Controls */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className={`${btnBase} ${btnNormal}`}
                    aria-label="First page"
                >
                    <ChevronsLeft className="size-4" />
                </button>
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`${btnBase} ${btnNormal}`}
                    aria-label="Previous page"
                >
                    <ChevronLeft className="size-4" />
                </button>

                <div className="flex items-center gap-1">
                    {getPages().map((page, idx) =>
                        page === '...' ? (
                            <span
                                key={`ellipsis-${idx}`}
                                className="grid size-10 place-items-center text-[13px] text-im-muted"
                            >
                                ...
                            </span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => onPageChange(page as number)}
                                className={`${btnBase} ${
                                    currentPage === page ? btnActive : btnNormal
                                }`}
                            >
                                {page}
                            </button>
                        ),
                    )}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`${btnBase} ${btnNormal}`}
                    aria-label="Next page"
                >
                    <ChevronRight className="size-4" />
                </button>
                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`${btnBase} ${btnNormal}`}
                    aria-label="Last page"
                >
                    <ChevronsRight className="size-4" />
                </button>

                {/* Go to Page Input */}
                <div className="ml-2 flex items-center gap-2 border-l border-black/6 pl-3">
                    <span className="text-[13px] text-im-muted">Go to:</span>
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={isEditing ? goToValue : currentPage}
                        onFocus={() => {
                            setIsEditing(true)
                            setGoToValue(currentPage.toString())
                        }}
                        onChange={(e) => handleGoToChange(e.target.value)}
                        onBlur={handleGoToSubmit}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleGoToSubmit()
                            }
                        }}
                        className="im-card w-14 rounded-xl px-2 py-2 text-center text-[13px] font-medium text-im-ink outline-none focus:ring-2 focus:ring-im-violet/20"
                        aria-label="Jump to page"
                    />
                    <span className="text-[13px] text-im-muted">
                        of {totalPages}
                    </span>
                </div>
            </div>
        </div>
    )
}
