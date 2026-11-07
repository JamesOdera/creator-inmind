// src/components/studio/SubmitDraftsButton.tsx
'use client'

import { useToast } from '@/components/ui/toast'

export function SubmitDraftsButton({ count }: { count: number }) {
    const toast = useToast()

    return (
        <button
            onClick={() =>
                toast.success(
                    'Draft submitted',
                    'Dairybest will review your cut shortly.',
                )
            }
            className="rounded-2xl bg-im-ink px-5 py-3 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
        >
            Submit drafts ({count})
        </button>
    )
}
