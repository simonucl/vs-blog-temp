import { useState } from 'react';
import copy from 'copy-to-clipboard';
import { Copy, Check } from 'lucide-react';
import clsx from 'clsx';

interface CopyButtonProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'inline' | 'floating';
  label?: string;
}

export default function CopyButton({
  text,
  className = '',
  size = 'md',
  variant = 'default',
  label = 'Copy'
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const success = copy(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const sizeClasses = {
    sm: 'text-xs p-1.5',
    md: 'text-sm p-2',
    lg: 'text-base p-2.5'
  };

  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700',
    inline: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800',
    floating: 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg'
  };

  const iconSize = size === 'sm' ? 14 : size === 'md' ? 16 : 18;

  return (
    <button
      onClick={handleCopy}
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-md transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        sizeClasses[size],
        variantClasses[variant],
        copied && 'text-green-600 dark:text-green-400',
        className
      )}
      aria-label={copied ? 'Copied!' : label}
    >
      {copied ? (
        <>
          <Check size={iconSize} />
          <span className="font-medium">Copied!</span>
        </>
      ) : (
        <>
          <Copy size={iconSize} />
          {variant !== 'floating' && <span className="font-medium">{label}</span>}
        </>
      )}
    </button>
  );
}