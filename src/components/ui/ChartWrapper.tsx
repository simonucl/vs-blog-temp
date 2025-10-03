import { Suspense, type ReactNode } from 'react';
import { ChartErrorBoundary } from './ChartErrorBoundary';
import ChartSkeleton from './ChartSkeleton';

interface ChartWrapperProps {
  children: ReactNode;
  height?: number;
  title?: string;
  fallback?: ReactNode;
}

/**
 * Wrapper component that provides error boundary and loading states for charts
 */
export default function ChartWrapper({
  children,
  height = 400,
  title,
  fallback,
}: ChartWrapperProps) {
  return (
    <ChartErrorBoundary fallback={fallback}>
      <Suspense fallback={<ChartSkeleton height={height} title={title} />}>
        {children}
      </Suspense>
    </ChartErrorBoundary>
  );
}
