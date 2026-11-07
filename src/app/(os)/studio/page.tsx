// src/app/(os)/studio/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  ClipboardList,
  Megaphone,
  Eye,
  Plus,
  BarChart3,
  Users,
  Play,
  FileVideo,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { SubmitDraftsButton } from "@/components/studio/SubmitDraftsButton";
import { mockDeliverables } from "@/lib/mock-data/deliverables";
import { mockCampaigns } from "@/lib/mock-data/campaigns";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Studio" };

type Status = "changes" | "submitted" | "approved";

const statusStyles: Record<Status, { label: string; cls: string }> = {
  changes: { label: "Changes requested", cls: "bg-amber-50 text-amber-700" },
  submitted: { label: "Submitted", cls: "bg-im-violet/10 text-im-violet" },
  approved: { label: "Approved", cls: "bg-emerald-50 text-emerald-700" },
};

// Mock data for Portfolio Cuts (Examples of what a creator uploads)
const portfolioCuts = [
  {
    id: "cut1",
    title: "Safaricom 5G Reel - v2",
    brand: "Safaricom",
    date: "2 days ago",
    status: "approved",
  },
  {
    id: "cut2",
    title: "Java House Morning Routine",
    brand: "Java House",
    date: "1 week ago",
    status: "submitted",
  },
];

function StatusPill({ status }: { status: Status }) {
  const { label, cls } = statusStyles[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium uppercase ${cls}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  trend,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  trend: string;
}) {
  return (
    <Card padding="md" className="flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div className="grid size-10 place-items-center rounded-xl bg-im-surface text-im-violet">
          <Icon className="size-5" strokeWidth={1.75} />
        </div>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600">
          {trend}
        </span>
      </div>
      <div className="mt-4">
        <p className="text-[24px] font-semibold tracking-tight text-im-ink">
          {value}
        </p>
        <p className="text-[13px] text-im-muted">{label}</p>
      </div>
    </Card>
  );
}

