// src/components/form/date-range-picker.tsx
'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type DateRange = {
    start: string
    end: string
}

type DateRangePickerProps = {
    value: DateRange
    onChange: (range: DateRange) => void
    onClose?: () => void
}

const MONTH_NAMES = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
]

const DAY_NAMES = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number): number {
    const day = new Date(year, month, 1).getDay()
    return day === 0 ? 6 : day - 1 // Monday start
}

function formatDate(dateStr: string): string {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}

function isSameDay(date1: string, date2: string): boolean {
    return date1 === date2
}

function isDateInRange(date: string, start: string, end: string): boolean {
    if (!start || !end) return false
    return date >= start && date <= end
}

function isBeforeToday(dateStr: string): boolean {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const date = new Date(dateStr)
    return date < today
}

function parseMonthInput(input: string): number | null {
    const monthNames = [
        'january',
        'february',
        'march',
        'april',
        'may',
        'june',
        'july',
        'august',
        'september',
        'october',
        'november',
        'december',
    ]
    const monthAbbrs = [
        'jan',
        'feb',
        'mar',
        'apr',
        'may',
        'jun',
        'jul',
        'aug',
        'sep',
        'oct',
        'nov',
        'dec',
    ]

    const lowerInput = input.toLowerCase().trim()

    const fullMonthIndex = monthNames.indexOf(lowerInput)
    if (fullMonthIndex !== -1) return fullMonthIndex

    const abbrIndex = monthAbbrs.findIndex((m) => lowerInput.startsWith(m))
    if (abbrIndex !== -1) return abbrIndex

    return null
}

