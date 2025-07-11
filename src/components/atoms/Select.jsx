import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Select = forwardRef(({ 
  className, 
  children,
  error = false,
  ...props 
}, ref) => {
  const baseClasses = "w-full px-4 py-2 pr-10 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-white";
  
  const errorClasses = error 
    ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
    : "border-gray-300 hover:border-gray-400";

  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          baseClasses,
          errorClasses,
          className
        )}
        {...props}
      >
        {children}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <ApperIcon name="ChevronDown" className="w-4 h-4 text-gray-500" />
      </div>
    </div>
  );
});

Select.displayName = "Select";

export default Select;