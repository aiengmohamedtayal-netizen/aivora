"use client";

import React from "react";
import { AlertCircle, RotateCw } from "lucide-react";
import { cn } from "@aivora/lib/utils";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 px-4 py-3.5 rounded-2xl rounded-ss-sm shadow-sm",
        "bg-destructive/10 border border-destructive/20",
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-2.5 text-destructive dark:text-red-400">
        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
        <span className="font-medium text-[13px] sm:text-sm leading-relaxed">
          {message}
        </span>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className={cn(
            "mt-1 self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
            "bg-destructive/10 hover:bg-destructive/20 text-destructive dark:text-red-400",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background"
          )}
          aria-label="Retry"
        >
          <RotateCw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};
