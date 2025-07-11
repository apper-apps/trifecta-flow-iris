import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  className, 
  variant = "default",
  elevation = "md",
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-white border border-gray-200",
    gradient: "bg-gradient-to-br from-white to-gray-50 border border-gray-200",
    operations: "bg-gradient-to-br from-operations-50 to-operations-100 border border-operations-200",
    assets: "bg-gradient-to-br from-assets-50 to-assets-100 border border-assets-200",
    foundation: "bg-gradient-to-br from-foundation-50 to-foundation-100 border border-foundation-200",
    flow: "bg-gradient-to-br from-flow-50 to-flow-100 border border-flow-200"
  };

  const elevations = {
    sm: "shadow-sm hover:shadow-md",
    md: "shadow-md hover:shadow-lg",
    lg: "shadow-lg hover:shadow-xl",
    xl: "shadow-xl hover:shadow-2xl"
  };

  const baseClasses = "rounded-lg transition-all duration-200";

  return (
    <div
      ref={ref}
      className={cn(
        baseClasses,
        variants[variant],
        elevations[elevation],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;