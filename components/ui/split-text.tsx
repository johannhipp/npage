"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface SplitTextProps {
  text: string;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  stagger?: number;
}

export function SplitText({
  text,
  as,
  className,
  stagger = 0.045,
  ...rest
}: SplitTextProps) {
  const Component = (as ?? "span") as keyof React.JSX.IntrinsicElements;
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return React.createElement(
    Component,
    {
      className: cn("inline-flex flex-wrap gap-y-2", className),
      "aria-label": text,
      ...rest,
    },
    text.split("").map((char, index) => (
      <span
        key={`${char}-${index}`}
        className={cn(
          "inline-block transform transition duration-300 ease-out will-change-transform",
          mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        )}
        style={{ transitionDelay: `${index * stagger}s` }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    )),
  );
}
