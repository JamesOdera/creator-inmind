// src/app/(os)/discovery/page.tsx
import type { Metadata } from "next";
import { FindInfluencersClient } from "@/components/creators/FindInfluencersClient";
import { mockCreators } from "@/lib/mock-data/creators";

export const metadata: Metadata = { title: "Creator Discovery" };

export default function DiscoveryPage() {
  return <FindInfluencersClient creators={mockCreators} />;
}
