'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { duration, viewport } from '@/lib/motion';

export interface MacWindowProps {
  children: ReactNode;
  className?: string;
  title?: string;
  /** Disable entrance animation if nested inside an already animated component */
  animate?: boolean;
}

export function MacWindow({
  children,
  className,
  title,
  animate = true,
}: MacWindowProps) {
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
        'relative flex flex-col overflow-hidden rounded-xl border border-white/10',
        'bg-background/40 backdrop-blur-md shadow-2xl ring-1 ring-white/5',
        className
      )}
    >
      {/* Top Bar */}
      <div className="relative flex h-10 w-full shrink-0 items-center border-b border-white/5 bg-white/[0.02] px-4">
        {/* Mac OS Window Controls */}
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-[#FF5F56] border border-black/10" />
          <div className="h-3 w-3 rounded-full bg-[#FFBD2E] border border-black/10" />
          <div className="h-3 w-3 rounded-full bg-[#27C93F] border border-black/10" />
        </div>

        {/* Optional Title */}
        {title && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
            <span className="text-xs font-medium text-muted-foreground/70 tracking-wide">
              {title}
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="relative flex-1 overflow-hidden bg-background/20">
        {children}
      </div>
    </Container>
  );
}
