# Data Model & Interfaces: Product Showcase

## Frontend Data Structures

### `ProductItem`

This interface defines the structure for a product shown in the showcase. It is used to generate the sticky scroll narrative and the corresponding visuals.

```typescript
export interface ProductItem {
  id: string; // e.g., 'crm', 'assistant'
  titleKey: string; // Translation key for title
  descriptionKey: string; // Translation key for description
  icon: React.ElementType; // Lucide icon
  visualComponent: React.ElementType; // The React component rendering the mock UI
}
```

### `BentoFeature`

Defines the structure for secondary capabilities shown in the Bento Grid.

```typescript
export interface BentoFeature {
  id: string;
  titleKey: string;
  descriptionKey: string;
  colSpan: number; // e.g., 1 or 2 to control grid width
  visual: React.ElementType;
}
```

## Contracts

No external API contracts are modified for this feature. All data is static and localized via standard frontend dictionaries (`en.json`, `ar.json`).
