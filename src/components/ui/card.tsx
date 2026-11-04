import * as React from "react";
import { cn } from "@/lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-weather-xl border border-weather-border bg-weather-surface p-4 shadow-weather-card backdrop-blur-md",
        className,
      )}
      {...props}
    />
  );
}

