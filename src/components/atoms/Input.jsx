import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text", 
  error = false,
  ...props 
}, ref) => {
  const baseClasses = "w-full px-4 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const errorClasses = error 
    ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
    : "border-gray-300 hover:border-gray-400";

  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        baseClasses,
        errorClasses,
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;