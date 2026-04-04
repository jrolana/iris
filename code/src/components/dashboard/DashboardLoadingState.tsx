import { cn } from "@/lib/utils";

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-lg bg-gray-200", className)} />
  );
}

export default function DashboardLoadingState() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
        <div className="mt-3 mb-2 lg:col-span-6">
          <SkeletonBlock className="h-8 w-64" />
        </div>

        <div className="relative mt-3 mb-2 flex justify-end lg:col-span-6">
          <SkeletonBlock className="h-10 w-28 rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 lg:col-span-12">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0 space-y-2">
              <SkeletonBlock className="h-5 w-40" />
              <SkeletonBlock className="h-4 w-80 max-w-full" />
            </div>

            <div className="flex flex-wrap gap-2">
              <SkeletonBlock className="h-10 w-28 rounded-full" />
              <SkeletonBlock className="h-10 w-28 rounded-full" />
              <SkeletonBlock className="h-10 w-28 rounded-full" />
              <SkeletonBlock className="h-10 w-28 rounded-full" />
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-4 border-t border-gray-100 pt-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="min-w-[140px] space-y-2">
                <SkeletonBlock className="h-3 w-12" />
                <SkeletonBlock className="h-10 w-full rounded-xl" />
              </div>

              <div className="min-w-[140px] space-y-2">
                <SkeletonBlock className="h-3 w-8" />
                <SkeletonBlock className="h-10 w-full rounded-xl" />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <SkeletonBlock className="h-10 w-36 rounded-full" />
              <SkeletonBlock className="h-10 w-36 rounded-full" />
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-2 lg:col-span-12">
          <SkeletonBlock className="h-6 w-64" />
          <SkeletonBlock className="h-4 w-96 max-w-full" />
        </div>

        <div className="lg:col-span-12">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <SkeletonBlock className="h-5 w-32" />
                <SkeletonBlock className="mt-2 h-4 w-72 max-w-full" />
                <SkeletonBlock className="mx-auto mt-6 h-64 w-64 rounded-full" />
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <SkeletonBlock className="h-5 w-28" />
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <SkeletonBlock className="h-24 rounded-2xl" />
                  <SkeletonBlock className="h-24 rounded-2xl" />
                  <SkeletonBlock className="h-24 rounded-2xl" />
                  <SkeletonBlock className="h-24 rounded-2xl" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 lg:col-span-12">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SkeletonBlock className="h-[360px] rounded-2xl" />
            <SkeletonBlock className="h-[360px] rounded-2xl" />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <SkeletonBlock className="h-[360px] rounded-2xl" />
            <SkeletonBlock className="h-[360px] rounded-2xl" />
            <SkeletonBlock className="h-[360px] rounded-2xl" />
          </div>
        </div>

        <div className="space-y-2 border-t border-gray-100 pt-6 lg:col-span-12">
          <SkeletonBlock className="h-8 w-72" />
        </div>

        <div className="lg:col-span-4">
          <SkeletonBlock className="h-[380px] rounded-2xl" />
        </div>
        <div className="lg:col-span-4">
          <SkeletonBlock className="h-[380px] rounded-2xl" />
        </div>
        <div className="lg:col-span-4">
          <SkeletonBlock className="h-[380px] rounded-2xl" />
        </div>

        <div className="my-2 flex items-center space-x-3 lg:col-span-12">
          <span className="h-px flex-1 bg-gray-300"></span>
          <SkeletonBlock className="h-6 w-48" />
          <span className="h-px flex-1 bg-gray-300"></span>
        </div>

        <div className="lg:col-span-6">
          <SkeletonBlock className="h-[380px] rounded-2xl" />
        </div>
        <div className="lg:col-span-6">
          <SkeletonBlock className="h-[380px] rounded-2xl" />
        </div>

        <div className="mt-2 border-t border-gray-100 pt-6 lg:col-span-12">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <SkeletonBlock className="h-6 w-56" />
            <div className="mt-4 space-y-3">
              <SkeletonBlock className="h-12 w-full rounded-xl" />
              <SkeletonBlock className="h-12 w-full rounded-xl" />
              <SkeletonBlock className="h-12 w-full rounded-xl" />
              <SkeletonBlock className="h-12 w-full rounded-xl" />
              <SkeletonBlock className="h-12 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}