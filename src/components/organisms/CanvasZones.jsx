import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const CanvasZones = ({ 
  canvasSize = { width: 1200, height: 800 },
  onZoneHover,
  highlightedZone = null,
  className 
}) => {
  const zones = [
    {
      id: "operations",
      name: "Operations Zone",
      description: "S-Corporation active business operations",
      icon: "Building2",
      color: "operations",
      position: { x: "5%", y: "5%", width: "40%", height: "40%" },
    },
    {
      id: "assets",
      name: "Assets Zone", 
      description: "LLC passive asset holdings",
      icon: "Shield",
      color: "assets",
      position: { x: "55%", y: "5%", width: "40%", height: "40%" },
    },
    {
      id: "foundation",
      name: "Foundation Zone",
      description: "Revocable Living Trust base",
      icon: "Vault",
      color: "foundation",
      position: { x: "5%", y: "50%", width: "90%", height: "30%" },
    },
    {
      id: "flow",
      name: "1040 Flow Zone",
      description: "Personal tax filing integration",
      icon: "ArrowDown",
      color: "flow",
      position: { x: "5%", y: "85%", width: "90%", height: "10%" },
    },
  ];

  return (
    <div className={cn("absolute inset-0 pointer-events-none", className)}>
      {zones.map((zone) => (
        <motion.div
          key={zone.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            "absolute rounded-lg transition-all duration-300",
            `zone-gradient-${zone.color}`,
            highlightedZone === zone.id && "ring-2 ring-blue-500 ring-opacity-50"
          )}
          style={{
            left: zone.position.x,
            top: zone.position.y,
            width: zone.position.width,
            height: zone.position.height,
          }}
          onMouseEnter={() => onZoneHover?.(zone.id)}
          onMouseLeave={() => onZoneHover?.(null)}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={cn(
                "inline-flex items-center justify-center w-12 h-12 rounded-full mb-2 opacity-30",
                zone.color === "operations" && "bg-operations-500 text-white",
                zone.color === "assets" && "bg-assets-500 text-white",
                zone.color === "foundation" && "bg-foundation-500 text-white",
                zone.color === "flow" && "bg-flow-500 text-white"
              )}>
                <ApperIcon name={zone.icon} className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 opacity-60 mb-1">
                {zone.name}
              </h3>
              <p className="text-sm text-gray-600 opacity-50 max-w-xs mx-auto">
                {zone.description}
              </p>
            </div>
          </div>

          {/* Zone specific decorations */}
          {zone.id === "flow" && (
            <div className="absolute inset-0 overflow-hidden">
              <div className="flow-particles" />
              <div className="flow-particles" />
              <div className="flow-particles" />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default CanvasZones;