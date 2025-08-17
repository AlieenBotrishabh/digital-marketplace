import { Skeleton } from "@/components/ui/skeleton";

// The main skeleton for the loading state:
export default function Loadingfile() {
  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-8 lg:grid lg:grid-cols-7 lg:gap-x-8 mt-10 animate-pulse">
      {/* Carousel Skeleton */}
      <div className="w-[600px] lg:col-span-4">
        <div className="relative w-[600px] h-[338px] rounded-lg bg-gray-100 mb-6">
          <Skeleton className="w-full h-full rounded-lg" />
        </div>
        <div className="flex flex-row items-center justify-between px-4">
          <Skeleton className="w-16 h-10 rounded-lg" />
          <Skeleton className="w-16 h-10 rounded-lg" />
        </div>
      </div>

      {/* Product info Skeleton */}
      <div className="lg:col-span-3 lg:flex lg:items-center lg:flex-col py-4 space-y-6 w-full">
        <Skeleton className="h-10 w-3/4 rounded-lg" />
        <Skeleton className="h-6 w-1/2 rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg mt-10" />
        
        {/* Info grid */}
        <div className="w-full border-t border-gray-200 mt-10 pt-10 space-y-3">
          <div className="grid grid-cols-2 w-full gap-y-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="border-t border-gray-200 mt-10" />
      </div>

      {/* Description Skeleton */}
      <div className="w-full max-w-2xl mx-auto mt-16 lg:max-w-none lg:mt-0 lg:col-span-4 space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-5/6" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-6 w-1/2" />
      </div>
    </section>
  );
}
