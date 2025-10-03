import type { TooltipProps } from 'recharts';

// Recharts Tooltip Types
export interface ChartTooltipPayload<T = any> {
  name: string;
  value: number;
  color: string;
  dataKey: string;
  payload: T;
}

export interface ChartTooltipProps<T = any> extends TooltipProps<number, string> {
  active?: boolean;
  payload?: ChartTooltipPayload<T>[];
  label?: string;
}

// Method Types
export type PromptingMethod =
  | 'direct'
  | 'cot'
  | 'sequence'
  | 'multiturn'
  | 'vs_standard'
  | 'vs_cot'
  | 'vs_multi';

export type TrainingStage = 'base' | 'sft' | 'dpo' | 'final';

// Data Point Types
export interface DiversityDataPoint {
  method: PromptingMethod;
  value: number;
  category?: string;
}

export interface PostTrainingStageData {
  stage: TrainingStage;
  direct: number;
  sequence: number;
  multiturn: number;
  vs: number;
}

export interface DistributionDataPoint {
  name: string;
  pretraining?: number;
  direct?: number;
  vs?: number;
}

export interface KLDivergence {
  direct: number;
  vs: number;
}

// Chart Props Types
export interface DiversityBarChartProps {
  data: DiversityDataPoint[];
  title: string;
  subtitle?: string;
  yAxisLabel?: string;
  height?: number;
  showLegend?: boolean;
}

export interface PostTrainingLineChartProps {
  data: PostTrainingStageData[];
  title: string;
  subtitle?: string;
  baselineDiversity?: number;
  height?: number;
}

export interface DistributionChartProps {
  data: DistributionDataPoint[];
  title: string;
  subtitle?: string;
  klDivergence?: KLDivergence;
  height?: number;
}

// Method Display Configuration
export interface MethodConfig {
  label: string;
  color: string;
  description?: string;
}

export const METHOD_COLORS: Record<PromptingMethod, string> = {
  direct: '#94a3b8',      // slate-400
  cot: '#64748b',         // slate-500
  sequence: '#475569',    // slate-600
  multiturn: '#334155',   // slate-700
  vs_standard: '#dc2626', // red-600
  vs_cot: '#b91c1c',      // red-700
  vs_multi: '#991b1b',    // red-800
};

export const METHOD_LABELS: Record<PromptingMethod, string> = {
  direct: 'Direct',
  cot: 'CoT',
  sequence: 'Sequence',
  multiturn: 'Multi-turn',
  vs_standard: 'VS-Standard',
  vs_cot: 'VS-CoT',
  vs_multi: 'VS-Multi',
};

export const STAGE_LABELS: Record<TrainingStage, string> = {
  base: 'Base',
  sft: 'SFT',
  dpo: 'DPO',
  final: 'Final',
};
