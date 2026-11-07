// src/components/analytics/BarChart.tsx
'use client'

import {
    BarChart as RechartsBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'

type BarChartData = {
    month: string
    spend: number
}

type BarChartProps = {
    data: BarChartData[]
    height?: string
}

// Custom type that exactly matches what Recharts passes to the Tooltip
type CustomTooltipProps = {
    active?: boolean
    payload?: {
        value: number | string
        name: string
        payload: Record<string, unknown>
    }[]
    label?: string
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'KES',
        maximumFractionDigits: 0,
    })
        .format(value)
        .replace('KES', 'KES ')
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
    if (active && payload && payload.length) {
        const data = payload[0]
        // Safely extract the number value
        const numericValue = typeof data.value === 'number' ? data.value : 0

        return (
            <div className="rounded-xl border border-black/6 bg-white p-3 shadow-lg">
                <p className="text-[12px] font-medium text-im-muted mb-1">
                    {label}
                </p>
                <p className="text-[14px] font-semibold text-im-ink">
                    {formatCurrency(numericValue)}
                </p>
            </div>
        )
    }
    return null
}

export function BarChart({ data, height = 'h-64' }: BarChartProps) {
    return (
        <div className={`w-full ${height}`}>
            <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                    data={data}
                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e5e5e5"
                    />
                    <XAxis
                        dataKey="month"
                        tick={{
                            fill: '#6e6e78',
                            fontSize: 12,
                            fontWeight: 500,
                        }}
                        axisLine={false}
                        tickLine={false}
                        dy={10}
                    />
                    <YAxis
                        tick={{ fill: '#6e6e78', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => `${value / 1000}k`}
                    />
                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'rgba(139, 92, 246, 0.05)' }}
                    />
                    <Bar
                        dataKey="spend"
                        fill="#8b5cf6"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={40}
                    />
                </RechartsBarChart>
            </ResponsiveContainer>
        </div>
    )
}
