// src/lib/mock-data/deliverables.ts
export type DeliverableStatus = 'changes' | 'submitted' | 'approved'

export type Deliverable = {
    id: string
    title: string
    meta: string // e.g., 'Dairybest · Njeve Season · REEL · v1'
    status: DeliverableStatus
    action: string
    primary: boolean
}

export const mockDeliverables: Deliverable[] = [
    {
        id: 'd1',
        title: 'Hot white tea · balcony boil cut 02',
        meta: 'Dairybest · Njeve Season · REEL · v1',
        status: 'changes',
        action: 'Revise & submit',
        primary: true,
    },
    {
        id: 'd2',
        title: 'CBD flat white · morning rush',
        meta: 'Java House · Morning Ritual · REEL · v1',
        status: 'submitted',
        action: 'View status',
        primary: false,
    },
]
