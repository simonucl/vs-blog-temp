import type {
  DiversityDataPoint,
  PostTrainingStageData,
  DistributionDataPoint,
  PromptingMethod,
  TrainingStage,
} from '@/types/charts';

/**
 * Transform diversity gains JSON data into chart format
 */
export function transformDiversityGains(
  taskData: Record<string, number>,
  task: string
): DiversityDataPoint[] {
  return Object.entries(taskData).map(([method, value]) => ({
    method: method as PromptingMethod,
    value,
    category: task,
  }));
}

/**
 * Transform post-training JSON data into line chart format
 */
export function transformPostTrainingData(
  stagesData: Record<string, Record<string, number>>
): PostTrainingStageData[] {
  return Object.entries(stagesData).map(([stage, methods]) => ({
    stage: stage as TrainingStage,
    direct: methods.direct || 0,
    sequence: methods.sequence || 0,
    multiturn: methods.multiturn || 0,
    vs: methods.vs || 0,
  }));
}

/**
 * Transform US states distribution data into chart format
 */
export function transformDistributionData(
  pretrainingDist: Record<string, number | string>,
  directDist: Record<string, number | string>,
  vsDist: Record<string, number | string>
): DistributionDataPoint[] {
  // Filter out non-numeric fields like 'description'
  const filterNumeric = (obj: Record<string, number | string>) =>
    Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => typeof value === 'number')
    ) as Record<string, number>;

  const pretraining = filterNumeric(pretrainingDist);
  const direct = filterNumeric(directDist);
  const vs = filterNumeric(vsDist);

  // Get all unique state names
  const allStates = new Set([
    ...Object.keys(pretraining),
    ...Object.keys(direct),
    ...Object.keys(vs),
  ]);

  return Array.from(allStates)
    .map((name) => ({
      name,
      pretraining: pretraining[name] || 0,
      direct: direct[name] || 0,
      vs: vs[name] || 0,
    }))
    // Sort by pretraining probability descending
    .sort((a, b) => (b.pretraining || 0) - (a.pretraining || 0))
    // Take top 20 for readability
    .slice(0, 20);
}

/**
 * Calculate KL divergence between two distributions
 * KL(P||Q) = Σ P(i) * log(P(i)/Q(i))
 */
export function calculateKLDivergence(
  distribution: Record<string, number>,
  reference: Record<string, number>
): number {
  const epsilon = 1e-10; // Small constant to avoid log(0)
  let kl = 0;

  for (const [key, pValue] of Object.entries(distribution)) {
    const qValue = reference[key] || epsilon;
    const p = pValue || epsilon;
    kl += p * Math.log(p / qValue);
  }

  return kl;
}

/**
 * Normalize a distribution to sum to 1
 */
export function normalizeDistribution(
  distribution: Record<string, number>
): Record<string, number> {
  const total = Object.values(distribution).reduce((sum, val) => sum + val, 0);

  if (total === 0) return distribution;

  return Object.fromEntries(
    Object.entries(distribution).map(([key, value]) => [key, value / total])
  );
}

/**
 * Safe data loader with error handling
 */
export async function loadPaperData<T>(
  path: string
): Promise<T | null> {
  try {
    const module = await import(/* @vite-ignore */ path);
    return module.default as T;
  } catch (error) {
    console.error(`Failed to load data from ${path}:`, error);
    return null;
  }
}

/**
 * Validate chart data before rendering
 */
export function validateChartData<T extends { value?: number }>(
  data: T[]
): boolean {
  if (!Array.isArray(data) || data.length === 0) {
    return false;
  }

  // Check if data has valid numeric values
  const hasValidValues = data.some((item) =>
    typeof item.value === 'number' && !isNaN(item.value)
  );

  return hasValidValues;
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format large numbers with commas
 */
export function formatNumber(value: number): string {
  return value.toLocaleString('en-US');
}

/**
 * Calculate diversity improvement ratio
 */
export function calculateImprovement(
  vsValue: number,
  directValue: number
): { ratio: number; percentage: number } {
  const ratio = vsValue / directValue;
  const percentage = ((vsValue - directValue) / directValue) * 100;

  return { ratio, percentage };
}
