import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Label = forwardRef(({ 
  className, 
  required = false,
  children, 
  ...props 
}, ref) => {
  const baseClasses = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <label
      ref={ref}
      className={cn(baseClasses, className)}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
});

Label.displayName = "Label";

export default Label;