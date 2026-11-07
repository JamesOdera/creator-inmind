// src/components/ui/dropdown.tsx
"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

type DropdownProps = {
  trigger: (isOpen: boolean) => ReactNode;
  children: ReactNode;
  align?: "left" | "right";
  position?: "top" | "bottom";
  width?: string;
  /** Center as a fixed panel below the header on mobile (< sm) */
  mobileCenter?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function Dropdown({
  trigger,
  children,
  align = "right",
  position = "bottom",
  width = "w-64",
  mobileCenter = false,
  isOpen: controlledIsOpen,
  onOpenChange,
}: DropdownProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Support both controlled and uncontrolled usage
  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const setIsOpen = (val: boolean) => {
    setInternalIsOpen(val);
    onOpenChange?.(val);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  const horizontal = align === "right" ? "right-0" : "left-0";
  const vertical = position === "top" ? "bottom-full mb-2" : "mt-2";

  const placement = mobileCenter
    ? `fixed inset-x-0 top-20 mx-auto max-w-[calc(100vw-2rem)] sm:absolute sm:inset-x-auto sm:top-auto sm:mx-0 sm:max-w-none ${
        align === "right" ? "sm:right-0" : "sm:left-0"
      } ${position === "top" ? "sm:bottom-full sm:mb-2" : "sm:mt-2"}`
    : `absolute ${horizontal} ${vertical}`;

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger(isOpen)}</div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: position === "top" ? 8 : -8,
              scale: 0.96,
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: position === "top" ? 8 : -8,
              scale: 0.96,
            }}
            transition={{
              duration: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`z-50 ${width} ${placement} rounded-2xl border border-black/6 bg-white p-2 shadow-xl`}
            role="menu"
            aria-orientation="vertical"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DropdownHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="px-3 py-2">
      <p className="text-[14px] font-semibold text-im-ink">{title}</p>
      {subtitle && <p className="text-[12px] text-im-muted">{subtitle}</p>}
    </div>
  );
}

export function DropdownDivider() {
  return <div className="my-2 h-px bg-black/6" />;
}

export function DropdownItem({
  icon: Icon,
  label,
  onClick,
  variant = "default",
}: {
  icon?: React.ElementType;
  label: string;
  onClick?: () => void;
  variant?: "default" | "danger";
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-medium transition-colors ${
        variant === "danger"
          ? "text-rose-600 hover:bg-rose-50"
          : "text-im-ink hover:bg-im-surface"
      }`}
      role="menuitem"
    >
      {Icon && <Icon className="size-4" />}
      {label}
    </button>
  );
}
