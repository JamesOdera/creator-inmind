// src/components/shell/ProfileDropdown.tsx
import { LogOut, Settings, User } from 'lucide-react'
import {
    DropdownHeader,
    DropdownDivider,
    DropdownItem,
} from '@/components/ui/dropdown'

export function ProfileDropdownContent() {
    return (
        <>
            <DropdownHeader
                title="Dennis Ombachi"
                subtitle="dennis@inmind.os"
            />
            <DropdownDivider />
            <DropdownItem icon={User} label="Profile" />
            <DropdownItem icon={Settings} label="Settings" />
            <DropdownDivider />
            <DropdownItem icon={LogOut} label="Log out" variant="danger" />
        </>
    )
}
