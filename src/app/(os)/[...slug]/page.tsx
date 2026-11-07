// src/app/(os)/[...slug]/page.tsx
import { EmptyState } from '@/components/ui/empty-state'
import { Construction } from 'lucide-react'
import Link from 'next/link'
import { buttonStyles } from '@/components/ui/button'

export default function CatchAllPage() {
    return (
        <EmptyState
            icon={Construction}
            title="Module under construction"
            description="This feature is currently being built for the INMIND OS MVP. Return to your Studio to continue working."
            variant="page"
            action={
                <Link href="/studio" className={buttonStyles('primary')}>
                    Return to Studio
                </Link>
            }
        />
    )
}
