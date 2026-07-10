"use client"

import { forwardRef, useId } from "react"
import { cn } from "@aivora/lib/utils"

/* ─────────────────────────────────────────────────────────────────────────
   Types — per ui_contract.md §2
   ───────────────────────────────────────────────────────────────────────── */

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  helperText?: string
  error?: string
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
}

/* ─────────────────────────────────────────────────────────────────────────
   Component
   ───────────────────────────────────────────────────────────────────────── */

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      iconLeft,
      iconRight,
      id: externalId,
      type = "text",
      ...props
    },
    ref,
  ) => {
    const generatedId = useId()
    const inputId = externalId ?? generatedId
    const errorId = error ? `${inputId}-error` : undefined
    const helperTextId = helperText ? `${inputId}-helper` : undefined

    const describedBy = [errorId, helperTextId].filter(Boolean).join(" ") || undefined

    return (
      <div className="group w-full space-y-2">
        {/* Label */}
        <label
          htmlFor={inputId}
          className={cn(
            "section-label block transition-colors",
            "group-focus-within:text-primary",
            error && "text-destructive",
          )}
        >
          {label}
        </label>

        {/* Input wrapper */}
        <div className="relative">
          {/* Left icon */}
          {iconLeft && (
            <span
              className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-muted-foreground"
              aria-hidden="true"
            >
              {iconLeft}
            </span>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={cn(
              "w-full rounded-t-xl border-0 border-b-2 bg-secondary/50 px-4 py-3 text-foreground outline-none transition-all",
              "placeholder:text-muted-foreground",
              "focus:border-primary focus:ring-0",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error
                ? "border-destructive focus:border-destructive"
                : "border-border",
              iconLeft && "ps-10",
              iconRight && "pe-10",
              className,
            )}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            {...props}
          />

          {/* Right icon */}
          {iconRight && (
            <span
              className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3 text-muted-foreground"
              aria-hidden="true"
            >
              {iconRight}
            </span>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p
            id={errorId}
            className="text-caption text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Helper text */}
        {helperText && !error && (
          <p id={helperTextId} className="text-caption text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = "Input"

export { Input }
export type { InputProps }
