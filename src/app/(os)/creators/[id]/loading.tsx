// src/app/(os)/creators/[id]/loading.tsx
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

export default function CreatorProfileLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Breadcrumb Placeholder */}
            <Skeleton className="h-4 w-32" />

            {/* Header Placeholder */}
            <Card
                padding="lg"
                className="flex flex-col md:flex-row md:items-start gap-6"
            >
                <Skeleton className="size-20 rounded-full shrink-0" />
                <div className="flex-1 space-y-3">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-40" />
                    <div className="flex gap-4">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-16 w-full max-w-2xl" />
                </div>
                <div className="flex gap-3 md:shrink-0">
                    <Skeleton className="h-10 w-28 rounded-xl" />
                    <Skeleton className="h-10 w-36 rounded-xl" />
                </div>
            </Card>

            {/* Main Grid Placeholder */}
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <Card
                                key={i}
                                padding="sm"
                                className="flex flex-col items-center justify-center py-4"
                            >
                                <Skeleton className="size-5 rounded-full mb-2" />
                                <Skeleton className="h-6 w-16 mb-1" />
                                <Skeleton className="h-3 w-12" />
                            </Card>
                        ))}
                    </div>
                    <Card padding="md">
                        <Skeleton className="h-5 w-48 mb-4" />
                        <div className="grid sm:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i}>
                                        <div className="flex justify-between mb-1.5">
                                            <Skeleton className="h-3 w-16" />
                                            <Skeleton className="h-3 w-8" />
                                        </div>
                                        <Skeleton className="h-2 w-full rounded-full" />
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i}>
                                        <div className="flex justify-between mb-1.5">
                                            <Skeleton className="h-3 w-20" />
                                            <Skeleton className="h-3 w-8" />
                                        </div>
                                        <Skeleton className="h-2 w-full rounded-full" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card padding="md">
                        <Skeleton className="h-5 w-32 mb-4" />
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="flex justify-between py-2 border-b border-black/5 last:border-0"
                                >
                                    <Skeleton className="h-3 w-24" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
