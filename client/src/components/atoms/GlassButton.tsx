import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const glassButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-white/10 text-white hover:bg-white/20 border border-white/20 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]",
        primary:
          "bg-[#72004c]/80 text-white hover:bg-[#72004c] border border-[#72004c]/50 backdrop-blur-md shadow-[0_0_20px_rgba(114,0,76,0.3)] hover:shadow-[0_0_30px_rgba(114,0,76,0.6)]",
        secondary:
          "bg-[#006f87]/80 text-white hover:bg-[#006f87] border border-[#006f87]/50 backdrop-blur-md shadow-[0_0_20px_rgba(0,111,135,0.3)] hover:shadow-[0_0_30px_rgba(0,111,135,0.6)]",
        ghost: "hover:bg-white/10 hover:text-white text-gray-300",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
}

const GlassButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(glassButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
GlassButton.displayName = "GlassButton"

export { GlassButton, glassButtonVariants }
