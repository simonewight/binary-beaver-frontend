import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "../../lib/utils"

const Button = React.forwardRef(({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        {
          "bg-white text-slate-900 hover:bg-slate-100": variant === "default",
          "bg-transparent border border-slate-700 text-white hover:bg-slate-800": variant === "outline",
          "bg-transparent text-white hover:bg-slate-800": variant === "ghost",
          "h-9 px-4 py-2": size === "default",
          "h-11 px-8": size === "lg",
          "h-8 px-3": size === "sm",
        },
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button } 