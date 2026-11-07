import type { Metadata } from "next";
import Link from "next/link";
import { Compass } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import { StateIllustration, StatePanel } from "@/components/ui/empty-state";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <StatePanel>
      <StateIllustration icon={Compass} />
      <p className="im-text-gradient -mt-2 text-[56px] leading-none font-semibold tracking-tight">
        404
      </p>
      <h3 className="mt-3 text-[18px] font-medium text-im-ink">
        Page not found
      </h3>
      <p className="mt-2 max-w-105 text-[13.5px] leading-relaxed text-im-muted">
        The page {"you're"} looking for {"doesn't"} exist or has moved. Check
        the link, or head back to your workspace.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <Link href="/studio" className={buttonStyles("primary")}>
          Go to Studio
        </Link>
        <Link href="/find-influencers" className={buttonStyles("secondary")}>
          Find Influencers
        </Link>
      </div>
    </StatePanel>
  );
}
