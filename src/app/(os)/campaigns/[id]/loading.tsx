// src/app/(os)/campaigns/[id]/loading.tsx
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

export default function CampaignDetailLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            <Skeleton className="h-4 w-32" />

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-48" />
                </div>
                <div className="flex gap-3">
                    <Skeleton className="h-10 w-32 rounded-xl" />
                    <Skeleton className="h-10 w-32 rounded-xl" />
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <Card padding="md">
                        <div className="flex justify-between mb-4">
                            <Skeleton className="h-5 w-40" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-3 w-full rounded-full mb-2" />
                        <div className="flex justify-between">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                    </Card>
                    <Card padding="md">
                        <Skeleton className="h-5 w-48 mb-4" />
                        <div className="grid sm:grid-cols-3 gap-4">
                            {[1, 2, 3].map((i) => (
                                <Card
                                    key={i}
                                    padding="sm"
                                    className="flex items-center gap-3 p-4"
                                >
                                    <Skeleton className="size-10 rounded-xl" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-5 w-8" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card padding="md">
                        <Skeleton className="h-5 w-24 mb-4" />
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 p-2"
                                >
                                    <Skeleton className="size-9 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-3 w-24" />
                                        <Skeleton className="h-2 w-32" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
