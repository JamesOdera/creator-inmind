// src/components/shell/MobileNavContext.tsx
'use client'

import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from 'react'

type MobileNavContextType = {
    isOpen: boolean
    open: () => void
    close: () => void
}

const MobileNavContext = createContext<MobileNavContextType>({
    isOpen: false,
    open: () => {},
    close: () => {},
})

export function useMobileNav() {
    return useContext(MobileNavContext)
}

export function MobileNavProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)

    // Accessibility: Close on Escape key and prevent background scroll
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false)
        }
        if (isOpen) {
            window.addEventListener('keydown', handleEsc)
            document.body.style.overflow = 'hidden'
        }
        return () => {
            window.removeEventListener('keydown', handleEsc)
            document.body.style.overflow = ''
        }
    }, [isOpen])

    return (
        <MobileNavContext.Provider
            value={{
                isOpen,
                open: () => setIsOpen(true),
                close: () => setIsOpen(false),
            }}
        >
            {children}
        </MobileNavContext.Provider>
    )
}
