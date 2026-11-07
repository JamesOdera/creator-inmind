import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
    return (
        <div role="status" aria-busy="true">
            <span className="sr-only">Loading…</span>

            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="mt-3 h-9 w-44" />
                    <Skeleton className="mt-3 h-4 w-80 max-w-full" />
                </div>
                <Skeleton className="h-11.5 w-40 rounded-2xl" />
            </div>

            <div className="mt-8 grid items-start gap-6 xl:grid-cols-[1.9fr_1fr]">
                <Card>
                    <div className="flex items-center gap-4">
                        <Skeleton className="size-10" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-36" />
                            <Skeleton className="h-3 w-48" />
                        </div>
                    </div>
                    <div className="mt-5 space-y-3">
                        <Skeleton className="h-27 w-full rounded-2xl" />
                        <Skeleton className="h-27 w-full rounded-2xl" />
                    </div>
                </Card>

                <div className="space-y-4">
                    <Card className="space-y-2.5">
                        <Skeleton className="mb-4 h-4 w-24" />
                        {[0, 1, 2, 3].map((i) => (
                            <Skeleton
                                key={i}
                                className="h-14.5 w-full rounded-2xl"
                            />
                        ))}
                    </Card>
                    <Card>
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="mt-6 h-14 w-full" />
                    </Card>
                </div>
            </div>
        </div>
    )
}
