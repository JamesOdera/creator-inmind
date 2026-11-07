// src/app/(os)/campaigns/[id]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  DollarSign,
  Users,
  FileText,
  CheckCircle2,
  Clock,
  Tag,
  Hash,
  AtSign,
  Shield,
  Handshake,
  Calendar,
} from "lucide-react";
import {
  mockCampaigns,
  statusConfig,
  durationConfig,
} from "@/lib/mock-data/campaigns";
import { Card } from "@/components/ui/card";
import { Button, buttonStyles } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const campaign = mockCampaigns.find((c) => c.id === id);
  return { title: campaign ? `${campaign.name} · Campaign` : "Campaign" };
}

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = mockCampaigns.find((c) => c.id === id);

  if (!campaign) notFound();

  const status = statusConfig[campaign.status];
  const duration = durationConfig[campaign.duration];

  const formatCurrency = (amount: number, currency: string) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);

  // Mock progress calculation
  const spent = campaign.budget * 0.65;
  const progress = campaign.noBudget ? 0 : (spent / campaign.budget) * 100;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        href="/campaigns"
        className="inline-flex items-center gap-2 text-[13px] font-medium text-im-muted hover:text-im-ink transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to Campaigns
      </Link>

      {/* Header with Logo */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <img
            src={campaign.logoUrl}
            alt={`${campaign.brand} logo`}
            className="size-16 rounded-2xl object-cover border border-black/6 bg-im-surface shrink-0"
          />
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-[28px] font-semibold tracking-tight text-im-ink">
                {campaign.name}
              </h1>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase ${status.cls}`}
              >
                {status.label}
              </span>
            </div>
            <p className="text-[15px] text-im-muted">
              {campaign.brand} · {campaign.startDate} to {campaign.endDate}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2">
            <FileText className="size-4" />
            Export Report
          </Button>
          <Button variant="primary" className="gap-2">
            Edit Campaign
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column (2/3) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Budget Tracking */}
          {!campaign.noBudget && (
            <Card padding="md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] font-semibold text-im-ink flex items-center gap-2">
                  <DollarSign className="size-4 text-im-violet" />
                  Budget Tracking
                </h3>
                <span className="text-[13px] text-im-muted">
                  {formatCurrency(spent, campaign.currency)} of{" "}
                  {formatCurrency(campaign.budget, campaign.currency)} spent
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-im-surface overflow-hidden">
                <div
                  className="h-full rounded-full bg-im-violet transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-[12px] text-im-muted">
                <span>{progress.toFixed(0)}% utilized</span>
                <span>
                  {formatCurrency(campaign.budget - spent, campaign.currency)}{" "}
                  remaining
                </span>
              </div>
            </Card>
          )}

          {/* Campaign Brief & Goals */}
          <Card padding="md">
            <h3 className="text-[15px] font-semibold text-im-ink mb-4 flex items-center gap-2">
              <FileText className="size-4 text-im-violet" />
              Campaign Brief
            </h3>

            <div className="space-y-5">
              <div>
                <h4 className="text-[13px] font-medium text-im-ink mb-2">
                  About the Brand
                </h4>
                <p className="text-[14px] leading-relaxed text-im-ink/80">
                  {campaign.brandDescription ||
                    "No brand description provided."}
                </p>
              </div>

              <div className="h-px bg-black/6" />

              <div>
                <h4 className="text-[13px] font-medium text-im-ink mb-2">
                  Goals & Objectives
                </h4>
                <p className="text-[14px] leading-relaxed text-im-ink/80">
                  {campaign.campaignGoals ||
                    campaign.description ||
                    "No goals specified."}
                </p>
              </div>
            </div>
          </Card>

          {/* Content Tracking */}
          {(campaign.keywords.length > 0 ||
            campaign.hashtags.length > 0 ||
            campaign.mentions.length > 0) && (
            <Card padding="md">
              <h3 className="text-[15px] font-semibold text-im-ink mb-4 flex items-center gap-2">
                <Tag className="size-4 text-im-violet" />
                Content Tracking
              </h3>

              <div className="grid sm:grid-cols-3 gap-6">
                {campaign.keywords.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="size-3.5 text-im-muted" />
                      <span className="text-[12px] font-medium text-im-muted uppercase tracking-wider">
                        Keywords
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {campaign.keywords.map((kw, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-im-surface text-[12px] font-medium text-im-ink"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {campaign.hashtags.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Hash className="size-3.5 text-im-muted" />
                      <span className="text-[12px] font-medium text-im-muted uppercase tracking-wider">
                        Hashtags
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {campaign.hashtags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-im-violet/10 text-[12px] font-medium text-im-violet"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {campaign.mentions.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <AtSign className="size-3.5 text-im-muted" />
                      <span className="text-[12px] font-medium text-im-muted uppercase tracking-wider">
                        Mentions
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {campaign.mentions.map((mention, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-im-pink/10 text-[12px] font-medium text-im-pink"
                        >
                          {mention}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Deliverables Overview */}
          <Card padding="md">
            <h3 className="text-[15px] font-semibold text-im-ink mb-4 flex items-center gap-2">
              <CheckCircle2 className="size-4 text-im-violet" />
              Deliverables Pipeline
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <PipelineStat
                icon={Clock}
                label="Pending Review"
                value="3"
                color="text-amber-600"
                bg="bg-amber-50"
              />
              <PipelineStat
                icon={FileText}
                label="In Progress"
                value="5"
                color="text-im-violet"
                bg="bg-im-violet/10"
              />
              <PipelineStat
                icon={CheckCircle2}
                label="Approved"
                value="4"
                color="text-emerald-600"
                bg="bg-emerald-50"
              />
            </div>
          </Card>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-6">
          {/* Campaign Settings */}
          <Card padding="md">
            <h3 className="text-[15px] font-semibold text-im-ink mb-4 flex items-center gap-2">
              <Shield className="size-4 text-im-violet" />
              Campaign Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="size-4 text-im-muted mt-0.5 shrink-0" />
                <div>
                  <p className="text-[12px] text-im-muted">Duration</p>
                  <p className="text-[14px] font-medium text-im-ink">
                    {duration.label}
                  </p>
                  <p className="text-[11px] text-im-muted">
                    {duration.description}
                  </p>
                </div>
              </div>

              <div className="h-px bg-black/6" />

              <div className="flex items-start gap-3">
                <Handshake className="size-4 text-im-muted mt-0.5 shrink-0" />
                <div>
                  <p className="text-[12px] text-im-muted">Negotiation</p>
                  <p className="text-[14px] font-medium text-im-ink">
                    {campaign.allowNegotiation
                      ? "Open to negotiation"
                      : "Fixed budget only"}
                  </p>
                </div>
              </div>

              <div className="h-px bg-black/6" />

              <div className="flex items-start gap-3">
                <Shield className="size-4 text-im-muted mt-0.5 shrink-0" />
                <div>
                  <p className="text-[12px] text-im-muted">Content Approval</p>
                  <p className="text-[14px] font-medium text-im-ink">
                    {campaign.requiresApproval
                      ? "Manual review required"
                      : "Quick approval"}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Assigned Creators */}
          <Card padding="md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-semibold text-im-ink flex items-center gap-2">
                <Users className="size-4 text-im-violet" />
                Creators
              </h3>
              <button
                className={`text-[12px] font-medium text-im-violet hover:underline ${buttonStyles("secondary", "px-2 py-1 h-auto text-[12px]")}`}
              >
                + Add
              </button>
            </div>

            {campaign.creatorsCount === 0 ? (
              <div className="text-center py-6 bg-im-surface/50 rounded-2xl border border-dashed border-black/10">
                <p className="text-[13px] text-im-muted">
                  No creators assigned yet.
                </p>
                <button
                  className={`mt-3 ${buttonStyles("secondary", "text-[12px] py-1.5")}`}
                >
                  Browse Discovery
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Mock creator list for active campaigns */}
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-im-surface transition-colors cursor-pointer"
                  >
                    <span className="grid size-9 place-items-center rounded-full bg-linear-to-br from-im-pink to-im-violet text-white text-[11px] font-semibold">
                      C{i}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium text-im-ink truncate">
                        Creator Name {i}
                      </p>
                      <p className="text-[11px] text-im-muted">
                        2 deliverables pending
                      </p>
                    </div>
                  </div>
                ))}
                <button
                  className={`w-full mt-2 ${buttonStyles("secondary", "text-[12px] py-2")}`}
                >
                  View all {campaign.creatorsCount} creators
                </button>
              </div>
            )}
          </Card>

          {/* Quick Actions */}
          <Card padding="md" className="bg-im-surface/50 border-dashed">
            <h3 className="text-[15px] font-semibold text-im-ink mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2.5 rounded-xl text-[13px] font-medium text-im-ink hover:bg-white transition-colors">
                Pause Campaign
              </button>
              <button className="w-full text-left px-3 py-2.5 rounded-xl text-[13px] font-medium text-rose-600 hover:bg-rose-50 transition-colors">
                Archive Campaign
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PipelineStat({
  icon: Icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
  bg: string;
}) {
  return (
    <div className={`flex items-center gap-3 p-4 rounded-2xl ${bg}`}>
      <div
        className={`grid size-10 place-items-center rounded-xl bg-white/60 ${color}`}
      >
        <Icon className="size-5" strokeWidth={1.75} />
      </div>
      <div>
        <p className={`text-[20px] font-semibold ${color}`}>{value}</p>
        <p className="text-[11px] text-im-muted uppercase tracking-wider">
          {label}
        </p>
      </div>
    </div>
  );
}