export default function StudioPage() {
  const pendingCount = mockDeliverables.filter((d) => d.primary).length;
  const activeCampaignsCount = mockCampaigns.filter(
    (c) => c.status === "Active",
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-im-violet/10 px-2.5 py-1 text-[11px] font-medium text-im-violet">
            <span className="size-1.5 rounded-full bg-im-violet" />
            Creator OS
          </span>
          <h1 className="mt-3 text-[34px] leading-none font-semibold tracking-tight">
            Studio
          </h1>
          <p className="mt-3 text-[14px] text-im-muted">
            Welcome back. Here's an overview of your creator business and active
            workflows.
          </p>
        </div>
        <SubmitDraftsButton count={pendingCount} />
      </div>

      {/* System Overview Stats (Based strictly on existing mock data) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Campaigns"
          value={activeCampaignsCount.toString()}
          icon={Megaphone}
          trend="Live now"
        />
        <StatCard
          label="Pending Reviews"
          value={pendingCount.toString()}
          icon={ClipboardList}
          trend="Action needed"
        />
        <StatCard
          label="Saved Creators"
          value="24"
          icon={Users}
          trend="+3 this week"
        />
        <StatCard
          label="Total Reach"
          value="1.8M"
          icon={Eye}
          trend="Across all lists"
        />
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[1.9fr_1fr]">
        {/* Left Column: Action Items & Activity */}
        <div className="space-y-6">
          {/* Work in progress */}
          <section className="im-card rounded-3xl p-6">
            <div className="flex items-center gap-4">
              <span className="grid size-10 place-items-center rounded-xl border border-black/6 bg-white">
                <ClipboardList
                  className="size-5 text-im-ink"
                  strokeWidth={1.75}
                />
              </span>
              <div>
                <h2 className="text-[15px] font-medium">Work in progress</h2>
                <p className="text-[12px] text-im-muted">
                  {mockDeliverables.length} open deliverables · 2 active deals
                </p>
              </div>
            </div>

            <ul className="mt-5 space-y-3">
              {mockDeliverables.map((d) => (
                <li
                  key={d.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-black/6 bg-white p-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-medium">
                      {d.title}
                    </p>
                    <p className="mt-1 text-[12px] text-im-muted">{d.meta}</p>
                    <div className="mt-3">
                      <StatusPill status={d.status} />
                    </div>
                  </div>
                  <button
                    className={`shrink-0 w-full sm:w-auto rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-colors ${
                      d.primary
                        ? "bg-im-ink text-white hover:opacity-90"
                        : "border border-black/8 bg-white hover:bg-black/2"
                    }`}
                  >
                    {d.action}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* Recent Campaign Activity (Replaced "Invites" with real campaign data) */}
          <section className="im-card rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[15px] font-medium flex items-center gap-2">
                <Megaphone className="size-4 text-im-violet" />
                Recent Campaign Activity
              </h2>
              <Link
                href="/campaigns"
                className="text-[12px] font-medium text-im-violet hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {mockCampaigns.slice(0, 2).map((campaign) => (
                <Link
                  key={campaign.id}
                  href={`/campaigns/${campaign.id}`}
                  className="flex items-center justify-between p-3 rounded-2xl border border-black/6 bg-white transition-colors hover:bg-im-surface/50"
                >
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-im-ink truncate">
                      {campaign.name}
                    </p>
                    <p className="text-[12px] text-im-muted truncate">
                      {campaign.brand}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
                        campaign.status === "Active"
                          ? "bg-emerald-50 text-emerald-700"
                          : campaign.status === "Draft"
                            ? "bg-im-surface text-im-muted"
                            : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {campaign.status}
                    </span>
                    <p className="text-[11px] text-im-muted mt-1">
                      {campaign.creatorsCount} creators
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Quick Actions & Portfolio */}
        <div className="space-y-4">
          {/* Quick Actions Grid */}
          <Card padding="md">
            <h2 className="text-[15px] font-medium mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/discovery"
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-black/6 bg-white p-4 transition-colors hover:bg-im-surface/50 text-center"
              >
                <div className="grid size-10 place-items-center rounded-full bg-im-violet/10 text-im-violet">
                  <Users className="size-5" strokeWidth={1.75} />
                </div>
                <span className="text-[13px] font-medium text-im-ink">
                  Find Talent
                </span>
              </Link>
              <Link
                href="/campaigns"
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-black/6 bg-white p-4 transition-colors hover:bg-im-surface/50 text-center"
              >
                <div className="grid size-10 place-items-center rounded-full bg-im-pink/10 text-im-pink">
                  <Megaphone className="size-5" strokeWidth={1.75} />
                </div>
                <span className="text-[13px] font-medium text-im-ink">
                  New Campaign
                </span>
              </Link>
              <Link
                href="/profile"
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-black/6 bg-white p-4 transition-colors hover:bg-im-surface/50 text-center"
              >
                <div className="grid size-10 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                  <Plus className="size-5" strokeWidth={1.75} />
                </div>
                <span className="text-[13px] font-medium text-im-ink">
                  Edit Media Kit
                </span>
              </Link>
              <Link
                href="/reports-history"
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-black/6 bg-white p-4 transition-colors hover:bg-im-surface/50 text-center"
              >
                <div className="grid size-10 place-items-center rounded-full bg-amber-50 text-amber-600">
                  <BarChart3 className="size-5" strokeWidth={1.75} />
                </div>
                <span className="text-[13px] font-medium text-im-ink">
                  Analytics
                </span>
              </Link>
            </div>
          </Card>

          {/* Portfolio Cuts (Now showing examples instead of empty state) */}
          <Card padding="md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[15px] font-medium">Portfolio Cuts</h2>
              <button className="flex items-center gap-1 text-[12px] font-medium text-im-violet hover:text-im-violet/80 transition-colors">
                <Plus className="size-3.5" /> Add Cut
              </button>
            </div>

            <div className="space-y-3">
              {portfolioCuts.map((cut) => (
                <div
                  key={cut.id}
                  className="flex items-center gap-3 p-3 rounded-2xl border border-black/6 bg-white hover:bg-im-surface/50 transition-colors cursor-pointer group"
                >
                  <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-im-ink text-white">
                    <FileVideo className="size-5" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-im-ink truncate group-hover:text-im-violet transition-colors">
                      {cut.title}
                    </p>
                    <p className="text-[11px] text-im-muted">
                      {cut.brand} · {cut.date}
                    </p>
                  </div>
                  {cut.status === "approved" ? (
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Clock className="size-4 text-amber-600 shrink-0" />
                  )}
                </div>
              ))}
            </div>

            <p className="text-[11px] text-im-muted mt-4 text-center leading-relaxed">
              Upload polished video drafts to showcase your editing style and
              quality to brands.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
