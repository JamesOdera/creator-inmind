"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleCheck, CircleX, Info, TriangleAlert, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

type Tone = "success" | "error" | "warning" | "info";

type ToastInput = {
  tone?: Tone;
  title: string;
  description?: string;
  /** ms before auto-dismiss (default 5000) */
  duration?: number;
};

type ToastItem = {
  id: number;
  tone: Tone;
  title: string;
  description?: string;
  duration: number;
};

type ToastApi = {
  show: (input: ToastInput) => number;
  dismiss: (id: number) => void;
  success: (title: string, description?: string) => number;
  error: (title: string, description?: string) => number;
  warning: (title: string, description?: string) => number;
  info: (title: string, description?: string) => number;
};

/** `accent` colours the icon, sonar rings and progress bar via currentColor. */
const tones: Record<
  Tone,
  { icon: LucideIcon; accent: string; surface: string }
> = {
  success: {
    icon: CircleCheck,
    accent: "text-emerald-500",
    surface: "border-emerald-200 bg-emerald-50",
  },
  error: {
    icon: CircleX,
    accent: "text-rose-500",
    surface: "border-rose-200 bg-rose-50",
  },
  warning: {
    icon: TriangleAlert,
    accent: "text-amber-500",
    surface: "border-amber-200 bg-amber-50",
  },
  info: {
    icon: Info,
    accent: "text-im-violet",
    surface: "border-violet-200 bg-violet-50",
  },
};

const ToastContext = createContext<ToastApi | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: number) => void;
}) {
  const { icon: Icon, accent, surface } = tones[toast.tone];

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 48, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 420, damping: 34 }}
      role={toast.tone === "error" ? "alert" : "status"}
      className={cn(
        "im-toast pointer-events-auto relative w-88 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border shadow-[0_14px_34px_-12px_rgba(10,10,11,0.18)]",
        surface,
      )}
    >
      <div className="flex items-start gap-3 p-4 pb-5">
        {/* sonar icon */}
        <span
          aria-hidden
          className={cn(
            "relative grid size-9 shrink-0 place-items-center",
            accent,
          )}
        >
          {[0, 1].map((i) => (
            <span
              key={i}
              className="im-ring absolute inset-0 rounded-full border border-current"
              style={{ animationDelay: `${i * 1.1}s` }}
            />
          ))}
          <span className="relative grid size-9 place-items-center rounded-full bg-current/15">
            <Icon className="size-4.5" strokeWidth={2} />
          </span>
        </span>

        <div className="min-w-0 flex-1 pt-1">
          <p className="text-[14px] leading-tight font-medium text-im-ink">
            {toast.title}
          </p>
          {toast.description && (
            <p className="mt-1 text-[12.5px] leading-snug text-im-muted">
              {toast.description}
            </p>
          )}
        </div>

        <button
          aria-label="Dismiss notification"
          onClick={() => onDismiss(toast.id)}
          className="-mt-1 -mr-1 grid size-7 shrink-0 place-items-center rounded-lg text-im-muted transition-colors hover:bg-black/5 hover:text-im-ink"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* auto-dismiss bar: dismisses on animationend, pauses on hover */}
      <span
        aria-hidden
        className={cn("absolute inset-x-0 bottom-0 h-1 bg-current/10", accent)}
      >
        <span
          className="im-toast-bar block h-full origin-left bg-current"
          style={{ animationDuration: `${toast.duration}ms` }}
          onAnimationEnd={() => onDismiss(toast.id)}
        />
      </span>
    </motion.li>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((input: ToastInput) => {
    const id = ++nextId.current;
    const item: ToastItem = {
      id,
      tone: input.tone ?? "info",
      title: input.title,
      description: input.description,
      duration: input.duration ?? 5000,
    };
    // keep at most 4 on screen
    setToasts((list) => [...list.slice(-3), item]);
    return id;
  }, []);

  const api = useMemo<ToastApi>(
    () => ({
      show,
      dismiss,
      success: (title, description) =>
        show({ tone: "success", title, description }),
      error: (title, description) =>
        show({ tone: "error", title, description }),
      warning: (title, description) =>
        show({ tone: "warning", title, description }),
      info: (title, description) => show({ tone: "info", title, description }),
    }),
    [show, dismiss],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed right-4 bottom-4 z-100"
      >
        <ul className="flex flex-col items-end gap-3">
          <AnimatePresence initial={false}>
            {toasts.map((t) => (
              <ToastCard key={t.id} toast={t} onDismiss={dismiss} />
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </ToastContext.Provider>
  );
}
