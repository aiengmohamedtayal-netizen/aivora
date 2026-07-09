'use client';

import React, { useRef, useState } from 'react';
import {
  useScroll,
  useMotionValueEvent,
  motion,
  AnimatePresence,
  useReducedMotion,
} from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export interface StickyScrollItem {
  titleKey: string;
  descriptionKey: string;
  content: React.ReactNode;
}

export function StickyScroll({
  className,
  items,
}: {
  className?: string;
  items: StickyScrollItem[];
}) {
  const t = useTranslations();
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const cardLength = items.length;

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const cardsBreakpoints = items.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc]!)) {
          return index;
        }
        return acc;
      },
      0
    );
    setActiveCard(closestBreakpointIndex);
  });

  return (
    <div
      className={cn(
        'relative flex w-full flex-col md:h-[150vh] md:flex-row',
        className
      )}
      ref={ref}
    >
      {/* Mobile view: Stacked */}
      <div className="flex w-full flex-col gap-16 md:hidden">
        {items.map((item, index) => (
          <div key={item.titleKey + index} className="flex flex-col gap-6">
            <div>
              <h3 className="mb-3 text-2xl font-medium text-foreground">
                {t(item.titleKey)}
              </h3>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {t(item.descriptionKey)}
              </p>
            </div>
            <div className="relative w-full">{item.content}</div>
          </div>
        ))}
      </div>

      {/* Desktop & Tablet view: Sticky Scroll */}
      <div className="hidden h-full w-full justify-between gap-6 md:flex lg:gap-10">
        {/* Left Side: Text Content */}
        <div className="relative flex w-1/2 items-start">
          <div className="flex w-full flex-col gap-[30vh] pb-[30vh] pt-[30vh] px-2 lg:px-0">
            {items.map((item, index) => (
              <motion.div
                key={item.titleKey + index}
                className="flex max-w-lg flex-col gap-4 lg:gap-6"
                initial={{ opacity: 0.3 }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                  scale: shouldReduceMotion ? 1 : (activeCard === index ? 1 : 0.95),
                  filter: shouldReduceMotion ? 'blur(0px)' : (activeCard === index ? 'blur(0px)' : 'blur(1px)'),
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <h3 className="text-2xl font-medium leading-tight text-foreground lg:text-4xl">
                  {t(item.titleKey)}
                </h3>
                <p className="text-lg lg:text-xl leading-relaxed text-muted-foreground">
                  {t(item.descriptionKey)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Side: Sticky Visuals */}
        <div className="sticky top-0 flex h-screen w-1/2 items-center justify-center">
          <div className="relative w-full max-w-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCard}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20, scale: shouldReduceMotion ? 1 : 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -20, scale: shouldReduceMotion ? 1 : 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="flex w-full items-center justify-center"
              >
                {items[activeCard]?.content}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
