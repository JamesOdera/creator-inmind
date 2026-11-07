"use client";

import { useState } from "react";
import { Users, DollarSign, Eye, Plus, FolderOpen, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/shell/Avatar";
import { listStatusConfig, type CreatorList } from "@/lib/mock-data/lists";
import { useCreatorsStore } from "@/lib/store/creatorsStore";
import { useListsStore } from "@/lib/store/listsStore";
import { CreateListDrawer } from "@/components/lists/CreateListDrawer";
import { ListDetailDrawer } from "@/components/lists/ListDetailDrawer";
import { useToast } from "@/components/ui/toast";
import { Creator } from "@/lib/mock-data/types";

function formatCurrency(amount: number, currency: string = "KES") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatNumber(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toString();
}

export default function ListsPage() {
  const { lists, createList, deleteList } = useListsStore();
  const allCreators = useCreatorsStore((state) => state.creators);
  const toast = useToast();

  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [selectedList, setSelectedList] = useState<CreatorList | null>(null);

  const totalLists = lists.length;
  const totalCreators = lists.reduce(
    (acc, list) => acc + list.creatorIds.length,
    0,
  );
  const totalBudget = lists.reduce(
    (acc, list) => acc + list.estimatedBudget,
    0,
  );

  const uniqueCreatorIds = new Set(lists.flatMap((list) => list.creatorIds));
  const totalReach = Array.from(uniqueCreatorIds).reduce((acc, id) => {
    const creator = allCreators.find((c) => c.id === id);
    return acc + (creator ? creator.followers : 0);
  }, 0);

  const handleCreateList = (
    data: Omit<CreatorList, "id" | "createdAt" | "creatorIds">,
  ) => {
    createList(data);
    setIsCreateDrawerOpen(false);
  };

  const handleDeleteList = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (lists.length <= 1) {
      toast.warning("Cannot delete", "You must have at least one list.");
      return;
    }
    deleteList(id);
    if (selectedList?.id === id) {
      setSelectedList(null);
    }
    toast.success("List deleted", "The creator list has been removed.");
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-im-violet/10 px-2.5 py-1 text-[11px] font-medium text-im-violet">
              <span className="size-1.5 rounded-full bg-im-violet" />
              CRM & Pipeline
            </span>
            <h1 className="mt-3 text-[34px] leading-none font-semibold tracking-tight">
              Talent Pipeline
            </h1>
            <p className="mt-3 text-[14px] text-im-muted">
              Organize talent, estimate campaign budgets, and track your
              pipeline.
            </p>
          </div>
          <Button
            variant="primary"
            className="gap-2"
            onClick={() => setIsCreateDrawerOpen(true)}
          >
            <Plus className="size-4" />
            New List
          </Button>
        </div>

        {/* Forecast Summary Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ForecastCard
            icon={FolderOpen}
            label="Total Lists"
            value={totalLists.toString()}
            accent="violet"
          />
          <ForecastCard
            icon={Users}
            label="Total Creators"
            value={totalCreators.toString()}
            accent="pink"
          />
          <ForecastCard
            icon={Eye}
            label="Est. Total Reach"
            value={formatNumber(totalReach)}
            accent="emerald"
          />
          <ForecastCard
            icon={DollarSign}
            label="Est. Pipeline Value"
            value={formatCurrency(totalBudget)}
            accent="ink"
          />
        </div>

        {/* Lists Grid */}

        {/* Lists Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[16px] font-semibold text-im-ink">
              Your Lists
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {lists.map((list) => {
              const status = listStatusConfig[list.status];

              // FIX: Add type predicate `c is Creator` to the filter
              const previewCreators = list.creatorIds
                .slice(0, 3)
                .map((id) => allCreators.find((c) => c.id === id))
                .filter((c): c is Creator => c !== undefined);

              const remainingCount = list.creatorIds.length - 3;

              return (
                <Card
                  key={list.id}
                  padding="md"
                  className="relative flex flex-col justify-between hover:shadow-[0_14px_34px_-14px_rgba(10,10,11,0.12)] transition-shadow cursor-pointer group"
                  onClick={() => setSelectedList(list)}
                >
                  <button
                    onClick={(e) => handleDeleteList(list.id, e)}
                    className="absolute top-3 right-3 grid size-8 place-items-center rounded-lg text-rose-500 opacity-0 group-hover:opacity-100 hover:bg-rose-50 transition-all z-10"
                    aria-label="Delete list"
                  >
                    <Trash2 className="size-4" />
                  </button>

                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10.5px] font-medium uppercase ${status.cls}`}
                      >
                        {status.label}
                      </span>
                    </div>
                    <h3 className="text-[15px] font-semibold text-im-ink mb-1 group-hover:text-im-violet transition-colors">
                      {list.name}
                    </h3>
                    <p className="text-[12.5px] text-im-muted line-clamp-2 mb-4">
                      {list.description}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="flex -space-x-2">
                        {previewCreators.map((creator, idx) => (
                          <Avatar
                            key={idx}
                            initials={creator.avatarInitials} // No more '!' needed
                            src={creator.avatarUrl} // No more error!
                            className="size-8 text-[10px] ring-2 ring-white"
                          />
                        ))}
                      </div>
                      {remainingCount > 0 && (
                        <span className="ml-3 text-[12px] font-medium text-im-muted">
                          +{remainingCount} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-black/6">
                      <div className="flex items-center gap-1.5 text-[12px] text-im-muted">
                        <Users className="size-3.5" />
                        <span>{list.creatorIds.length} creators</span>
                      </div>
                      <div className="text-[13px] font-semibold text-im-ink">
                        {formatCurrency(list.estimatedBudget, list.currency)}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      <CreateListDrawer
        isOpen={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
        onCreate={handleCreateList}
      />

      {selectedList && (
        <ListDetailDrawer
          list={selectedList}
          onClose={() => setSelectedList(null)}
        />
      )}
    </>
  );
}

function ForecastCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent: "violet" | "pink" | "emerald" | "ink";
}) {
  // Clean, subtle, and professional themes matching INMIND OS
  const themes = {
    violet: {
      iconBg: "bg-im-violet/10",
      iconColor: "text-im-violet",
      labelColor: "text-im-violet",
    },
    pink: {
      iconBg: "bg-im-pink/10",
      iconColor: "text-im-pink",
      labelColor: "text-im-pink",
    },
    emerald: {
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      labelColor: "text-emerald-600",
    },
    ink: {
      iconBg: "bg-im-ink/5",
      iconColor: "text-im-ink",
      labelColor: "text-im-ink",
    },
  };

  const theme = themes[accent];

  return (
    <div className="im-card flex items-center gap-4 rounded-2xl p-5 transition-shadow hover:shadow-md">
      <div
        className={`grid size-12 shrink-0 place-items-center rounded-xl ${theme.iconBg} ${theme.iconColor}`}
      >
        <Icon className="size-5" strokeWidth={1.75} />
      </div>
      <div className="min-w-0">
        <p
          className={`text-[11px] font-semibold uppercase tracking-wider ${theme.labelColor} opacity-80 mb-1`}
        >
          {label}
        </p>
        <p className="text-[24px] font-semibold tracking-tight text-im-ink truncate">
          {value}
        </p>
      </div>
    </div>
  );
}
