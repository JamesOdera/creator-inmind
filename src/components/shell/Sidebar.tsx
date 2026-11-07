// src/components/shell/Sidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MotionConfig, motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  LayoutDashboard,
  ListChecks,
  Megaphone,
  Inbox,
  BarChart3,
  Search,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import { Avatar } from "./Avatar";
import { useMobileNav } from "./MobileNavContext";

type Item = { href: string; label: string; icon: LucideIcon };

// Cleaned up to only include fully built, pitch-ready modules
const links: Item[] = [
  { href: "/studio", label: "Studio", icon: LayoutDashboard },
  { href: "/discovery", label: "Creator Discovery", icon: Search },
  { href: "/lists", label: "Talent Pipeline", icon: ListChecks },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/messages", label: "Messages", icon: Inbox },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

const isActive = (path: string, href: string) =>
  path === href || path.startsWith(`${href}/`);

function NavGroup({
  label,
  items,
  current,
  onSelect,
}: {
  label: string;
  items: Item[];
  current: string;
  onSelect: (href: string) => void;
}) {
  return (
    <div className="mb-6">
      <p className="mb-2 px-3 text-[11px] font-medium tracking-[0.14em] text-im-muted/80 uppercase">
        {label}
      </p>
      <ul className="space-y-0.5">
        {items.map(({ href, label, icon: Icon }) => {
          const active = isActive(current, href);
          return (
            <li key={href}>
              <Link
                href={href}
                onClick={() => onSelect(href)}
                className={`relative block rounded-xl px-3 py-2.5 text-[14px] transition-colors ${
                  active ? "text-im-ink" : "text-im-muted hover:text-im-ink"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-white shadow-[0_1px_3px_rgba(10,10,11,0.08)]"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 34,
                    }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-3">
                  <Icon className="size-4 shrink-0" strokeWidth={1.75} />
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const [seenPath, setSeenPath] = useState(pathname);
  const [clicked, setClicked] = useState<string | null>(null);

  if (seenPath !== pathname) {
    setSeenPath(pathname);
    setClicked(null);
  }
  const current = clicked ?? pathname;

  const handleSelect = (href: string) => {
    setClicked(href);
    onClose?.();
  };

  return (
    <>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 grid size-10 place-items-center rounded-xl transition-colors hover:bg-black/5"
          aria-label="Close menu"
        >
          <X className="size-5 text-im-muted" />
        </button>
      )}

      <Link href="/" className="mb-7 px-1.5 text-[22px] tracking-tight">
        <span className="font-semibold">INMIND</span>
      </Link>

      <button className="im-card mb-6 flex w-full items-center gap-3 rounded-2xl p-3 text-left">
        <Avatar initials="OJ" className="size-9 text-xs" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14px] leading-tight font-medium">
            Odera James
          </span>
          <span className="block text-[11px] text-im-muted">
            Creator workspace
          </span>
        </span>
        <ChevronDown className="size-4 text-im-muted" />
      </button>

      <nav className="im-scroll -mr-2 min-h-0 flex-1 overflow-y-auto pr-2">
        <NavGroup
          label="Workspace"
          items={links}
          current={current}
          onSelect={handleSelect}
        />
      </nav>

      <div className="im-card mt-3 rounded-2xl p-4">
        <p className="flex items-center gap-2 text-[13px] font-medium">
          <Sparkles className="size-3.5 text-im-violet" />
          Growth Coach
        </p>
        <p className="mt-2 text-[12px] leading-relaxed text-im-muted">
          Top channel engagement sits at 4.2%. Keep your kit and Studio current
          so brands can shortlist you.
        </p>
        <button className="mt-3 w-full rounded-xl bg-im-ink/4 py-2.5 text-[13px] font-medium transition-colors hover:bg-im-ink/8">
          Edit analytics
        </button>
      </div>
    </>
  );
}

export function Sidebar() {
  const { isOpen, close } = useMobileNav();

  return (
    <MotionConfig reducedMotion="user">
      {/* Desktop Sidebar */}
      <aside className="hidden h-full w-64 shrink-0 flex-col px-4 pt-7 pb-4 lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 200,
              }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-[#f4f4f7] shadow-2xl lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Main navigation"
            >
              <div className="flex h-full flex-col px-4 pt-7 pb-4">
                <SidebarContent onClose={close} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
