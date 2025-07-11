import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  isLoading = false,
  disabled = false,
  onClick,
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl",
    secondary: "bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 shadow-md hover:shadow-lg",
    operations: "bg-gradient-to-r from-operations-600 to-operations-700 hover:from-operations-700 hover:to-operations-800 text-white shadow-lg hover:shadow-xl",
    assets: "bg-gradient-to-r from-assets-600 to-assets-700 hover:from-assets-700 hover:to-assets-800 text-white shadow-lg hover:shadow-xl",
    foundation: "bg-gradient-to-r from-foundation-600 to-foundation-700 hover:from-foundation-700 hover:to-foundation-800 text-white shadow-lg hover:shadow-xl",
    flow: "bg-gradient-to-r from-flow-600 to-flow-700 hover:from-flow-700 hover:to-flow-800 text-white shadow-lg hover:shadow-xl",
    outline: "border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md",
    ghost: "hover:bg-gray-100 text-gray-700 shadow-none hover:shadow-sm"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl"
  };

  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
});

Button.displayName = "Button";

export default Button;