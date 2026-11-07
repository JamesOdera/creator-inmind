// src/lib/mock-data/analytics.ts
export type MonthlyPerformance = {
    month: string
    spend: number
    impressions: number
    engagement: number
}

export type PlatformShare = {
    platform: string
    percentage: number
    color: string // Tailwind class for the legend
    hexColor: string // Hex color for Recharts
}

export type TopCreator = {
    id: string
    name: string
    initials: string
    campaign: string
    roi: number
    engagement: number
}

export type RecentReport = {
    id: string
    title: string
    date: string
    type: 'PDF' | 'CSV'
    size: string
}

export const mockMonthlyPerformance: MonthlyPerformance[] = [
    { month: 'May', spend: 120000, impressions: 450000, engagement: 4.2 },
    { month: 'Jun', spend: 185000, impressions: 620000, engagement: 4.8 },
    { month: 'Jul', spend: 150000, impressions: 510000, engagement: 4.5 },
    { month: 'Aug', spend: 240000, impressions: 890000, engagement: 5.1 },
    { month: 'Sep', spend: 210000, impressions: 760000, engagement: 4.9 },
    { month: 'Oct', spend: 310000, impressions: 1200000, engagement: 5.6 },
]

export const mockPlatformShare: PlatformShare[] = [
    {
        platform: 'Instagram',
        percentage: 45,
        color: 'bg-pink-500',
        hexColor: '#ec4899',
    },
    {
        platform: 'TikTok',
        percentage: 30,
        color: 'bg-im-ink',
        hexColor: '#0a0a0b',
    },
    {
        platform: 'YouTube',
        percentage: 15,
        color: 'bg-rose-500',
        hexColor: '#f43f5e',
    },
    {
        platform: 'X',
        percentage: 10,
        color: 'bg-im-muted',
        hexColor: '#6e6e78',
    },
]

export const mockTopCreators: TopCreator[] = [
    {
        id: 'c1',
        name: 'Amina Wanjiku',
        initials: 'AW',
        campaign: 'Njeve Season',
        roi: 320,
        engagement: 6.8,
    },
    {
        id: 'c3',
        name: 'Zara Mensah',
        initials: 'ZM',
        campaign: 'Afro-Modern Fashion',
        roi: 285,
        engagement: 8.1,
    },
    {
        id: 'c5',
        name: 'Naledi Mokoena',
        initials: 'NM',
        campaign: 'Summer Fitness',
        roi: 240,
        engagement: 7.3,
    },
    {
        id: 'c9',
        name: 'Fatima Diallo',
        initials: 'FD',
        campaign: 'Lagos Style Hub',
        roi: 210,
        engagement: 9.1,
    },
]

export const mockRecentReports: RecentReport[] = [
    {
        id: 'r1',
        title: 'Q3 2024 Campaign Performance',
        date: 'Oct 10, 2024',
        type: 'PDF',
        size: '2.4 MB',
    },
    {
        id: 'r2',
        title: 'Creator ROI Analysis - September',
        date: 'Oct 02, 2024',
        type: 'CSV',
        size: '145 KB',
    },
    {
        id: 'r3',
        title: 'Platform Demographics Report',
        date: 'Sep 28, 2024',
        type: 'PDF',
        size: '4.1 MB',
    },
    {
        id: 'r4',
        title: 'Monthly Spend & Budget Tracking',
        date: 'Sep 15, 2024',
        type: 'CSV',
        size: '89 KB',
    },
]
