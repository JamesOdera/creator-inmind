// src/lib/mock-data/types.ts
export type Platform = "Instagram" | "TikTok" | "YouTube" | "X";
export type CreatorStatus = "Available" | "Busy" | "Contracted";
export type CreatorCategory =
  | "Lifestyle"
  | "Tech"
  | "Beauty"
  | "Fitness"
  | "Food"
  | "Travel"
  | "Fashion"
  | "Business";

export type Creator = {
  id: string;
  name: string;
  handle: string;
  avatarInitials: string;
  avatarUrl?: string;
  platform: Platform;
  followers: number;
  engagementRate: number;
  location: string;
  country: string;
  status: CreatorStatus;
  category: CreatorCategory;
  verified: boolean;
  avgViews: number;
  bio: string;
};

export type DeliverableStatus = "changes" | "submitted" | "approved";

export type Deliverable = {
  id: string;
  title: string;
  meta: string;
  status: DeliverableStatus;
  action: string;
  primary: boolean;
};

export type Campaign = {
  id: string;
  name: string;
  brand: string;
  budget: string;
  status: "Draft" | "Active" | "Completed";
  deliverablesCount: number;
};
