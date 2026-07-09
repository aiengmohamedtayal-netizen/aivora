'use client';

import { useTranslations } from 'next-intl';
import { StickyScroll } from './StickyScroll';
import { BentoGrid, BentoItem } from './BentoGrid';
import { showcaseProducts } from '@/lib/data/showcase-data';
import { CRMVisualization } from './CRMVisualization';
import { AssistantVisualization } from './AssistantVisualization';
import { Link } from '@/i18n/routing';
import { ArrowRight, MessageSquare } from 'lucide-react';

export function ProductShowcase() {
  const t = useTranslations('showcase');

  const assistantData = showcaseProducts.find(p => p.id === 'assistant')!;
  const crmData = showcaseProducts.find(p => p.id === 'crm')!;

  // The first 2 items go into StickyScroll
  const stickyItems = [
    {
      ...assistantData,
      title: t('products.assistant.title'),
      description: t('products.assistant.description'),
      content: <AssistantVisualization />,
    },
    {
      ...crmData,
      title: t('products.crm.title'),
      description: t('products.crm.description'),
      content: <CRMVisualization />,
    },
  ];

  // The remaining items go into the Bento Grid
  const bentoItems = showcaseProducts.filter(p => p.id !== 'assistant' && p.id !== 'crm');

  return (
    <section className="relative z-10 w-full border-t border-white/5 bg-background py-24 md:py-32">
      {/* Background Grid Lines */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="container relative z-20 mx-auto flex flex-col gap-24 px-4 md:px-6">
        {/* Section Header */}
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-medium text-muted-foreground backdrop-blur-md">
            <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
            {t('headline')}
          </div>
          <h2 className="text-4xl font-medium tracking-tight text-foreground md:text-5xl lg:text-6xl">
            {t('subheadline')}
          </h2>
          <p className="text-xl leading-relaxed text-muted-foreground md:text-2xl">
            {t('supportingText')}
          </p>
        </div>

        {/* Sticky Scroll Section */}
        <StickyScroll items={stickyItems} />

        {/* Bento Grid Section */}
        <div className="flex flex-col gap-10">
          <div className="flex items-center gap-4 before:h-px before:flex-1 before:bg-white/5 after:h-px after:flex-1 after:bg-white/5">
            <h3 className="px-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
              {t('bullets.0')}
            </h3>
          </div>

          <BentoGrid>
            {bentoItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <BentoItem
                  key={item.id}
                  colSpan={index === 0 || index === 3 ? 2 : 1}
                  className="group flex flex-col justify-between gap-6 p-8"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all duration-500 group-hover:scale-110 group-hover:bg-white/10">
                    <Icon className="h-6 w-6 text-foreground" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <h4 className="text-xl font-medium text-foreground">
                      {t(`products.${item.id}.title`)}
                    </h4>
                    <p className="text-base leading-relaxed text-muted-foreground">
                      {t(`products.${item.id}.description`)}
                    </p>
                  </div>
                </BentoItem>
              );
            })}
          </BentoGrid>
        </div>

        {/* Premium CTA Section */}
        <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-8 pt-12 text-center">
          <div className="flex flex-col gap-4">
            <h3 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl">
              {t('ctaSection.title')}
            </h3>
            <p className="text-lg text-muted-foreground">
              {t('ctaSection.description')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/intake"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3.5 text-[15px] font-medium text-background shadow-md transition-all duration-300 hover:bg-foreground/90"
            >
              {t('primaryCTA')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Link>
            <Link
              href="/intelligence"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-[15px] font-medium text-foreground backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-white/20"
            >
              <MessageSquare className="h-4 w-4" />
              {t('secondaryCTA')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
