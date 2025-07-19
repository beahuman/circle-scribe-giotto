
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer select-none touch-manipulation",
  {
    variants: {
      variant: {
        default: "btn-cta",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md hover:shadow-lg rounded-xl font-semibold",
        outline:
          "border-2 border-primary/20 bg-background hover:bg-primary/5 hover:border-primary/40 text-foreground shadow-sm hover:shadow-md rounded-xl font-medium",
        secondary: "btn-secondary",
        ghost: "hover:bg-accent hover:text-accent-foreground rounded-xl font-medium",
        link: "text-primary underline-offset-4 hover:underline rounded-sm font-medium",
        premium: "btn-cta shadow-glow border border-primary/20",
      },
      size: {
        default: "min-h-[48px] min-w-[48px] px-5 py-3 text-base",
        sm: "min-h-[40px] min-w-[40px] px-4 py-2 text-sm",
        lg: "min-h-[56px] min-w-[56px] px-6 py-4 text-lg",
        icon: "h-[48px] w-[48px]",
        "icon-sm": "h-[40px] w-[40px]",
        "icon-lg": "h-[56px] w-[56px]",
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
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        style={{ 
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
          ...props.style 
        }}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
