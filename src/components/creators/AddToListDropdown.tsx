'use client'

import { useState } from 'react'
import { Check, ListPlus } from 'lucide-react'
import { useListsStore } from '@/lib/store/listsStore'
import {
    Dropdown,
    DropdownHeader,
    DropdownDivider,
} from '@/components/ui/dropdown'
import { useToast } from '@/components/ui/toast'

export function AddToListDropdown({
    creatorId,
    creatorName,
}: {
    creatorId: string
    creatorName: string
}) {
    const { lists, addCreatorToList } = useListsStore()
    const toast = useToast()
    const [isOpen, setIsOpen] = useState(false)

    const handleAdd = (listId: string, listName: string) => {
        addCreatorToList(listId, creatorId)
        setIsOpen(false)
        toast.success(
            'Added to list',
            `${creatorName} was added to "${listName}".`,
        )
    }

    return (
        <Dropdown
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            trigger={(open) => (
                <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-im-ink py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90">
                    <ListPlus className="size-4" strokeWidth={1.75} />
                    Add to list
                </button>
            )}
            width="w-64"
            align="right"
        >
            <DropdownHeader title="Add to List" />
            <DropdownDivider />
            <div className="p-1 space-y-1 max-h-60 overflow-y-auto">
                {lists.length === 0 ? (
                    <p className="text-[12px] text-im-muted px-3 py-2">
                        No lists yet. Create one in the Lists tab.
                    </p>
                ) : (
                    lists.map((list) => {
                        const isAdded = list.creatorIds.includes(creatorId)
                        return (
                            <button
                                key={list.id}
                                onClick={() =>
                                    !isAdded && handleAdd(list.id, list.name)
                                }
                                disabled={isAdded}
                                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-[13px] font-medium transition-colors text-left ${
                                    isAdded
                                        ? 'text-im-muted cursor-default'
                                        : 'text-im-ink hover:bg-im-surface'
                                }`}
                            >
                                <span className="truncate">{list.name}</span>
                                {isAdded && (
                                    <Check className="size-4 text-im-violet shrink-0" />
                                )}
                            </button>
                        )
                    })
                )}
            </div>
        </Dropdown>
    )
}
