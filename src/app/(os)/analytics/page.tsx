// src/app/(os)/analytics/page.tsx
'use client'

import { useState } from 'react'
import {
    Download,
    FileText,
    TrendingUp,
    Users,
    Eye,
    DollarSign,
    ArrowUpRight,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/shell/Avatar'
import { BarChart } from '@/components/analytics/BarChart'
import { DonutChart } from '@/components/analytics/DonutChart'
import { DateRangePicker } from '@/components/form/date-range-picker'
import {
    mockMonthlyPerformance,
    mockPlatformShare,
    mockTopCreators,
    mockRecentReports,
} from '@/lib/mock-data/analytics'

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'KES',
        maximumFractionDigits: 0,
    }).format(amount)
}

export default function AnalyticsPage() {
    const [isDateRangeOpen, setIsDateRangeOpen] = useState(false)
    const [dateRange, setDateRange] = useState({
        start: '2024-05-01',
        end: '2024-10-31',
    })

    // Updated to match BarChart's strict type: { month: string, spend: number }[]
    const chartData = mockMonthlyPerformance.map((m) => ({
        month: m.month,
        spend: m.spend,
    }))

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-im-pink/10 px-2.5 py-1 text-[11px] font-medium text-im-pink">
                        <span className="size-1.5 rounded-full bg-im-pink" />
                        Intelligence
                    </span>
                    <h1 className="mt-3 text-[34px] leading-none font-semibold tracking-tight">
                        Analytics & Reports
                    </h1>
                    <p className="mt-3 text-[14px] text-im-muted">
                        Track campaign ROI, creator performance, and overall
                        platform growth.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsDateRangeOpen(true)}
                        className="im-card flex h-12 items-center gap-2 rounded-2xl px-4 text-[13px] font-medium text-im-ink hover:bg-black/5"
                    >
                        {new Date(dateRange.start).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                        })}{' '}
                        -{' '}
                        {new Date(dateRange.end).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                        })}
                    </button>
                    <Button variant="primary" className="gap-2">
                        <Download className="size-4" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Summary Metrics */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    icon={DollarSign}
                    label="Total Spend"
                    value={formatCurrency(1215000)}
                    trend="+12%"
                />
                <MetricCard
                    icon={Eye}
                    label="Total Impressions"
                    value="4.4M"
                    trend="+28%"
                />
                <MetricCard
                    icon={TrendingUp}
                    label="Avg. Engagement"
                    value="4.8%"
                    trend="+0.6%"
                />
                <MetricCard
                    icon={Users}
                    label="Active Creators"
                    value="42"
                    trend="+5"
                />
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Bar Chart */}
                <Card padding="md" className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h3 className="text-[15px] font-semibold text-im-ink">
                                Campaign Spend
                            </h3>
                            <p className="text-[12px] text-im-muted">
                                Monthly budget utilization
                            </p>
                        </div>
                        <span className="text-[12px] font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                            On Track
                        </span>
                    </div>
                    <BarChart data={chartData} />
                </Card>

                {/* Donut Chart */}
                <Card padding="md">
                    <div className="mb-4">
                        <h3 className="text-[15px] font-semibold text-im-ink">
                            Platform Split
                        </h3>
                        <p className="text-[12px] text-im-muted">
                            Audience reach by platform
                        </p>
                    </div>
                    <div className="flex justify-center">
                        <DonutChart data={mockPlatformShare} />
                    </div>
                    <div className="mt-6 space-y-2">
                        {mockPlatformShare.map((p) => (
                            <div
                                key={p.platform}
                                className="flex items-center justify-between text-[13px]"
                            >
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`size-2 rounded-full ${p.color}`}
                                    />
                                    <span className="text-im-ink font-medium">
                                        {p.platform}
                                    </span>
                                </div>
                                <span className="text-im-muted">
                                    {p.percentage}%
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Bottom Row */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Top Creators */}
                <Card padding="md">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[15px] font-semibold text-im-ink">
                            Top Performing Creators
                        </h3>
                        <button className="text-[12px] font-medium text-im-violet hover:underline">
                            View all
                        </button>
                    </div>
                    <div className="space-y-3">
                        {mockTopCreators.map((creator) => (
                            <div
                                key={creator.id}
                                className="flex items-center justify-between p-3 rounded-xl hover:bg-im-surface transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar
                                        initials={creator.initials}
                                        className="size-9 text-xs"
                                    />
                                    <div>
                                        <p className="text-[13px] font-semibold text-im-ink">
                                            {creator.name}
                                        </p>
                                        <p className="text-[11px] text-im-muted">
                                            {creator.campaign}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[13px] font-semibold text-im-ink">
                                        {creator.roi}% ROI
                                    </p>
                                    <p className="text-[11px] text-im-muted">
                                        {creator.engagement}% Eng.
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Recent Reports */}
                <Card padding="md">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[15px] font-semibold text-im-ink">
                            Recent Reports
                        </h3>
                        <button className="text-[12px] font-medium text-im-violet hover:underline">
                            View all
                        </button>
                    </div>
                    <div className="space-y-2">
                        {mockRecentReports.map((report) => (
                            <div
                                key={report.id}
                                className="flex items-center justify-between p-3 rounded-xl hover:bg-im-surface transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="grid size-9 place-items-center rounded-lg bg-im-surface text-im-violet">
                                        <FileText
                                            className="size-4"
                                            strokeWidth={1.75}
                                        />
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-medium text-im-ink truncate max-w-[200px]">
                                            {report.title}
                                        </p>
                                        <p className="text-[11px] text-im-muted">
                                            {report.date} · {report.size} ·{' '}
                                            {report.type}
                                        </p>
                                    </div>
                                </div>
                                <button className="grid size-8 place-items-center rounded-lg text-im-muted opacity-0 group-hover:opacity-100 hover:bg-white hover:text-im-ink transition-all">
                                    <Download className="size-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Date Range Picker Modal */}
            {isDateRangeOpen && (
                <DateRangePicker
                    value={dateRange}
                    onChange={(range) => {
                        setDateRange(range)
                        setIsDateRangeOpen(false)
                    }}
                    onClose={() => setIsDateRangeOpen(false)}
                />
            )}
        </div>
    )
}

function MetricCard({
    icon: Icon,
    label,
    value,
    trend,
}: {
    icon: React.ElementType
    label: string
    value: string
    trend: string
}) {
    return (
        <Card padding="md" className="flex flex-col justify-between">
            <div className="flex items-start justify-between">
                <div className="grid size-10 place-items-center rounded-xl bg-im-surface text-im-violet">
                    <Icon className="size-5" strokeWidth={1.75} />
                </div>
                <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600">
                    {trend} <ArrowUpRight className="size-3" />
                </span>
            </div>
            <div className="mt-4">
                <p className="text-[24px] font-semibold tracking-tight text-im-ink">
                    {value}
                </p>
                <p className="text-[13px] text-im-muted">{label}</p>
            </div>
        </Card>
    )
}
