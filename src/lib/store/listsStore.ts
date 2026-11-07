'use client'

import { create } from 'zustand'
import { mockLists, type CreatorList } from '@/lib/mock-data/lists'

type ListsState = {
    lists: CreatorList[]
    addCreatorToList: (listId: string, creatorId: string) => void
    removeCreatorFromList: (listId: string, creatorId: string) => void
    createList: (
        data: Omit<CreatorList, 'id' | 'createdAt' | 'creatorIds'>,
    ) => void
    deleteList: (listId: string) => void
}

export const useListsStore = create<ListsState>((set) => ({
    lists: mockLists,

    addCreatorToList: (listId, creatorId) =>
        set((state) => ({
            lists: state.lists.map((list) =>
                list.id === listId && !list.creatorIds.includes(creatorId)
                    ? { ...list, creatorIds: [...list.creatorIds, creatorId] }
                    : list,
            ),
        })),

    removeCreatorFromList: (listId, creatorId) =>
        set((state) => ({
            lists: state.lists.map((list) =>
                list.id === listId
                    ? {
                          ...list,
                          creatorIds: list.creatorIds.filter(
                              (id) => id !== creatorId,
                          ),
                      }
                    : list,
            ),
        })),

    createList: (data) =>
        set((state) => ({
            lists: [
                {
                    ...data,
                    id: `list${Date.now()}`,
                    createdAt: new Date().toISOString().split('T')[0],
                    creatorIds: [],
                },
                ...state.lists,
            ],
        })),

    deleteList: (listId) =>
        set((state) => ({
            lists: state.lists.filter((list) => list.id !== listId),
        })),
}))
