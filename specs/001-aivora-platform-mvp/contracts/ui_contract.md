# UI Component Contracts: Aivora Platform MVP

## 1. Reusable Button Component Interface
Component properties mapping custom design system variables.
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}
```

## 2. Reusable Input Field Component Interface
```typescript
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  error?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}
```

## 3. Dynamic R3F Canvas Container Interface
```typescript
interface CanvasContainerProps {
  fallback?: React.ReactNode;
  animationEnabled?: boolean;
  reducedMotion?: boolean;
}
```
