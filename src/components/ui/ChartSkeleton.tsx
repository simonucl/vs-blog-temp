interface ChartSkeletonProps {
  height?: number;
  title?: string;
}

export default function ChartSkeleton({
  height = 400,
  title,
}: ChartSkeletonProps) {
  return (
    <div className="w-full animate-pulse">
      {title && (
        <div className="mb-4">
          <div className="h-6 bg-slate-200 rounded w-1/3"></div>
          <div className="h-4 bg-slate-100 rounded w-2/3 mt-2"></div>
        </div>
      )}

      <div
        className="bg-slate-100 rounded-lg relative"
        style={{ height: `${height}px` }}
      >
        {/* Y-axis simulation */}
        <div className="absolute left-4 top-8 bottom-8 w-8 flex flex-col justify-between">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-2 bg-slate-200 rounded"></div>
          ))}
        </div>

        {/* X-axis simulation */}
        <div className="absolute left-16 right-4 bottom-4 h-8 flex justify-between items-end">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div
                className="w-12 bg-slate-300 rounded"
                style={{ height: `${Math.random() * 150 + 50}px` }}
              ></div>
              <div className="h-2 w-12 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex gap-4">
        <div className="h-3 bg-slate-100 rounded w-24"></div>
        <div className="h-3 bg-slate-100 rounded w-32"></div>
        <div className="h-3 bg-slate-100 rounded w-28"></div>
      </div>
    </div>
  );
}