export function DateRangePicker({
    value,
    onChange,
    onClose,
}: DateRangePickerProps) {
    const today = useMemo(() => {
        const date = new Date()
        date.setHours(0, 0, 0, 0)
        return date
    }, [])

    const todayStr = useMemo(() => today.toISOString().split('T')[0], [today])

    // Start with empty range (nothing selected)
    const [tempRange, setTempRange] = useState<DateRange>({
        start: '',
        end: '',
    })

    // Default view to current month
    const [currentMonth, setCurrentMonth] = useState(() => {
        return { year: today.getFullYear(), month: today.getMonth() }
    })

    const [hoverDate, setHoverDate] = useState<string | null>(null)
    const [inputValue, setInputValue] = useState({ start: '', end: '' })

    const nextMonth = () => {
        setCurrentMonth((prev) => {
            const newMonth = prev.month + 1
            return newMonth > 11
                ? { year: prev.year + 1, month: 0 }
                : { year: prev.year, month: newMonth }
        })
    }

    const prevMonth = () => {
        setCurrentMonth((prev) => {
            const newMonth = prev.month - 1
            return newMonth < 0
                ? { year: prev.year - 1, month: 11 }
                : { year: prev.year, month: newMonth }
        })
    }

    const handleDateClick = (date: string) => {
        if (isBeforeToday(date)) return // Don't allow past dates

        if (!tempRange.start || (tempRange.start && tempRange.end)) {
            // Start new selection
            setTempRange({ start: date, end: '' })
            setInputValue({ start: formatDate(date), end: '' })
        } else {
            // Complete selection
            if (date < tempRange.start) {
                setTempRange({ start: date, end: tempRange.start })
                setInputValue((prev) => ({
                    ...prev,
                    end: formatDate(tempRange.start),
                }))
            } else {
                setTempRange({ start: tempRange.start, end: date })
                setInputValue((prev) => ({ ...prev, end: formatDate(date) }))
            }
        }
    }

    const handleApply = () => {
        if (tempRange.start && tempRange.end) {
            onChange(tempRange)
        }
        onClose?.()
    }

    const handleCancel = () => {
        setTempRange({ start: '', end: '' })
        setInputValue({ start: '', end: '' })
        onClose?.()
    }

    const handleStartInputChange = (value: string) => {
        setInputValue((prev) => ({ ...prev, start: value }))

        // Try to parse as date
        const parsed = new Date(value)
        if (!isNaN(parsed.getTime())) {
            const dateStr = parsed.toISOString().split('T')[0]
            if (!isBeforeToday(dateStr)) {
                setTempRange((prev) => ({ ...prev, start: dateStr }))
            }
        }

        // Try to parse as month name
        const monthIndex = parseMonthInput(value)
        if (monthIndex !== null) {
            setCurrentMonth({ year: today.getFullYear(), month: monthIndex })
        }
    }

    const handleEndInputChange = (value: string) => {
        setInputValue((prev) => ({ ...prev, end: value }))

        // Try to parse as date
        const parsed = new Date(value)
        if (!isNaN(parsed.getTime())) {
            const dateStr = parsed.toISOString().split('T')[0]
            if (!isBeforeToday(dateStr)) {
                setTempRange((prev) => ({ ...prev, end: dateStr }))
            }
        }

        // Try to parse as month name
        const monthIndex = parseMonthInput(value)
        if (monthIndex !== null) {
            setCurrentMonth({ year: today.getFullYear(), month: monthIndex })
        }
    }

    const renderCalendar = (year: number, month: number) => {
        const daysInMonth = getDaysInMonth(year, month)
        const firstDay = getFirstDayOfMonth(year, month)
        const days: (string | null)[] = []

        for (let i = 0; i < firstDay; i++) {
            days.push(null)
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            days.push(dateStr)
        }

        return (
            <div className="flex-1 min-w-[240px]">
                <div className="flex items-center justify-between mb-4 px-2">
                    <h3 className="text-[14px] font-semibold text-im-ink">
                        {MONTH_NAMES[month]} {year}
                    </h3>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                    {DAY_NAMES.map((day) => (
                        <div
                            key={day}
                            className="text-center text-[11px] font-medium text-im-muted py-1"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {days.map((date, idx) => {
                        if (!date)
                            return (
                                <div
                                    key={`empty-${idx}`}
                                    className="aspect-square"
                                />
                            )

                        const isPast = isBeforeToday(date)
                        const isToday = isSameDay(date, todayStr)
                        const isStart = isSameDay(date, tempRange.start)
                        const isEnd = isSameDay(date, tempRange.end)
                        const isInRange = isDateInRange(
                            date,
                            tempRange.start,
                            tempRange.end,
                        )
                        const isHoveredInRange =
                            hoverDate &&
                            tempRange.start &&
                            !tempRange.end &&
                            ((date > tempRange.start && date <= hoverDate) ||
                                (date < tempRange.start && date >= hoverDate))

                        let buttonClass =
                            'aspect-square flex items-center justify-center rounded-lg text-[13px] font-medium transition-colors '

                        if (isPast) {
                            buttonClass += 'text-im-muted/40 cursor-not-allowed'
                        } else if (isStart || isEnd) {
                            buttonClass +=
                                'bg-im-violet text-white hover:bg-im-violet/90'
                        } else if (isInRange) {
                            buttonClass +=
                                'bg-im-violet/20 text-im-violet hover:bg-im-violet/30'
                        } else if (isHoveredInRange) {
                            buttonClass += 'bg-im-violet/10 text-im-violet'
                        } else if (isToday) {
                            buttonClass +=
                                'text-im-violet font-semibold border-2 border-im-violet/30'
                        } else {
                            buttonClass += 'text-im-ink hover:bg-im-surface'
                        }

                        return (
                            <button
                                key={date}
                                type="button"
                                onClick={() => !isPast && handleDateClick(date)}
                                onMouseEnter={() =>
                                    !isPast && setHoverDate(date)
                                }
                                onMouseLeave={() => setHoverDate(null)}
                                disabled={isPast}
                                className={buttonClass}
                            >
                                {parseInt(date.split('-')[2])}
                            </button>
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCancel}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 10 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10"
            >
                <Card padding="md" className="p-6 w-full max-w-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={prevMonth}
                            className="grid size-9 place-items-center rounded-xl hover:bg-im-surface transition-colors"
                        >
                            <ChevronLeft className="size-4 text-im-ink" />
                        </button>

                        <div className="flex items-center gap-4">
                            <span className="text-[14px] font-semibold text-im-ink">
                                {MONTH_NAMES[currentMonth.month]}{' '}
                                {currentMonth.year}
                            </span>
                            <span className="text-im-muted">→</span>
                            <span className="text-[14px] font-semibold text-im-ink">
                                {
                                    MONTH_NAMES[
                                        currentMonth.month === 11
                                            ? 0
                                            : currentMonth.month + 1
                                    ]
                                }
                                {currentMonth.month === 11
                                    ? currentMonth.year + 1
                                    : currentMonth.year}
                            </span>
                        </div>

                        <button
                            onClick={nextMonth}
                            className="grid size-9 place-items-center rounded-xl hover:bg-im-surface transition-colors"
                        >
                            <ChevronRight className="size-4 text-im-ink" />
                        </button>
                    </div>

                    <div className="flex gap-8 mb-6">
                        {renderCalendar(currentMonth.year, currentMonth.month)}
                        {renderCalendar(
                            currentMonth.month === 11
                                ? currentMonth.year + 1
                                : currentMonth.year,
                            currentMonth.month === 11
                                ? 0
                                : currentMonth.month + 1,
                        )}
                    </div>

                    {/* Manual Input Fields */}
                    <div className="flex items-center gap-3 mb-6 px-2">
                        <div className="flex-1">
                            <input
                                type="text"
                                value={inputValue.start || formatDate(todayStr)}
                                onChange={(e) =>
                                    handleStartInputChange(e.target.value)
                                }
                                placeholder="Start date"
                                className="w-full rounded-xl border border-black/10 bg-im-surface px-4 py-2.5 text-[14px] text-im-ink outline-none focus:ring-2 focus:ring-im-violet/20 placeholder:text-im-muted/70"
                            />
                        </div>
                        <span className="text-im-muted font-medium">−</span>
                        <div className="flex-1">
                            <input
                                type="text"
                                value={inputValue.end || formatDate(todayStr)}
                                onChange={(e) =>
                                    handleEndInputChange(e.target.value)
                                }
                                placeholder="End date"
                                className="w-full rounded-xl border border-black/10 bg-im-surface px-4 py-2.5 text-[14px] text-im-ink outline-none focus:ring-2 focus:ring-im-violet/20 placeholder:text-im-muted/70"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            variant="secondary"
                            onClick={handleCancel}
                            type="button"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleApply}
                            type="button"
                            disabled={!tempRange.start || !tempRange.end}
                        >
                            Apply Range
                        </Button>
                    </div>
                </Card>
            </motion.div>
        </div>
    )
}
