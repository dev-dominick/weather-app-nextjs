import * as React from "react";
import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-weather-md border border-weather-border bg-weather-surface-elevated px-4 text-sm text-weather-foreground placeholder:text-weather-muted/80",
        className,
      )}
      {...props}
    />
  );
}

