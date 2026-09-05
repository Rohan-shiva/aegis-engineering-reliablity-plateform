import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand disabled:pointer-events-none disabled:opacity-50",
          variant === "primary" && "bg-brand text-white hover:bg-brand-dark shadow-sm",
          variant === "secondary" && "bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700/60",
          variant === "outline" && "border border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800 hover:text-white",
          variant === "ghost" && "text-slate-300 hover:bg-slate-800/60 hover:text-white",
          variant === "danger" && "bg-red-600 text-white hover:bg-red-700 shadow-sm",
          size === "sm" && "h-8 px-3 text-xs",
          size === "md" && "h-9 px-4 text-sm",
          size === "lg" && "h-10 px-5 text-base",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
