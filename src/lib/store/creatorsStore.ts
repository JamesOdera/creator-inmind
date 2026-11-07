// src/lib/store/creatorsStore.ts
'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { mockCreators } from '@/lib/mock-data/creators'
import type { Creator } from '@/lib/mock-data/types'

type CreatorsState = {
    creators: Creator[]
    addCreator: (creator: Creator) => void
}

export const useCreatorsStore = create<CreatorsState>()(
    persist(
        (set, get) => ({
            creators: mockCreators,
            addCreator: (creator) => {
                const current = get().creators
                // Prevent duplicates
                if (current.find((c) => c.id === creator.id)) {
                    return
                }
                set({ creators: [...current, creator] })
            },
        }),
        {
            name: 'inmind-creators-storage',
            storage: createJSONStorage(() => localStorage),
            // Custom merge ensures mock data is never lost, and API data is safely appended
            merge: (persistedState, currentState) => {
                const persisted = persistedState as Partial<CreatorsState>
                const mockIds = new Set(mockCreators.map((c) => c.id))
                
                // Keep only the YouTube/API creators from storage (ignore mock ones to avoid dupes)
                const extraCreators = (persisted.creators || []).filter(
                    (c: Creator) => !mockIds.has(c.id)
                )
                
                return {
                    ...currentState,
                    creators: [...mockCreators, ...extraCreators],
                }
            },
        }
    )
)