// src/components/creators/FindInfluencersClient.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import { Search, Grid3x3, LayoutList, X, Loader2 } from "lucide-react";
import type {
  Creator,
  Platform,
  CreatorStatus,
  CreatorCategory,
} from "@/lib/mock-data/types";
import { CreatorCard } from "@/components/creators/CreatorCard";
import { Pagination } from "@/components/ui/pagination";
import { useToast } from "@/components/ui/toast";
import { useCreatorsStore } from "@/lib/store/creatorsStore";
import {
  DiscoveryFilterBar,
  AdvancedFiltersModal,
  countAdvancedFilters,
} from "@/components/discovery/AdvancedFilters";

type SortKey = "relevance" | "followers" | "engagement" | "avgViews";
type ViewMode = "grid" | "list";

// Explicitly typed to prevent 'never[]' inference on empty arrays.
// The advanced filters modal also stores extra keys (language, hidden likes,
// contacts, ...) on this object at runtime; they are read back by the modal.
type FilterState = {
  demographics: {
    audienceLocation: string;
    influencerLocation: string;
    audienceGender: string;
    influencerGender: string;
    minAge: string;
    maxAge: string;
    audienceType: string;
  };
  performance: {
    minFollowers: string;
    maxFollowers: string;
    minEngagement: string;
    maxEngagement: string;
    minReelsPlays: string;
    maxReelsPlays: string;
    minViews: string;
    maxViews: string;
    minSaves: string;
    maxSaves: string;
    minShares: string;
    maxShares: string;
  };
  content: {
    niche: string[];
    mentions: string[];
    interests: string[];
    keywords: string[];
    partnerships: string[];
    brands: string[];
  };
  account: {
    lastPost: string;
    accountType: string;
    onlyVerified: boolean;
    onlyCredible: boolean;
    excludePrivate: boolean;
    audience18Plus: boolean;
  };
};

const initialFilters: FilterState = {
  demographics: {
    audienceLocation: "",
    influencerLocation: "",
    audienceGender: "any",
    influencerGender: "any",
    minAge: "",
    maxAge: "",
    audienceType: "any",
  },
  performance: {
    minFollowers: "",
    maxFollowers: "",
    minEngagement: "",
    maxEngagement: "",
    minReelsPlays: "",
    maxReelsPlays: "",
    minViews: "",
    maxViews: "",
    minSaves: "",
    maxSaves: "",
    minShares: "",
    maxShares: "",
  },
  content: {
    niche: [],
    mentions: [],
    interests: [],
    keywords: [],
    partnerships: [],
    brands: [],
  },
  account: {
    lastPost: "any",
    accountType: "any",
    onlyVerified: false,
    onlyCredible: false,
    excludePrivate: false,
    audience18Plus: false,
  },
};

type ApiCreator = {
  id: string;
  name: string;
  handle: string | null;
  thumbnail: string | null;
  description: string;
  followers: number;
  avgViews: number;
  engagementRate: number;
  platform: "YouTube";
};

type YouTubeSearchResponse = {
  creators: ApiCreator[];
};

