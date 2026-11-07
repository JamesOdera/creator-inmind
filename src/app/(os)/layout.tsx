// src/app/(os)/layout.tsx
import { Header } from "@/components/shell/Header";
import { Sidebar } from "@/components/shell/Sidebar";
import { MobileNavProvider } from "@/components/shell/MobileNavContext";
import { ToastProvider } from "@/components/ui/toast";
import { Suspense } from "react";

export default function OSLayout({ children }: { children: React.ReactNode }) {
  return (
    <MobileNavProvider>
      <ToastProvider>
        <div className="im-atmosphere h-dvh overflow-hidden">
          <div className="mx-auto flex h-full max-w-390">
            {/* Suspense boundary allows static prerendering of the route */}
            <Suspense
              fallback={<div className="hidden h-full w-64 shrink-0 lg:flex" />}
            >
              <Sidebar />
            </Suspense>

            <div className="flex min-w-0 flex-1 flex-col lg:pr-4">
              <div className="shrink-0">
                <Header />
              </div>

              <main className="im-scroll min-h-0 flex-1 overflow-y-auto px-4 pt-6 pb-10 lg:-mr-4 lg:pr-4 lg:pl-0">
                {children}
              </main>
            </div>
          </div>
        </div>
      </ToastProvider>
    </MobileNavProvider>
  );
}
