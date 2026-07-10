'use client';

import React from 'react';
import { StickyScroll } from '../product-showcase/StickyScroll';
import { AIProductsVisual, PlatformVisual, IntegrationVisual } from './ServicesVisualizations';
import { useTranslations } from 'next-intl';

export function ServicesStickyStory() {
  const t = useTranslations('services');

  const stickyItems = [
    {
      title: t('list.aiProducts.title'),
      description: t('list.aiProducts.desc'),
      content: <AIProductsVisual />,
    },
    {
      title: t('list.launchFaster.title'),
      description: t('list.launchFaster.desc'),
      content: <PlatformVisual />,
    },
    {
      title: t('list.automateOps.title'),
      description: t('list.automateOps.desc'),
      content: <IntegrationVisual />,
    },
  ];

  return (
    <div className="w-full">
      <StickyScroll items={stickyItems} />
    </div>
  );
}