export function FindInfluencersClient({
  creators: initialCreators,
}: {
  creators: Creator[];
}) {
  const toast = useToast();
  const { addCreator } = useCreatorsStore();

  // --- Filter State ---
  const [query, setQuery] = useState("");
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [nicheLogic, setNicheLogic] = useState<"AND" | "OR" | "NOR">("OR");
  const [nicheTerms, setNicheTerms] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [lookalike1, setLookalike1] = useState("");
  const [lookalike2, setLookalike2] = useState("");

  // `advancedOpen` only controls the modal. Applied advanced filters live in
  // `filters` and stay active after the modal closes.
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const advancedCount = useMemo(() => countAdvancedFilters(filters), [filters]);

  // --- View & Pagination State ---
  const [sortKey, setSortKey] = useState<SortKey>("relevance");
  const [view, setView] = useState<ViewMode>("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // --- YouTube Search State ---
  const [isSearching, setIsSearching] = useState(false);
  const [youtubeCreators, setYoutubeCreators] = useState<Creator[]>([]);
  const [useMockData, setUseMockData] = useState(true);

  // Debounced search with real API fetch
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 3) {
        setIsSearching(true);
        try {
          const res = await fetch(
            `/api/youtube/search?q=${encodeURIComponent(query.trim())}&limit=15`,
          );

          if (!res.ok) {
            throw new Error(`API responded with status: ${res.status}`);
          }

          const text = await res.text();
          let data: YouTubeSearchResponse;

          try {
            data = JSON.parse(text);
          } catch (parseError) {
            console.error(
              "❌ API returned HTML instead of JSON. Response preview:",
              text.substring(0, 200),
            );
            throw new Error("Invalid JSON response from server");
          }

          if (data.creators && data.creators.length > 0) {
            const mapped: Creator[] = data.creators.map((c: ApiCreator) => {
              const newCreator: Creator = {
                id: c.id,
                name: c.name,
                handle:
                  c.handle || `@${c.name.toLowerCase().replace(/\s+/g, "")}`,
                avatarInitials: c.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase(),
                avatarUrl: c.thumbnail || undefined,
                platform: c.platform,
                followers: c.followers,
                engagementRate: c.engagementRate,
                location: "Global",
                country: "Global",
                status: "Available" as CreatorStatus,
                category: "Tech" as CreatorCategory, // Default fallback, can be updated if API provides it
                verified: c.followers > 100000,
                avgViews: c.avgViews,
                bio: c.description || "No description available.",
              };

              addCreator(newCreator);
              return newCreator;
            });
            setYoutubeCreators(mapped);
            setUseMockData(false);
          } else {
            setUseMockData(true);
          }
        } catch (err) {
          console.error("YouTube search failed:", err);
          setUseMockData(true);
          toast.error(
            "Search failed",
            "Could not reach YouTube. Showing local data.",
          );
        } finally {
          setIsSearching(false);
        }
      } else {
        setUseMockData(true);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [query, toast, addCreator]);

  const activeCreators = useMockData ? initialCreators : youtubeCreators;

  // --- Complex Filtering Logic ---
  const filtered = useMemo(() => {
    let list = [...activeCreators];

    // 1. Text Search (only apply if using mock data, API handles its own search)
    if (query.trim() && useMockData) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.handle.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q),
      );
    }

    // 2. Platform Multi-Select
    if (platforms.length > 0) {
      list = list.filter((c) => platforms.includes(c.platform));
    }

    // 3. Niche Logic (AND / OR / NOR)
    if (nicheTerms.length > 0) {
      list = list.filter((c) => {
        const creatorText = `${c.category} ${c.bio}`.toLowerCase();
        const matches = nicheTerms.map((term) =>
          creatorText.includes(term.toLowerCase()),
        );

        if (nicheLogic === "AND") return matches.every(Boolean);
        if (nicheLogic === "OR") return matches.some(Boolean);
        if (nicheLogic === "NOR") return !matches.some(Boolean);
        return true;
      });
    }

    // 4. Topics (Hashtags in bio or category)
    if (topics.length > 0) {
      list = list.filter((c) => {
        const creatorText = `${c.category} ${c.bio}`.toLowerCase();
        return topics.some((t) => creatorText.includes(t.toLowerCase()));
      });
    }

    // 5. Lookalikes
    if (lookalike1 || lookalike2) {
      const targets = ([lookalike1, lookalike2] as string[])
        .filter((s): s is string => Boolean(s))
        .map((s) => s.replace("@", "").toLowerCase());

      list = list.filter((c) =>
        targets.some(
          (t) =>
            c.handle.toLowerCase().includes(t) ||
            c.name.toLowerCase().includes(t),
        ),
      );
    }

    // 6. Advanced Filters (always applied; each one is a no-op when empty)
    // Demographics
    if (filters.demographics.influencerLocation) {
      const loc = filters.demographics.influencerLocation.toLowerCase();
      list = list.filter(
        (c) =>
          c.country.toLowerCase().includes(loc) ||
          c.location.toLowerCase().includes(loc),
      );
    }

    // Performance
    if (filters.performance.minFollowers) {
      list = list.filter(
        (c) => c.followers >= Number(filters.performance.minFollowers),
      );
    }
    if (filters.performance.maxFollowers) {
      list = list.filter(
        (c) => c.followers <= Number(filters.performance.maxFollowers),
      );
    }
    if (filters.performance.minEngagement) {
      list = list.filter(
        (c) => c.engagementRate >= Number(filters.performance.minEngagement),
      );
    }
    if (filters.performance.maxEngagement) {
      list = list.filter(
        (c) => c.engagementRate <= Number(filters.performance.maxEngagement),
      );
    }
    if (filters.performance.minViews) {
      list = list.filter(
        (c) => c.avgViews >= Number(filters.performance.minViews),
      );
    }
    if (filters.performance.maxViews) {
      list = list.filter(
        (c) => c.avgViews <= Number(filters.performance.maxViews),
      );
    }

    // Content
    if (filters.content.mentions.length > 0) {
      list = list.filter((c) =>
        filters.content.mentions.some((m) =>
          c.handle.toLowerCase().includes(m.replace("@", "").toLowerCase()),
        ),
      );
    }
    if (filters.content.keywords.length > 0) {
      list = list.filter((c) => {
        const bio = (c.bio || "").toLowerCase();
        return filters.content.keywords.some((k) =>
          bio.includes(k.toLowerCase()),
        );
      });
    }

    // Account
    if (filters.account.onlyVerified) {
      list = list.filter((c) => c.verified);
    }

    // 7. Sorting
    switch (sortKey) {
      case "followers":
        list.sort((a, b) => b.followers - a.followers);
        break;
      case "engagement":
        list.sort((a, b) => b.engagementRate - a.engagementRate);
        break;
      case "avgViews":
        list.sort((a, b) => b.avgViews - a.avgViews);
        break;
    }

    return list;
  }, [
    activeCreators,
    useMockData,
    query,
    platforms,
    nicheLogic,
    nicheTerms,
    topics,
    lookalike1,
    lookalike2,
    filters,
    sortKey,
  ]);

  const paginatedCreators = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const activeCount =
    platforms.length +
    nicheTerms.length +
    topics.length +
    (lookalike1 ? 1 : 0) +
    (lookalike2 ? 1 : 0) +
    advancedCount;

  const clearAll = () => {
    setQuery("");
    setPlatforms([]);
    setNicheTerms([]);
    setTopics([]);
    setLookalike1("");
    setLookalike2("");
    setFilters(initialFilters);
    setSortKey("relevance");
    setCurrentPage(1);
    setUseMockData(true);
  };

  const handleSaveList = () => {
    if (filtered.length === 0) {
      toast.warning(
        "No creators to save",
        "Adjust your filters to find creators first.",
      );
      return;
    }
    toast.success(
      "List saved",
      `${filtered.length} creator${filtered.length === 1 ? "" : "s"} saved to your shortlist.`,
    );
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-im-pink/10 px-2.5 py-1 text-[11px] font-medium text-im-pink">
              <span className="size-1.5 rounded-full bg-im-pink" />
              Discovery
            </span>
            <h1 className="mt-3 text-[34px] leading-none font-semibold tracking-tight">
              Creator Discovery
            </h1>
            <p className="mt-3 text-[14px] text-im-muted">
              {useMockData
                ? "Search vetted creators across Africa. Use advanced filters to find your perfect match."
                : `Found real YouTube channels matching "${query}"`}
            </p>
          </div>
          <button
            onClick={handleSaveList}
            className="rounded-2xl bg-im-ink px-5 py-3 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            Save as list ({filtered.length})
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="im-card flex h-12.5 min-w-0 flex-1 items-center gap-3 rounded-2xl px-4 relative">
            <Search className="size-4 shrink-0 text-im-muted" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search YouTube channels, names, or handles..."
              className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-im-muted/70"
            />
            {isSearching && (
              <Loader2 className="size-4 animate-spin text-im-violet" />
            )}
            {query && !isSearching && (
              <button
                onClick={() => {
                  setQuery("");
                  setUseMockData(true);
                }}
                className="grid size-6 place-items-center rounded-full hover:bg-black/5"
                aria-label="Clear search"
              >
                <X className="size-3.5 text-im-muted" />
              </button>
            )}
          </label>

          {/* Sort & View Toggles */}
          <div className="flex items-center gap-2">
            <div className="im-card flex h-12.5 items-center gap-1 rounded-2xl p-1">
              {(["relevance", "followers", "engagement"] as SortKey[]).map(
                (key) => (
                  <button
                    key={key}
                    onClick={() => setSortKey(key)}
                    className={`hidden rounded-xl px-3 py-1.5 text-[12px] font-medium transition-colors sm:block ${
                      sortKey === key
                        ? "bg-im-ink text-white"
                        : "text-im-muted hover:text-im-ink"
                    }`}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </button>
                ),
              )}
            </div>
            <div className="im-card flex h-12.5 items-center gap-1 rounded-2xl p-1">
              <button
                onClick={() => setView("grid")}
                className={`grid size-10 place-items-center rounded-xl transition-colors ${
                  view === "grid"
                    ? "bg-im-ink text-white"
                    : "text-im-muted hover:text-im-ink"
                }`}
                aria-label="Grid view"
              >
                <Grid3x3 className="size-4" strokeWidth={1.75} />
              </button>
              <button
                onClick={() => setView("list")}
                className={`grid size-10 place-items-center rounded-xl transition-colors ${
                  view === "list"
                    ? "bg-im-ink text-white"
                    : "text-im-muted hover:text-im-ink"
                }`}
                aria-label="List view"
              >
                <LayoutList className="size-4" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Filter Bar */}
        <DiscoveryFilterBar
          platforms={platforms}
          setPlatforms={setPlatforms}
          nicheLogic={nicheLogic}
          setNicheLogic={setNicheLogic}
          nicheTerms={nicheTerms}
          setNicheTerms={setNicheTerms}
          topics={topics}
          setTopics={setTopics}
          lookalike1={lookalike1}
          setLookalike1={setLookalike1}
          lookalike2={lookalike2}
          setLookalike2={setLookalike2}
          isAdvanced={advancedCount > 0}
          setIsAdvanced={setAdvancedOpen}
          activeCount={activeCount}
          onClearAll={clearAll}
        />

        {/* Results */}
        {filtered.length === 0 && !isSearching ? (
          <div className="im-card mt-6 flex flex-col items-center justify-center rounded-3xl px-6 py-16 text-center">
            <div className="grid size-14 place-items-center rounded-2xl bg-im-surface">
              <Search className="size-6 text-im-muted" strokeWidth={1.75} />
            </div>
            <h3 className="mt-4 text-[16px] font-semibold text-im-ink">
              No creators match
            </h3>
            <p className="mt-2 max-w-sm text-[13px] text-im-muted">
              Try adjusting your filters or search terms to discover more
              creators.
            </p>
            <button
              onClick={clearAll}
              className="mt-5 rounded-xl bg-im-ink px-4 py-2.5 text-[13px] font-semibold text-white hover:opacity-90"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <>
            {view === "grid" ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {paginatedCreators.map((c) => (
                  <CreatorCard key={c.id} creator={c} view="grid" />
                ))}
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {paginatedCreators.map((c) => (
                  <CreatorCard key={c.id} creator={c} view="list" />
                ))}
              </div>
            )}

            {!useMockData ? null : (
              <Pagination
                currentPage={currentPage}
                totalItems={filtered.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
              />
            )}
          </>
        )}
      </div>

      {/* Advanced Filters Modal */}
      <AdvancedFiltersModal
        isOpen={advancedOpen}
        onClose={() => setAdvancedOpen(false)}
        filters={filters}
        setFilters={setFilters}
        matchingCount={filtered.length}
        shared={{
          nicheTerms,
          setNicheTerms,
          nicheLogic,
          setNicheLogic,
          topics,
          setTopics,
          lookalike1,
          setLookalike1,
          lookalike2,
          setLookalike2,
        }}
        onApply={() => {
          setAdvancedOpen(false);
          setCurrentPage(1); // Reset to page 1 when applying new filters
        }}
      />
    </>
  );
}
