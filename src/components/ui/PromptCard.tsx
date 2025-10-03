import CopyButton from './CopyButton';
import clsx from 'clsx';

interface PromptCardProps {
  title: string;
  prompt: string;
  description?: string;
  variant?: 'standard' | 'cot' | 'multi';
  parameters?: {
    k?: number;
    threshold?: number;
    temperature?: number;
  };
  className?: string;
}

export default function PromptCard({
  title,
  prompt,
  description,
  variant = 'standard',
  parameters,
  className = ''
}: PromptCardProps) {
  const variantColors = {
    standard: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30',
    cot: 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/30',
    multi: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30'
  };

  const variantLabels = {
    standard: 'VS-Standard',
    cot: 'VS-CoT',
    multi: 'VS-Multi'
  };

  return (
    <div className={clsx(
      'rounded-lg border-2 p-6 space-y-4 transition-all hover:shadow-lg',
      variantColors[variant],
      className
    )}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-lg">{title}</h3>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-white/80 dark:bg-gray-800/80">
              {variantLabels[variant]}
            </span>
          </div>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
          )}
        </div>
        <CopyButton text={prompt} size="sm" />
      </div>

      {/* Prompt */}
      <div className="bg-white dark:bg-gray-900 rounded-md p-4 font-mono text-sm">
        <pre className="whitespace-pre-wrap break-words text-gray-800 dark:text-gray-200">
          {prompt}
        </pre>
      </div>

      {/* Parameters */}
      {parameters && (
        <div className="flex flex-wrap gap-3 text-sm">
          {parameters.k && (
            <div className="flex items-center gap-1">
              <span className="text-gray-500 dark:text-gray-400">k:</span>
              <span className="font-semibold">{parameters.k}</span>
            </div>
          )}
          {parameters.threshold !== undefined && (
            <div className="flex items-center gap-1">
              <span className="text-gray-500 dark:text-gray-400">τ:</span>
              <span className="font-semibold">{parameters.threshold}</span>
            </div>
          )}
          {parameters.temperature !== undefined && (
            <div className="flex items-center gap-1">
              <span className="text-gray-500 dark:text-gray-400">temp:</span>
              <span className="font-semibold">{parameters.temperature}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}