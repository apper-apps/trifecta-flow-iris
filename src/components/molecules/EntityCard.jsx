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
  onConnectionStart,
  onConnectionEnd,
  isConnecting = false,
  connectionStart = null,
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
        "entity-card cursor-grab active:cursor-grabbing group",
        isDragging && "dragging",
        className
      )}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      {...props}
    >
<Card variant={entityColor} className="p-4 min-w-[180px] relative">
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
            {/* Connection indicator */}
            {entity.connections && entity.connections.length > 0 && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-xs text-gray-500">{entity.connections.length}</span>
              </div>
            )}
            <ApperIcon name="GripVertical" className="w-4 h-4 text-gray-400" />
          </div>
        </div>

{/* Connection controls */}
        {!isDragging && (
          <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
            <div className="flex gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onConnectionStart && onConnectionStart();
                }}
                className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg"
                title="Start connection"
              >
                <ApperIcon name="Plus" className="w-3 h-3" />
              </button>
              {isConnecting && connectionStart && connectionStart.Id !== entity.Id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onConnectionEnd && onConnectionEnd();
                  }}
                  className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors shadow-lg"
                  title="End connection"
                >
                  <ApperIcon name="Check" className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        )}

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