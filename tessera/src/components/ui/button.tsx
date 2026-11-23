import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

/* shadcn-style button: variants via cva, explicit hover / focus-visible / disabled states */
export const buttonVariants = cva(
  "inline-flex min-h-12 min-w-12 select-none items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 text-sm font-semibold tracking-wide transition-[background-color,color,border-color,opacity,transform,box-shadow] duration-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime active:scale-[0.97] disabled:cursor-not-allowed disabled:border-white/5 disabled:bg-ink-3 disabled:text-mute/50 disabled:opacity-60 disabled:active:scale-100",
  {
    variants: {
      variant: {
        primary:
          "bg-lime text-ink hover:bg-lime-hover hover:shadow-[0_0_0_8px_oklch(0.93_0.21_120/0.16)] focus-visible:shadow-[0_0_0_8px_oklch(0.93_0.21_120/0.24)]",
        secondary:
          "border border-white/15 bg-ink-3 text-paper hover:border-white/35 hover:bg-ink-2",
        ghost: "text-mute hover:bg-white/8 hover:text-paper",
        cobalt: "bg-cobalt text-paper hover:bg-cobalt-light",
      },
      size: {
        md: "",
        lg: "min-h-14 px-8 text-base",
        icon: "px-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button ref={ref} type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
);
Button.displayName = "Button";
