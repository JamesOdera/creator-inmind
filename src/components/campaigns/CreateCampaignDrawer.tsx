// src/components/campaigns/CreateCampaignDrawer.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  Tag,
  Hash,
  AtSign,
  Check,
  Clock,
  Shield,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Input } from "@/components/form/input";
import { Textarea } from "@/components/form/textarea";
import { Select } from "@/components/form/select";
import { FileUpload } from "@/components/form/file-upload";
import { Card } from "@/components/ui/card";
import type {
  Campaign,
  CampaignStatus,
  CampaignDuration,
} from "@/lib/mock-data/campaigns";
import { durationConfig } from "@/lib/mock-data/campaigns";

type CreateCampaignDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: Omit<Campaign, "id">) => void;
  defaultDates: { start: string; end: string } | null;
};

type CampaignFormState = {
  name: string;
  brand: string;
  logoUrl: string;
  duration: CampaignDuration;
  startDate: string;
  endDate: string;
  keywords: string;
  hashtags: string;
  mentions: string;
  budget: string;
  currency: string;
  noBudget: boolean;
  allowNegotiation: boolean;
  brandDescription: string;
  campaignGoals: string;
  requiresApproval: boolean;
};

const initialFormState: CampaignFormState = {
  name: "",
  brand: "",
  logoUrl: "",
  duration: "medium",
  startDate: "",
  endDate: "",
  keywords: "",
  hashtags: "",
  mentions: "",
  budget: "",
  currency: "KES",
  noBudget: false,
  allowNegotiation: false,
  brandDescription: "",
  campaignGoals: "",
  requiresApproval: true,
};

const steps = [
  { id: 1, title: "Basic Info" },
  { id: 2, title: "Duration" },
  { id: 3, title: "Tracking" },
  { id: 4, title: "Budget" },
  { id: 5, title: "Brief" },
  { id: 6, title: "Settings" },
];

