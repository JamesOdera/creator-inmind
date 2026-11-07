"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Filter, Check, ChevronDown } from "lucide-react";
import {
  mockCampaigns,
  type Campaign,
  type CampaignStatus,
} from "@/lib/mock-data/campaigns";
import { CreateCampaignDrawer } from "@/components/campaigns/CreateCampaignDrawer";
import { Dropdown } from "@/components/ui/dropdown";
import { Card } from "@/components/ui/card";

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const statusConfig: Record<
  CampaignStatus,
  { bg: string; text: string; dot: string }
> = {
  Active: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  Draft: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  Paused: { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500" },
  Completed: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    dot: "bg-violet-500",
  },
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerKey, setDrawerKey] = useState(0);
  const [defaultDates, setDefaultDates] = useState<{
    start: string;
    end: string;
  } | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | "All">(
    "All",
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filtered = campaigns.filter((c) => {
    const matchesQuery =
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.brand.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const handleCreate = (newCampaign: Omit<Campaign, "id">) => {
    const campaign: Campaign = {
      id: `cmp${Date.now()}`,
      ...newCampaign,
    };
    setCampaigns([campaign, ...campaigns]);
  };

  const handleOpenDrawer = () => {
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 30);

    setDefaultDates({
      start: start.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0],
    });

    setDrawerKey((prev) => prev + 1);
    setIsDrawerOpen(true);
  };

  const activeFilterCount = statusFilter !== "All" ? 1 : 0;

  const handleStatusSelect = (status: CampaignStatus | "All") => {
    setStatusFilter(status);
    setIsFilterOpen(false);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-semibold tracking-tight text-im-ink">
              Campaigns
            </h1>
            <p className="mt-1 text-[14px] text-im-muted">
              Manage and track all your active and past marketing campaigns.
            </p>
          </div>
          <button
            onClick={handleOpenDrawer}
            className="self-start rounded-2xl bg-im-ink px-5 py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 flex items-center gap-2"
          >
            <Plus className="size-4" />
            Create Campaign
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="im-card flex h-12 w-full items-center gap-3 rounded-2xl px-4">
            <Search className="size-4 shrink-0 text-im-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search campaigns..."
              className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-im-muted/70"
            />
          </label>

          <Dropdown
            isOpen={isFilterOpen}
            onOpenChange={setIsFilterOpen}
            trigger={(isOpen) => (
              <button
                className={`im-card flex h-12 w-12 items-center justify-center sm:w-auto sm:px-4 sm:justify-start sm:gap-2 rounded-2xl text-[13px] font-medium transition-colors hover:text-im-ink ${
                  isOpen
                    ? "ring-2 ring-im-violet/20 bg-black/5"
                    : "text-im-muted"
                }`}
              >
                <Filter className="size-4 shrink-0" strokeWidth={1.75} />
                <span className="hidden sm:inline">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="hidden sm:inline-flex size-5 items-center justify-center rounded-full bg-im-violet text-[10px] font-semibold text-white">
                    {activeFilterCount}
                  </span>
                )}
                <ChevronDown
                  className={`hidden size-3.5 shrink-0 text-im-muted transition-transform duration-200 sm:block ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            )}
            width="w-48"
            align="right"
          >
            <div className="p-1">
              <button
                onClick={() => handleStatusSelect("All")}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-[13px] font-medium transition-colors ${
                  statusFilter === "All"
                    ? "bg-im-violet/10 text-im-violet"
                    : "text-im-ink hover:bg-im-surface"
                }`}
              >
                All Statuses
                {statusFilter === "All" && <Check className="size-4" />}
              </button>
              {(
                ["Active", "Draft", "Paused", "Completed"] as CampaignStatus[]
              ).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusSelect(status)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-[13px] font-medium transition-colors ${
                    statusFilter === status
                      ? "bg-im-violet/10 text-im-violet"
                      : "text-im-ink hover:bg-im-surface"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`size-2 rounded-full ${statusConfig[status].dot}`}
                    />
                    {status}
                  </span>
                  {statusFilter === status && <Check className="size-4" />}
                </button>
              ))}
            </div>
          </Dropdown>
        </div>

        {/* Campaign Grid */}
        {filtered.length === 0 ? (
          <Card padding="lg" className="text-center py-12">
            <div className="mx-auto mb-3 grid size-16 place-items-center rounded-2xl bg-im-surface">
              <Plus className="size-6 text-im-muted" strokeWidth={1.5} />
            </div>
            <h3 className="text-[16px] font-semibold text-im-ink">
              No campaigns found
            </h3>
            <p className="text-[13px] text-im-muted mt-1">
              Try adjusting your search or filters, or create a new campaign.
            </p>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => {
              const status = statusConfig[c.status];
              return (
                <Link key={c.id} href={`/campaigns/${c.id}`} className="group">
                  <Card
                    padding="none"
                    className="h-full flex flex-col rounded-3xl p-6 transition-all hover:shadow-lg hover:scale-[1.02] bg-white"
                  >
                    {/* Header with Logo */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="shrink-0">
                          <img
                            src={c.logoUrl}
                            alt={`${c.brand} logo`}
                            className="size-12 rounded-xl object-cover border border-black/6 bg-im-surface"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-[15px] font-semibold text-im-ink truncate group-hover:text-im-violet transition-colors">
                            {c.name}
                          </h3>
                          <p className="text-[13px] text-im-muted mt-0.5">
                            {c.brand}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`shrink-0 ml-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium uppercase ${status.bg} ${status.text}`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${status.dot}`}
                        />
                        {c.status}
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-black/5 to-transparent my-4" />

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-im-muted">
                          Budget
                        </p>
                        <p className="mt-1 text-[14px] font-semibold text-im-ink">
                          {formatCurrency(c.budget, c.currency)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-im-muted">
                          Creators
                        </p>
                        <p className="mt-1 text-[14px] font-semibold text-im-ink">
                          {c.creatorsCount}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-im-muted">
                          Ends
                        </p>
                        <p className="mt-1 text-[14px] font-semibold text-im-ink">
                          {formatDate(c.endDate)}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <CreateCampaignDrawer
        key={drawerKey}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onCreate={handleCreate}
        defaultDates={defaultDates}
      />
    </>
  );
}
