import { MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';

interface NoAnimationsProps {
  children: ReactNode;
}

export default function NoAnimations({ children }: NoAnimationsProps) {
  return (
    <MotionConfig reducedMotion="always">
      {children}
    </MotionConfig>
  );
}
