// src/components/shell/Header.tsx
"use client";

import { useState } from "react";
import { Bell, ChevronDown, Menu, Search } from "lucide-react";
import { Avatar } from "./Avatar";
import { useMobileNav } from "./MobileNavContext";
import { Dropdown } from "@/components/ui/dropdown";
import { ProfileDropdownContent } from "./ProfileDropdown";
import { LocationDropdownContent } from "./LocationDropdown";
import { NotificationsDropdownContent } from "./NotificationsDropdown";

export function Header() {
  const { open: openMobileNav } = useMobileNav();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="flex items-center gap-3 px-4 pt-4 lg:px-0">
        {/* Mobile Hamburger Menu */}
        <button
          onClick={openMobileNav}
          className="im-card grid size-12.5 shrink-0 place-items-center rounded-2xl lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="size-5 text-im-ink" strokeWidth={1.75} />
        </button>

        {/* Search Area */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {/* Desktop Search */}
          <label className="im-card hidden h-12.5 min-w-0 flex-1 items-center gap-3 rounded-2xl px-4 lg:flex">
            <Search className="size-4 shrink-0 text-im-muted" />
            <input
              placeholder="Search creators, campaigns..."
              className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-im-muted/70"
            />
            <kbd className="hidden rounded-md border border-black/10 px-1.5 py-0.5 text-[10px] text-im-muted sm:block">
              ⌘ K
            </kbd>
          </label>

          {/* Mobile Search Toggle */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="im-card grid size-12.5 shrink-0 place-items-center rounded-2xl transition-colors hover:bg-white/80 lg:hidden"
            aria-label="Toggle search"
            aria-expanded={isSearchOpen}
          >
            <Search className="size-5 text-im-ink" strokeWidth={1.75} />
          </button>
        </div>

        {/* Desktop Location Dropdown with Rotating Chevron */}
        <Dropdown
          trigger={(isOpen) => (
            <button className="im-card hidden h-12.5 items-center gap-2 rounded-2xl px-4 text-[14px] font-medium md:flex">
              KES · Nairobi
              <ChevronDown
                className={`size-4 text-im-muted transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
          width="w-72"
        >
          <LocationDropdownContent />
        </Dropdown>

        {/* Notifications Dropdown */}
        <Dropdown
          trigger={() => (
            <button
              aria-label="Notifications"
              className="im-card relative grid size-12.5 shrink-0 place-items-center rounded-2xl"
            >
              <Bell className="size-5 text-im-ink" strokeWidth={1.75} />
              <span className="absolute top-3 right-3 size-2 rounded-full bg-im-pink ring-2 ring-white" />
            </button>
          )}
          width="w-80"
          mobileCenter
        >
          <NotificationsDropdownContent />
        </Dropdown>

        {/* Profile Dropdown with Rotating Chevron */}
        <Dropdown
          trigger={(isOpen) => (
            <button className="im-card flex h-12.5 items-center gap-2 rounded-2xl px-2 pr-3 transition-colors hover:bg-white/80">
              <Avatar initials="OJ" className="size-8 text-[11px]" />
              <span className="hidden text-[14px] font-medium text-im-ink md:block">
                Odera James
              </span>
              <ChevronDown
                className={`size-4 text-im-muted transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
          width="w-64"
        >
          <ProfileDropdownContent />
        </Dropdown>
      </header>

      {/* Mobile Search Bar (Expands below header) */}
      {isSearchOpen && (
        <div className="border-b border-black/6 bg-white px-4 py-3 lg:hidden">
          <label className="flex items-center gap-3 rounded-2xl border border-black/10 bg-im-surface px-4 py-3">
            <Search className="size-4 shrink-0 text-im-muted" />
            <input
              autoFocus
              placeholder="Search creators, campaigns..."
              className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-im-muted/70"
            />
          </label>
        </div>
      )}
    </>
  );
}
