import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";

const MiniMap = ({ 
  entities = [], 
  canvasSize = { width: 1200, height: 800 },
  viewportSize = { width: 800, height: 600 },
  pan = { x: 0, y: 0 },
  zoom = 1,
  onNavigate,
  className 
}) => {
  const mapSize = { width: 200, height: 150 };
  const scaleX = mapSize.width / canvasSize.width;
  const scaleY = mapSize.height / canvasSize.height;

  const viewportRect = {
    x: (-pan.x * scaleX) / zoom,
    y: (-pan.y * scaleY) / zoom,
    width: (viewportSize.width * scaleX) / zoom,
    height: (viewportSize.height * scaleY) / zoom,
  };

  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / scaleX) - (viewportSize.width / 2);
    const y = ((e.clientY - rect.top) / scaleY) - (viewportSize.height / 2);
    
    onNavigate?.({ x: -x, y: -y });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn("minimap", className)}
    >
      <Card className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-medium text-gray-700">Mini Map</h3>
          <div className="text-xs text-gray-500">
            {Math.round(zoom * 100)}%
          </div>
        </div>
        
        <div 
          className="relative bg-gray-50 border border-gray-200 rounded cursor-pointer overflow-hidden"
          style={{ width: mapSize.width, height: mapSize.height }}
          onClick={handleMapClick}
        >
          {/* Zone boundaries */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Operations zone */}
            <div 
              className="absolute bg-operations-100 opacity-30"
              style={{
                left: "5%",
                top: "5%",
                width: "40%",
                height: "40%",
              }}
            />
            
            {/* Assets zone */}
            <div 
              className="absolute bg-assets-100 opacity-30"
              style={{
                right: "5%",
                top: "5%",
                width: "40%",
                height: "40%",
              }}
            />
            
            {/* Foundation zone */}
            <div 
              className="absolute bg-foundation-100 opacity-30"
              style={{
                left: "5%",
                right: "5%",
                bottom: "20%",
                height: "35%",
              }}
            />
            
            {/* Flow zone */}
            <div 
              className="absolute bg-flow-100 opacity-30"
              style={{
                left: "5%",
                right: "5%",
                bottom: "5%",
                height: "10%",
              }}
            />
          </div>

          {/* Entities */}
          {entities.map((entity) => (
            <div
              key={entity.id}
              className="absolute w-2 h-2 bg-blue-500 rounded-full opacity-70"
              style={{
                left: entity.position.x * scaleX,
                top: entity.position.y * scaleY,
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}

          {/* Viewport indicator */}
          <div
            className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-10 pointer-events-none"
            style={{
              left: Math.max(0, Math.min(mapSize.width - viewportRect.width, viewportRect.x)),
              top: Math.max(0, Math.min(mapSize.height - viewportRect.height, viewportRect.y)),
              width: Math.min(mapSize.width, viewportRect.width),
              height: Math.min(mapSize.height, viewportRect.height),
            }}
          />
        </div>
      </Card>
    </motion.div>
  );
};

export default MiniMap;