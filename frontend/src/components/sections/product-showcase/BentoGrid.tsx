'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { duration, viewport } from '@/lib/motion';

export interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        'mx-auto grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3',
        className
      )}
    >
      {children}
    </div>
  );
}

export interface BentoItemProps {
  children: ReactNode;
  className?: string;
  colSpan?: 1 | 2 | 3;
  rowSpan?: 1 | 2;
  animate?: boolean;
}

export function BentoItem({
  children,
  className,
  colSpan = 1,
  rowSpan = 1,
  animate = true,
}: BentoItemProps) {
  const Container = (animate ? motion.div : 'div') as any;

  const animationProps = animate
    ? {
        initial: { opacity: 0, y: 15 },
        whileInView: { opacity: 1, y: 0 },
        viewport: viewport.tight,
        transition: { duration: duration.slow, ease: 'easeOut' as const },
      }
    : {};

  return (
    <Container
      {...animationProps}
      className={cn(
        'group relative overflow-hidden rounded-xl border border-border',
        'bg-background/40 backdrop-blur-md transition-colors duration-300',
        'hover:border-primary/20 hover:bg-white/[0.04]',
        colSpan === 2 && 'md:col-span-2 lg:col-span-2',
        colSpan === 3 && 'md:col-span-2 lg:col-span-3',
        rowSpan === 2 && 'md:row-span-1 lg:row-span-2',
        className
      )}
    >
      {children}
    </Container>
  );
}
