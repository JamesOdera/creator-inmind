// src/lib/mock-data/lists.ts
export type ListStatus = 'Draft' | 'Active' | 'Archived'

export type CreatorList = {
    id: string
    name: string
    description: string
    creatorIds: string[]
    estimatedBudget: number
    currency: string
    status: ListStatus
    createdAt: string
}

export const mockLists: CreatorList[] = [
    {
        id: 'list1',
        name: 'Q4 Fashion Campaign',
        description:
            'Top tier fashion and lifestyle creators for the holiday season push.',
        creatorIds: ['c3', 'c9', 'c1', 'c7'],
        estimatedBudget: 850000,
        currency: 'KES',
        status: 'Active',
        createdAt: '2024-09-15',
    },
    {
        id: 'list2',
        name: 'Tech Micro-Influencers',
        description:
            'Niche tech reviewers with high engagement rates for the app launch.',
        creatorIds: ['c2', 'c10', 'c6'],
        estimatedBudget: 320000,
        currency: 'KES',
        status: 'Active',
        createdAt: '2024-10-02',
    },
    {
        id: 'list3',
        name: 'Njeve Season Launch',
        description:
            'Creators already contracted for the Dairybest Njeve campaign.',
        creatorIds: ['c1', 'c4', 'c12'],
        estimatedBudget: 450000,
        currency: 'KES',
        status: 'Active',
        createdAt: '2024-08-20',
    },
    {
        id: 'list4',
        name: '2025 Pipeline Prospects',
        description:
            'Long-list of creators to approach next year. Needs vetting.',
        creatorIds: ['c5', 'c8', 'c11'],
        estimatedBudget: 120000,
        currency: 'KES',
        status: 'Draft',
        createdAt: '2024-10-10',
    },
]

export const listStatusConfig: Record<
    ListStatus,
    { label: string; cls: string }
> = {
    Draft: { label: 'Draft', cls: 'bg-im-surface text-im-muted' },
    Active: { label: 'Active', cls: 'bg-emerald-50 text-emerald-700' },
    Archived: { label: 'Archived', cls: 'bg-im-ink/5 text-im-muted' },
}
