import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const EntityCard = ({ 
  entity, 
  isDragging = false,
  onDragStart,
  onDragEnd,
  onClick,
  className,
  ...props 
}) => {
  const getEntityIcon = (type) => {
    switch (type) {
      case "s-corp":
        return "Building2";
      case "llc":
        return "Shield";
      case "trust":
        return "Vault";
      case "business":
        return "Briefcase";
      case "property":
        return "Home";
      case "investment":
        return "TrendingUp";
      default:
        return "Circle";
    }
  };

  const getEntityColor = (type) => {
    switch (type) {
      case "s-corp":
        return "operations";
      case "llc":
        return "assets";
      case "trust":
        return "foundation";
      case "business":
        return "operations";
      case "property":
        return "assets";
      case "investment":
        return "assets";
      default:
        return "default";
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const entityColor = getEntityColor(entity.type);
  const iconName = getEntityIcon(entity.type);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: isDragging ? 1.05 : 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "entity-card cursor-grab active:cursor-grabbing",
        isDragging && "dragging",
        className
      )}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      {...props}
    >
      <Card variant={entityColor} className="p-4 min-w-[180px]">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={cn(
              "p-2 rounded-lg",
              entityColor === "operations" && "bg-operations-100 text-operations-600",
              entityColor === "assets" && "bg-assets-100 text-assets-600",
              entityColor === "foundation" && "bg-foundation-100 text-foundation-600",
              entityColor === "default" && "bg-gray-100 text-gray-600"
            )}>
              <ApperIcon name={iconName} className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                {entity.name}
              </h3>
              <p className="text-xs text-gray-500 capitalize">
                {entity.type.replace("-", " ")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <ApperIcon name="GripVertical" className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {(entity.financials?.revenue || entity.financials?.value) && (
          <div className="border-t pt-3">
            {entity.financials.revenue && (
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500">Revenue</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(entity.financials.revenue)}
                </span>
              </div>
            )}
            {entity.financials.value && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Value</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(entity.financials.value)}
                </span>
              </div>
            )}
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default EntityCard;