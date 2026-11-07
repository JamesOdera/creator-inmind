// src/components/analytics/DonutChart.tsx
'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import type { PlatformShare } from '@/lib/mock-data/analytics'

type DonutChartProps = {
    data: PlatformShare[]
    size?: number
}

// Custom type mirroring Recharts' payload structure for Pie charts
type CustomTooltipProps = {
    active?: boolean
    payload?: {
        value: number | string
        name: string
        color: string
        payload: PlatformShare // We know exactly what the original data object is!
    }[]
    label?: string
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
    if (active && payload && payload.length) {
        // Safely extract the original PlatformShare object
        const data = payload[0].payload

        return (
            <div className="rounded-xl border border-black/6 bg-white p-3 shadow-lg flex items-center gap-2">
                <span className={`size-2 rounded-full ${data.color}`} />
                <p className="text-[13px] font-medium text-im-ink">
                    {data.platform}:{' '}
                    <span className="text-im-muted">{data.percentage}%</span>
                </p>
            </div>
        )
    }
    return null
}

export function DonutChart({ data, size = 200 }: DonutChartProps) {
    return (
        <div className="relative" style={{ width: size, height: size }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius="65%"
                        outerRadius="100%"
                        paddingAngle={2}
                        dataKey="percentage"
                        strokeWidth={0}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.hexColor} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </ResponsiveContainer>

            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-[22px] font-semibold text-im-ink">100%</p>
                <p className="text-[10px] text-im-muted uppercase tracking-wider">
                    Total Reach
                </p>
            </div>
        </div>
    )
}
