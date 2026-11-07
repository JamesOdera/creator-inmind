// src/components/shell/NotificationsDropdown.tsx
import { Bell, Check } from "lucide-react";
import {
  DropdownHeader,
  DropdownDivider,
  DropdownItem,
} from "@/components/ui/dropdown";

const notifications = [
  {
    id: "n1",
    title: "New campaign invitation",
    description: "Dairybest invited you to Njeve Season",
    time: "2h ago",
    unread: true,
  },
  {
    id: "n2",
    title: "Payment received",
    description: "KES 45,000 from Java House",
    time: "1d ago",
    unread: true,
  },
  {
    id: "n3",
    title: "Draft approved",
    description: "Your cut for CBD flat white was approved",
    time: "3d ago",
    unread: false,
  },
];

export function NotificationsDropdownContent() {
  return (
    <>
      <div className="flex items-center justify-between px-3 py-2">
        <p className="text-[14px] font-semibold text-im-ink">Notifications</p>
        <button className="text-[11px] font-medium text-im-violet hover:text-im-violet/80">
          Mark all read
        </button>
      </div>
      <DropdownDivider />
      <div className="max-h-80 overflow-y-auto">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`rounded-xl px-3 py-2.5 transition-colors hover:bg-im-surface ${
              n.unread ? "bg-im-violet/5" : ""
            }`}
          >
            <div className="flex items-start gap-2">
              {n.unread && (
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-im-violet" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-im-ink">{n.title}</p>
                <p className="mt-0.5 text-[12px] text-im-muted">
                  {n.description}
                </p>
                <p className="mt-1 text-[11px] text-im-muted/70">{n.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <DropdownDivider />
      <DropdownItem icon={Bell} label="View all notifications" />
    </>
  );
}
