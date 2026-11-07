'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/form/input'
import { Textarea } from '@/components/form/textarea'
import { Select } from '@/components/form/select'
import { useToast } from '@/components/ui/toast'
import type { CreatorList, ListStatus } from '@/lib/mock-data/lists'

type CreateListDrawerProps = {
    isOpen: boolean
    onClose: () => void
    onCreate: (
        data: Omit<CreatorList, 'id' | 'createdAt' | 'creatorIds'>,
    ) => void
}

export function CreateListDrawer({
    isOpen,
    onClose,
    onCreate,
}: CreateListDrawerProps) {
    const toast = useToast()
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [estimatedBudget, setEstimatedBudget] = useState('')
    const [currency, setCurrency] = useState('KES')
    const [status, setStatus] = useState<ListStatus>('Draft')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) {
            toast.error('Missing name', 'Please provide a name for the list.')
            return
        }

        onCreate({
            name: name.trim(),
            description: description.trim(),
            estimatedBudget: Number(estimatedBudget) || 0,
            currency,
            status,
        })
        toast.success('List created', `"${name}" has been saved.`)

        // Reset and close
        setName('')
        setDescription('')
        setEstimatedBudget('')
        setCurrency('KES')
        setStatus('Draft')
        onClose()
    }

    const currencyOptions = [
        { value: 'KES', label: 'KES' },
        { value: 'USD', label: 'USD' },
        { value: 'NGN', label: 'NGN' },
    ]

    const statusOptions = [
        { value: 'Draft', label: 'Draft' },
        { value: 'Active', label: 'Active' },
        { value: 'Archived', label: 'Archived' },
    ]

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{
                            type: 'spring',
                            damping: 25,
                            stiffness: 200,
                        }}
                        className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#f4f4f7] shadow-2xl flex flex-col"
                    >
                        <div className="flex items-center justify-between border-b border-black/6 bg-white px-6 py-4">
                            <h2 className="text-[18px] font-semibold text-im-ink">
                                New Creator List
                            </h2>
                            <button
                                onClick={onClose}
                                className="grid size-9 place-items-center rounded-xl hover:bg-black/5"
                            >
                                <X className="size-5 text-im-muted" />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="flex-1 overflow-y-auto p-6 space-y-5"
                        >
                            <Input
                                label="List Name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Q4 Tech Campaign"
                            />
                            <Textarea
                                label="Description (Optional)"
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="What is this list used for?"
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    label="Est. Budget"
                                    type="number"
                                    min="0"
                                    value={estimatedBudget}
                                    onChange={(e) =>
                                        setEstimatedBudget(e.target.value)
                                    }
                                    placeholder="0"
                                />
                                <Select
                                    label="Currency"
                                    options={currencyOptions}
                                    value={currency}
                                    onChange={setCurrency}
                                />
                            </div>
                            <Select
                                label="Status"
                                options={statusOptions}
                                value={status}
                                onChange={(val) => setStatus(val as ListStatus)}
                            />
                        </form>

                        <div className="border-t border-black/6 bg-white px-6 py-4 flex justify-end gap-3">
                            <Button
                                variant="secondary"
                                onClick={onClose}
                                type="button"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleSubmit}
                                type="button"
                                className="gap-2"
                            >
                                <Plus className="size-4" />
                                Create List
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
