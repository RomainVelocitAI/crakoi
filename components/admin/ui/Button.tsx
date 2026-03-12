"use client";

import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2",
    "font-sans font-medium transition-all duration-200",
    "rounded-md border outline-none",
    "focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-1 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-40",
    "active:scale-[0.98]",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-gold border-gold text-background",
          "hover:bg-gold-light hover:border-gold-light",
          "shadow-[0_1px_2px_rgba(212,175,55,0.15)]",
          "hover:shadow-[0_2px_8px_rgba(212,175,55,0.25)]",
        ],
        secondary: [
          "bg-surface border-border text-text-primary",
          "hover:bg-surface-light hover:border-border",
          "hover:text-text-primary",
        ],
        danger: [
          "bg-red-500/10 border-red-500/20 text-red-400",
          "hover:bg-red-500/20 hover:border-red-500/30",
        ],
        ghost: [
          "bg-transparent border-transparent text-text-secondary",
          "hover:bg-surface hover:text-text-primary",
        ],
      },
      size: {
        sm: "text-xs px-3 py-1.5 h-8",
        md: "text-sm px-4 py-2 h-9",
        lg: "text-sm px-5 py-2.5 h-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || loading}
        {...props}
      >
        <span className={cn(loading && "opacity-0 pointer-events-none", "inline-flex items-center gap-2")}>{children}</span>
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
