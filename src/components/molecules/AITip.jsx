import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const AITip = ({ 
  tip, 
  isVisible, 
  onClose, 
  position = { x: 0, y: 0 },
  className 
}) => {
  if (!tip || !isVisible) return null;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "from-red-500 to-red-600";
      case "medium":
        return "from-flow-500 to-flow-600";
      case "low":
        return "from-blue-500 to-blue-600";
      default:
        return "from-blue-500 to-blue-600";
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          className={cn(
            "ai-tip absolute z-50 max-w-sm p-4 rounded-lg shadow-lg",
            className
          )}
          style={{
            left: position.x,
            top: position.y,
            background: `linear-gradient(135deg, ${getPriorityColor(tip.priority)} 0%, ${getPriorityColor(tip.priority)} 100%)`,
          }}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 p-1">
              <ApperIcon name="Bot" className="w-5 h-5 text-white" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-medium text-white text-sm">
                  AI Suggestion
                </h4>
                {tip.priority === "high" && (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </div>
              
              <p className="text-sm text-white opacity-90 leading-relaxed">
                {tip.message}
              </p>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="flex-shrink-0 p-1 text-white hover:bg-white hover:bg-opacity-20"
            >
              <ApperIcon name="X" className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AITip;