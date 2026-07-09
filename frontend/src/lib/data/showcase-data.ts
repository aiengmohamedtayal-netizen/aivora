import {
  Bot,
  BarChart,
  Workflow,
  Shield,
  Layers,
  Database,
  Terminal,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface ProductItem {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: LucideIcon;
}

export const showcaseProducts: ProductItem[] = [
  {
    id: 'assistant',
    titleKey: 'ProductShowcase.products.assistant.title',
    descriptionKey: 'ProductShowcase.products.assistant.description',
    icon: Bot,
  },
  {
    id: 'crm',
    titleKey: 'ProductShowcase.products.crm.title',
    descriptionKey: 'ProductShowcase.products.crm.description',
    icon: Database,
  },
  {
    id: 'automation',
    titleKey: 'ProductShowcase.products.automation.title',
    descriptionKey: 'ProductShowcase.products.automation.description',
    icon: Workflow,
  },
  {
    id: 'analytics',
    titleKey: 'ProductShowcase.products.analytics.title',
    descriptionKey: 'ProductShowcase.products.analytics.description',
    icon: BarChart,
  },
  {
    id: 'portal',
    titleKey: 'ProductShowcase.products.portal.title',
    descriptionKey: 'ProductShowcase.products.portal.description',
    icon: Shield,
  },
  {
    id: 'workflow',
    titleKey: 'ProductShowcase.products.workflow.title',
    descriptionKey: 'ProductShowcase.products.workflow.description',
    icon: Layers,
  },
  {
    id: 'custom',
    titleKey: 'ProductShowcase.products.custom.title',
    descriptionKey: 'ProductShowcase.products.custom.description',
    icon: Terminal,
  },
];
