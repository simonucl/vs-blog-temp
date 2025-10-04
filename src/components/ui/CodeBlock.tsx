import CopyButton from './CopyButton';
import clsx from 'clsx';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
  className?: string;
  copyable?: boolean;
  analyticsEvent?: string;
  analyticsPayload?: Record<string, unknown>;
}

export default function CodeBlock({
  code,
  language = 'text',
  title,
  showLineNumbers = false,
  className = '',
  copyable = true,
  analyticsEvent,
  analyticsPayload
}: CodeBlockProps) {
  const lines = code.trim().split('\n');

  const emitAnalytics = (name?: string, payload?: Record<string, unknown>) => {
    if (!name || typeof window === 'undefined') return;
    try {
      // Segment-style
      // @ts-ignore
      if (window.analytics?.track) {
        // @ts-ignore
        window.analytics.track(name, payload || {});
        return;
      }
      // gtag
      // @ts-ignore
      if (window.gtag) {
        // @ts-ignore
        window.gtag('event', name, payload || {});
        return;
      }
      // Plausible
      // @ts-ignore
      if (window.plausible) {
        // @ts-ignore
        window.plausible(name, { props: payload || {} });
        return;
      }
      // Fallback: CustomEvent for app listeners
      window.dispatchEvent(new CustomEvent('analytics', { detail: { name, payload } }));
    } catch {}
  };

  return (
    <div className={clsx('relative group rounded-lg overflow-hidden', className)}>
      {title && (
        <div className="bg-gray-800 dark:bg-gray-900 text-gray-200 px-4 py-2 text-sm font-mono border-b border-gray-700">
          {title}
        </div>
      )}

      <div className="relative">
        {copyable && (
          <CopyButton
            text={code}
            variant="floating"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onCopy={() => emitAnalytics(analyticsEvent, analyticsPayload)}
          />
        )}

        <pre className={clsx(
          'bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 overflow-x-auto',
          !title && 'rounded-lg'
        )}>
          <code className={`language-${language}`}>
            {showLineNumbers ? (
              lines.map((line, i) => (
                <div key={i} className="table-row">
                  <span className="table-cell text-gray-500 pr-4 select-none text-right">
                    {i + 1}
                  </span>
                  <span className="table-cell">{line}</span>
                </div>
              ))
            ) : (
              code
            )}
          </code>
        </pre>
      </div>
    </div>
  );
}
