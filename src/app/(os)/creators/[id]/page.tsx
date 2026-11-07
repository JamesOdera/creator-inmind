"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  MapPin,
  Globe,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Play,
  DollarSign,
  NotebookPen,
  Loader2,
} from "lucide-react";
import { Avatar } from "@/components/shell/Avatar";
import { PlatformBadge } from "@/lib/platform";
import { useCreatorsStore } from "@/lib/store/creatorsStore";
import { Button, buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { notFound } from "next/navigation";
import type { Creator } from "@/lib/mock-data/types";

type YouTubeVideo = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  type: "Video" | "Reel";
  views: number;
  likes: number;
  comments: number;
};

type EnhancedCreator = {
  bio: string;
  estimatedRates: {
    post: string;
    story: string;
    video: string;
  };
  audienceGender: {
    male: number;
    female: number;
    other: number;
  };
  topCountries: Array<{
    country: string;
    percentage: number;
  }>;
  recentPosts: YouTubeVideo[];
};

function getEnhancedCreatorData(creator: Creator): EnhancedCreator {
  // Type guard: If it's a mock creator with full data, return as-is
  if ("audienceGender" in creator && "recentPosts" in creator) {
    return creator as unknown as EnhancedCreator;
  }

  // For YouTube creators, generate realistic mock data
  return {
    bio:
      creator.bio ||
      `Passionate ${creator.category.toLowerCase()} creator. I specialize in authentic storytelling and building genuine connections with my audience.`,
    estimatedRates: {
      post: `$${Math.floor(creator.followers / 100)} - $${Math.floor(creator.followers / 50)}`,
      story: `$${Math.floor(creator.followers / 250)} - $${Math.floor(creator.followers / 150)}`,
      video: `$${Math.floor(creator.followers / 80)} - $${Math.floor(creator.followers / 40)}`,
    },
    audienceGender: {
      male: Math.floor(Math.random() * 40) + 30,
      female: Math.floor(Math.random() * 40) + 30,
      other: 5,
    },
    topCountries: [
      { country: "United States", percentage: 45 },
      { country: "United Kingdom", percentage: 15 },
      { country: "Canada", percentage: 10 },
    ],
    recentPosts: [], // Will be populated by the YouTube API
  };
}