export function CreateCampaignDrawer({
  isOpen,
  onClose,
  onCreate,
  defaultDates,
}: CreateCampaignDrawerProps) {
  const toast = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CampaignFormState>(initialFormState);

  // Initialize dates when drawer opens
  useState(() => {
    if (isOpen && defaultDates) {
      setFormData((prev) => ({
        ...prev,
        startDate: defaultDates.start,
        endDate: defaultDates.end,
      }));
    }
  });

  const handleSubmit = () => {
    if (currentStep === 1) {
      if (!formData.name || !formData.brand) {
        toast.error(
          "Missing fields",
          "Please fill in campaign name and brand.",
        );
        return;
      }
    }

    if (currentStep === steps.length) {
      const payload: Omit<Campaign, "id"> = {
        name: formData.name,
        brand: formData.brand,
        logoUrl:
          formData.logoUrl ||
          `https://placehold.co/100x100/6366F1/FFFFFF?text=${formData.brand.substring(0, 2).toUpperCase()}`,
        budget: formData.noBudget ? 0 : Number(formData.budget) || 0,
        currency: formData.currency,
        startDate: formData.startDate,
        endDate: formData.endDate,
        description: formData.campaignGoals,
        status: "Draft" as CampaignStatus,
        creatorsCount: 0,
        deliverablesCount: 0,
        duration: formData.duration,
        keywords: formData.keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
        hashtags: formData.hashtags
          .split(",")
          .map((h) => h.trim())
          .filter(Boolean),
        mentions: formData.mentions
          .split(",")
          .map((m) => m.trim())
          .filter(Boolean),
        allowNegotiation: formData.allowNegotiation,
        noBudget: formData.noBudget,
        brandDescription: formData.brandDescription,
        campaignGoals: formData.campaignGoals,
        requiresApproval: formData.requiresApproval,
      };

      onCreate(payload);
      toast.success(
        "Campaign created",
        `${formData.name} has been saved as a draft.`,
      );
      setFormData(initialFormState);
      setCurrentStep(1);
      onClose();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-[16px] font-semibold text-im-ink mb-4">
                Campaign Details
              </h3>
              <div className="space-y-4">
                <Input
                  label="Campaign Name *"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Summer Launch 2024"
                />
                <Input
                  label="Brand / Client *"
                  required
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                  placeholder="e.g., Dairybest"
                />
              </div>
            </div>

            <div>
              <h3 className="text-[16px] font-semibold text-im-ink mb-4">
                Brand Logo
              </h3>
              <FileUpload
                value={formData.logoUrl}
                onChange={(value) =>
                  setFormData({ ...formData, logoUrl: value })
                }
                maxSize={5}
              />
              <p className="text-[11px] text-im-muted mt-2">
                Optional: Upload a logo or we'll generate one from your brand
                initials
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5">
            <div>
              <h3 className="text-[16px] font-semibold text-im-ink mb-2">
                Campaign Duration
              </h3>
              <p className="text-[13px] text-im-muted mb-4">
                How long will this campaign run?
              </p>
            </div>

            <div className="grid gap-3">
              {(Object.keys(durationConfig) as CampaignDuration[]).map(
                (duration) => (
                  <label
                    key={duration}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      formData.duration === duration
                        ? "border-im-violet bg-im-violet/5"
                        : "border-black/6 hover:border-black/10"
                    }`}
                  >
                    <input
                      type="radio"
                      name="duration"
                      value={duration}
                      checked={formData.duration === duration}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          duration: e.target.value as CampaignDuration,
                        })
                      }
                      className="size-5 text-im-violet focus:ring-im-violet"
                    />
                    <div className="flex-1">
                      <p className="text-[14px] font-semibold text-im-ink">
                        {durationConfig[duration].label}
                      </p>
                      <p className="text-[12px] text-im-muted">
                        {durationConfig[duration].description}
                      </p>
                    </div>
                    {formData.duration === duration && (
                      <div className="grid size-6 place-items-center rounded-full bg-im-violet">
                        <Check className="size-4 text-white" />
                      </div>
                    )}
                  </label>
                ),
              )}
            </div>

            <div className="pt-4 border-t border-black/6">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Start Date"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                />
                <Input
                  label="End Date"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-5">
            <div>
              <h3 className="text-[16px] font-semibold text-im-ink mb-2">
                Content Tracking
              </h3>
              <p className="text-[13px] text-im-muted mb-4">
                What should we track for this campaign? (comma-separated)
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-[13px] font-medium text-im-ink mb-2">
                  <Tag className="size-4 text-im-violet" />
                  Keywords
                </label>
                <Input
                  value={formData.keywords}
                  onChange={(e) =>
                    setFormData({ ...formData, keywords: e.target.value })
                  }
                  placeholder="e.g., tea, morning, breakfast"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-[13px] font-medium text-im-ink mb-2">
                  <Hash className="size-4 text-im-violet" />
                  Hashtags
                </label>
                <Input
                  value={formData.hashtags}
                  onChange={(e) =>
                    setFormData({ ...formData, hashtags: e.target.value })
                  }
                  placeholder="e.g., #SummerVibes, #BrandLaunch"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-[13px] font-medium text-im-ink mb-2">
                  <AtSign className="size-4 text-im-violet" />
                  Mentions
                </label>
                <Input
                  value={formData.mentions}
                  onChange={(e) =>
                    setFormData({ ...formData, mentions: e.target.value })
                  }
                  placeholder="e.g., @brandname, @handle"
                />
              </div>
            </div>

            <Card padding="sm" className="bg-im-surface/50 border-dashed">
              <p className="text-[12px] text-im-muted text-center">
                Fill at least one field to enable content tracking for posts,
                stories, and reels
              </p>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-5">
            <div>
              <h3 className="text-[16px] font-semibold text-im-ink mb-2">
                Budget Settings
              </h3>
              <p className="text-[13px] text-im-muted">
                Set your campaign budget and negotiation preferences
              </p>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all">
                <input
                  type="checkbox"
                  checked={formData.noBudget}
                  onChange={(e) =>
                    setFormData({ ...formData, noBudget: e.target.checked })
                  }
                  className="size-5 text-im-violet focus:ring-im-violet rounded"
                />
                <div className="flex-1">
                  <p className="text-[14px] font-semibold text-im-ink">
                    No budget specified
                  </p>
                  <p className="text-[12px] text-im-muted">
                    I don't have a clear budget at the moment
                  </p>
                </div>
              </label>

              {!formData.noBudget && (
                <div className="flex gap-3">
                  <div className="w-32">
                    <Select
                      label="Currency"
                      options={[
                        { value: "KES", label: "KES" },
                        { value: "USD", label: "USD" },
                        { value: "NGN", label: "NGN" },
                        { value: "ZAR", label: "ZAR" },
                      ]}
                      value={formData.currency}
                      onChange={(value) =>
                        setFormData({ ...formData, currency: value })
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      label="Budget Amount"
                      type="number"
                      value={formData.budget}
                      onChange={(e) =>
                        setFormData({ ...formData, budget: e.target.value })
                      }
                      placeholder="0.00"
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-black/6">
                <p className="text-[13px] font-medium text-im-ink mb-3">
                  Negotiation Settings
                </p>
                <div className="grid gap-3">
                  <label
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      formData.allowNegotiation
                        ? "border-im-violet bg-im-violet/5"
                        : "border-black/6"
                    }`}
                  >
                    <input
                      type="radio"
                      name="negotiation"
                      checked={formData.allowNegotiation}
                      onChange={() =>
                        setFormData({ ...formData, allowNegotiation: true })
                      }
                      className="size-5 text-im-violet focus:ring-im-violet"
                    />
                    <div className="flex-1">
                      <p className="text-[14px] font-semibold text-im-ink">
                        Open to negotiation
                      </p>
                      <p className="text-[12px] text-im-muted">
                        Influencers can propose their rates
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      !formData.allowNegotiation
                        ? "border-im-violet bg-im-violet/5"
                        : "border-black/6"
                    }`}
                  >
                    <input
                      type="radio"
                      name="negotiation"
                      checked={!formData.allowNegotiation}
                      onChange={() =>
                        setFormData({ ...formData, allowNegotiation: false })
                      }
                      className="size-5 text-im-violet focus:ring-im-violet"
                    />
                    <div className="flex-1">
                      <p className="text-[14px] font-semibold text-im-ink">
                        Fixed budget
                      </p>
                      <p className="text-[12px] text-im-muted">
                        Rate is non-negotiable
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-5">
            <div>
              <h3 className="text-[16px] font-semibold text-im-ink mb-2">
                Campaign Brief
              </h3>
              <p className="text-[13px] text-im-muted mb-4">
                Describe your brand and campaign objectives
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-im-ink mb-2">
                  Brand Description
                </label>
                <Textarea
                  rows={3}
                  value={formData.brandDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      brandDescription: e.target.value,
                    })
                  }
                  placeholder="What makes your brand unique?"
                  maxLength={500}
                />
                <p className="text-[11px] text-im-muted text-right mt-1">
                  {formData.brandDescription.length}/500
                </p>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-im-ink mb-2">
                  Campaign Goals & Tasks *
                </label>
                <Textarea
                  rows={4}
                  value={formData.campaignGoals}
                  onChange={(e) =>
                    setFormData({ ...formData, campaignGoals: e.target.value })
                  }
                  placeholder="Describe the core objectives and key features"
                  maxLength={1000}
                  required
                />
                <p className="text-[11px] text-im-muted text-right mt-1">
                  {formData.campaignGoals.length}/1000
                </p>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-5">
            <div>
              <h3 className="text-[16px] font-semibold text-im-ink mb-2">
                Campaign Settings
              </h3>
              <p className="text-[13px] text-im-muted">
                Configure approval and complexity settings
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[13px] font-medium text-im-ink mb-3">
                  Content Approval
                </p>
                <div className="grid gap-3">
                  <label
                    className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      formData.requiresApproval
                        ? "border-im-violet bg-im-violet/5"
                        : "border-black/6"
                    }`}
                  >
                    <input
                      type="radio"
                      name="approval"
                      checked={formData.requiresApproval}
                      onChange={() =>
                        setFormData({ ...formData, requiresApproval: true })
                      }
                      className="size-5 text-im-violet focus:ring-im-violet mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Shield className="size-4 text-im-violet" />
                        <p className="text-[14px] font-semibold text-im-ink">
                          Manual approval required
                        </p>
                      </div>
                      <p className="text-[12px] text-im-muted mt-1">
                        Review all content and manage deadlines before
                        publishing
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      !formData.requiresApproval
                        ? "border-im-violet bg-im-violet/5"
                        : "border-black/6"
                    }`}
                  >
                    <input
                      type="radio"
                      name="approval"
                      checked={!formData.requiresApproval}
                      onChange={() =>
                        setFormData({ ...formData, requiresApproval: false })
                      }
                      className="size-5 text-im-violet focus:ring-im-violet mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Clock className="size-4 text-im-violet" />
                        <p className="text-[14px] font-semibold text-im-ink">
                          Quick approval
                        </p>
                      </div>
                      <p className="text-[12px] text-im-muted mt-1">
                        Provide basic outline and approve content faster
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <Card padding="md" className="bg-im-surface/50">
                <div className="flex items-start gap-3">
                  <FileText className="size-5 text-im-violet shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[13px] font-medium text-im-ink">
                      Ready to launch?
                    </p>
                    <p className="text-[12px] text-im-muted mt-1">
                      Review all settings above before generating your campaign.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />

          {/* Right-Side Sliding Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-[#f4f4f7] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/6 bg-white shrink-0">
              <div>
                <h2 className="text-[20px] font-semibold text-im-ink">
                  Create Campaign
                </h2>
                <p className="text-[13px] text-im-muted mt-1">
                  Step {currentStep} of {steps.length}:{" "}
                  {steps[currentStep - 1].title}
                </p>
              </div>
              <button
                onClick={onClose}
                className="grid size-9 place-items-center rounded-xl hover:bg-black/5 transition-colors"
              >
                <X className="size-5 text-im-muted" />
              </button>
            </div>

            {/* Step Indicators */}
            <div className="px-6 py-4 bg-white border-b border-black/6 shrink-0">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center flex-1">
                    <div
                      className={`flex items-center justify-center size-8 rounded-full text-[12px] font-semibold transition-colors ${
                        step.id < currentStep
                          ? "bg-im-violet text-white"
                          : step.id === currentStep
                            ? "bg-im-ink text-white"
                            : "bg-im-surface text-im-muted"
                      }`}
                    >
                      {step.id < currentStep ? (
                        <Check className="size-4" />
                      ) : (
                        step.id
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`h-0.5 flex-1 mx-2 ${
                          step.id < currentStep
                            ? "bg-im-violet"
                            : "bg-im-surface"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-5 border-t border-black/6 bg-white shrink-0">
              <Button
                variant="secondary"
                onClick={
                  currentStep === 1
                    ? onClose
                    : () => setCurrentStep(currentStep - 1)
                }
                disabled={currentStep === 1}
                className="min-w-[100px]"
              >
                {currentStep === 1 ? "Cancel" : "Back"}
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                className="gap-2 min-w-[140px]"
              >
                {currentStep === steps.length ? (
                  <>
                    <Check className="size-4" />
                    Generate
                  </>
                ) : (
                  <>
                    Next Step
                    <Plus className="size-4 rotate-90" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