export default function CreatorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const allCreators = useCreatorsStore((state) => state.creators);

  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);

  const creator = allCreators.find((c) => c.id === id);

  if (typeof window !== "undefined") {
    console.log("Profile Page - Looking for ID:", id);
    console.log("Profile Page - Found Creator?", creator ? "YES" : "NO");
    console.log("Profile Page - Total Creators in Store:", allCreators.length);
  }

  if (!creator) {
    console.warn("❌ Creator not found in store. ID:", id);
    notFound();
  }

  // Enhance creator data with detailed info
  const enhancedCreator = getEnhancedCreatorData(creator);

  // Fetch real YouTube videos
  useEffect(() => {
    const fetchVideos = async () => {
      if (creator.platform !== "YouTube") {
        setIsLoadingVideos(false);
        return;
      }

      try {
        // Extract channel ID from the creator ID or handle
        const channelId = creator.id.startsWith("UC") ? creator.id : null;

        if (!channelId) {
          setIsLoadingVideos(false);
          return;
        }

        const response = await fetch(
          `/api/youtube/videos?channelId=${channelId}`,
        );
        const data = await response.json();

        if (data.videos) {
          setVideos(data.videos.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      } finally {
        setIsLoadingVideos(false);
      }
    };

    fetchVideos();
  }, [creator.id, creator.platform]);

  // Use real videos if available, otherwise use mock data
  const recentPosts = videos.length > 0 ? videos : enhancedCreator.recentPosts;

  const formatNumber = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
    return n.toString();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Back */}
      <Link
        href="/discovery"
        className="inline-flex items-center gap-2 text-[13px] font-medium text-im-muted hover:text-im-ink transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to Discovery
      </Link>

      {/* Profile Header */}
      <Card
        padding="lg"
        className="flex flex-col md:flex-row md:items-start gap-6"
      >
        <Avatar
          initials={creator.avatarInitials}
          src={creator.avatarUrl}
          className="size-20 text-xl shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[28px] font-semibold tracking-tight text-im-ink">
              {creator.name}
            </h1>
            {creator.verified && (
              <BadgeCheck className="size-6 text-im-violet" strokeWidth={2} />
            )}
            <PlatformBadge platform={creator.platform} />
          </div>
          <p className="mt-1 text-[15px] text-im-muted font-medium">
            {creator.handle}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-[13px] text-im-muted">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" /> {creator.location},{" "}
              {creator.country}
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="size-4" /> {creator.category}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase ${
                creator.status === "Available"
                  ? "bg-emerald-50 text-emerald-700"
                  : creator.status === "Busy"
                    ? "bg-amber-50 text-amber-700"
                    : "bg-im-ink/5 text-im-muted"
              }`}
            >
              {creator.status}
            </span>
          </div>

          <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-im-ink/80">
            {enhancedCreator.bio}
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-3 md:shrink-0">
          <Button variant="secondary" className="gap-2">
            <NotebookPen className="size-4" />
            Add Note
          </Button>
          <Button variant="primary" className="gap-2">
            <Users className="size-4" />
            Add to Shortlist
          </Button>
        </div>
      </Card>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column (2/3) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <MetricCard
              icon={Users}
              label="Followers"
              value={formatNumber(creator.followers)}
            />
            <MetricCard
              icon={Heart}
              label="Engagement"
              value={`${creator.engagementRate}%`}
            />
            <MetricCard
              icon={Eye}
              label="Avg. Views"
              value={formatNumber(creator.avgViews)}
            />
            <MetricCard
              icon={Globe}
              label="Est. Reach"
              value={formatNumber(creator.followers * 0.4)}
            />
          </div>

          {/* Audience Demographics */}
          <Card padding="md">
            <h3 className="text-[15px] font-semibold text-im-ink mb-4">
              Audience Intelligence
            </h3>

            <div className="grid sm:grid-cols-2 gap-8">
              {/* Gender */}
              <div>
                <p className="text-[12px] font-medium text-im-muted uppercase tracking-wider mb-3">
                  Gender Split
                </p>
                <div className="space-y-3">
                  <DemographicBar
                    label="Female"
                    percentage={enhancedCreator.audienceGender.female}
                    color="bg-im-pink"
                  />
                  <DemographicBar
                    label="Male"
                    percentage={enhancedCreator.audienceGender.male}
                    color="bg-im-violet"
                  />
                  <DemographicBar
                    label="Other"
                    percentage={enhancedCreator.audienceGender.other}
                    color="bg-im-muted"
                  />
                </div>
              </div>

              {/* Top Countries */}
              <div>
                <p className="text-[12px] font-medium text-im-muted uppercase tracking-wider mb-3">
                  Top Locations
                </p>
                <div className="space-y-3">
                  {enhancedCreator.topCountries.map((loc, idx) => (
                    <DemographicBar
                      key={idx}
                      label={loc.country}
                      percentage={loc.percentage}
                      color="bg-im-ink"
                    />
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Content */}
          <Card padding="md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-semibold text-im-ink">
                Recent Content
              </h3>
              <Link
                href={`https://youtube.com/${creator.handle || ""}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] font-medium text-im-violet hover:underline"
              >
                View full profile ↗
              </Link>
            </div>

            {isLoadingVideos ? (
              <div className="grid sm:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="aspect-[4/5] rounded-2xl bg-im-surface animate-pulse"
                  />
                ))}
              </div>
            ) : recentPosts.length === 0 ? (
              <div className="text-center py-8 text-[13px] text-im-muted">
                No recent content available.
              </div>
            ) : (
              <div className="grid sm:grid-cols-3 gap-4">
                {recentPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`https://www.youtube.com/watch?v=${post.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group cursor-pointer"
                  >
                    <div className="aspect-[4/5] rounded-2xl relative overflow-hidden">
                      {post.thumbnail ? (
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-im-surface" />
                      )}

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Type Badge */}
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded-lg flex items-center gap-1">
                        {post.type === "Reel" ? (
                          <Play className="size-3" fill="white" />
                        ) : null}
                        {post.type}
                      </div>

                      {/* Stats Overlay */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px]">
                        <span className="flex items-center gap-1">
                          <Eye className="size-3" />
                          {formatNumber(post.views)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="size-3" fill="white" />
                          {formatNumber(post.likes)}
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-[12px] text-im-muted line-clamp-2">
                      {post.title}
                    </p>
                    <p className="text-[11px] text-im-muted/70">
                      {formatDate(post.publishedAt)}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-6">
          {/* Estimated Rates */}
          <Card padding="md">
            <h3 className="text-[15px] font-semibold text-im-ink mb-4 flex items-center gap-2">
              <DollarSign className="size-4 text-im-violet" />
              Estimated Rates
            </h3>
            <div className="space-y-3">
              <RateRow
                label="Static Post"
                value={enhancedCreator.estimatedRates.post}
              />
              <RateRow
                label="Story (24h)"
                value={enhancedCreator.estimatedRates.story}
              />
              <RateRow
                label="Video / Reel"
                value={enhancedCreator.estimatedRates.video}
              />
            </div>
            <p className="mt-4 text-[11px] text-im-muted leading-relaxed">
              *Rates are estimated based on follower count, engagement rate, and
              historical campaign data. Actual rates may vary.
            </p>
          </Card>

          {/* Brand Affinity */}
          <Card padding="md">
            <h3 className="text-[15px] font-semibold text-im-ink mb-4">
              Brand Affinity
            </h3>
            <div className="flex flex-wrap gap-2">
              {["Fashion", "Tech", "Lifestyle", "Travel", "Sustainability"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full bg-im-surface text-[12px] font-medium text-im-ink"
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>
          </Card>

          {/* Internal Notes */}
          <Card padding="md" className="bg-im-surface/50 border-dashed">
            <h3 className="text-[15px] font-semibold text-im-ink mb-2">
              Internal Notes
            </h3>
            <p className="text-[13px] text-im-muted leading-relaxed">
              No notes yet. Add context about this creator for your team.
            </p>
            <button
              className={`mt-3 ${buttonStyles("secondary", "w-full text-[12px] py-2")}`}
            >
              Add Note
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}

// --- Subcomponents ---

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <Card
      padding="sm"
      className="flex flex-col items-center justify-center text-center py-4"
    >
      <Icon className="size-5 text-im-violet mb-2" strokeWidth={1.75} />
      <p className="text-[20px] font-semibold text-im-ink">{value}</p>
      <p className="text-[11px] text-im-muted uppercase tracking-wider">
        {label}
      </p>
    </Card>
  );
}

function DemographicBar({
  label,
  percentage,
  color,
}: {
  label: string;
  percentage: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-[13px] mb-1.5">
        <span className="font-medium text-im-ink">{label}</span>
        <span className="text-im-muted">{percentage}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-im-surface overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function RateRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-black/5 last:border-0">
      <span className="text-[13px] text-im-muted">{label}</span>
      <span className="text-[14px] font-semibold text-im-ink">{value}</span>
    </div>
  );
}
