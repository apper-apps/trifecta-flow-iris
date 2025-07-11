import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import EntityCard from "@/components/molecules/EntityCard";
import CanvasZones from "@/components/organisms/CanvasZones";
import MiniMap from "@/components/molecules/MiniMap";
import AITip from "@/components/molecules/AITip";
import { aiTipService } from "@/services/api/aiTipService";

const Canvas = ({ 
  entities = [], 
  onEntityUpdate,
  onEntitySelect,
  selectedEntity = null,
  viewMode = "2d",
  zoom = 1,
  pan = { x: 0, y: 0 },
  onPanChange,
  className 
}) => {
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedEntity, setDraggedEntity] = useState(null);
  const [highlightedZone, setHighlightedZone] = useState(null);
  const [aiTip, setAiTip] = useState(null);
  const [aiTipVisible, setAiTipVisible] = useState(false);
  const [aiTipPosition, setAiTipPosition] = useState({ x: 0, y: 0 });

  const canvasSize = { width: 1200, height: 800 };
  const viewportSize = { width: 800, height: 600 };

  // Handle entity drag
  const handleEntityDragStart = (e, entity) => {
    setIsDragging(true);
    setDraggedEntity(entity);
    e.dataTransfer.setData("text/plain", entity.id);
  };

  const handleEntityDragEnd = (e) => {
    setIsDragging(false);
    setDraggedEntity(null);
    setHighlightedZone(null);
  };

  // Handle zone drop
  const handleZoneDrop = (e, zone) => {
    e.preventDefault();
    const entityId = e.dataTransfer.getData("text/plain");
    const entity = entities.find(e => e.id === entityId);
    
    if (entity && entity.zone !== zone) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;
      
      const updatedEntity = {
        ...entity,
        zone,
        position: { x, y }
      };
      
      onEntityUpdate(updatedEntity);
      
      // Show AI tip for zone placement
      showAITip(zone, { x: e.clientX, y: e.clientY });
    }
  };

  const handleZoneDragOver = (e) => {
    e.preventDefault();
  };

  // AI tip functionality
  const showAITip = async (trigger, position) => {
    try {
      const tips = await aiTipService.getTipsByTrigger(trigger);
      if (tips.length > 0) {
        setAiTip(tips[0]);
        setAiTipPosition(position);
        setAiTipVisible(true);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
          setAiTipVisible(false);
        }, 5000);
      }
    } catch (error) {
      console.error("Error showing AI tip:", error);
    }
  };

  // Handle canvas panning
  const handleCanvasMouseDown = (e) => {
    if (e.target === canvasRef.current) {
      // Start panning
    }
  };

  const getZoneFromPosition = (x, y) => {
    const zones = [
      { id: "operations", bounds: { x: 0.05, y: 0.05, width: 0.4, height: 0.4 } },
      { id: "assets", bounds: { x: 0.55, y: 0.05, width: 0.4, height: 0.4 } },
      { id: "foundation", bounds: { x: 0.05, y: 0.5, width: 0.9, height: 0.3 } },
      { id: "flow", bounds: { x: 0.05, y: 0.85, width: 0.9, height: 0.1 } },
    ];

    const relativeX = x / canvasSize.width;
    const relativeY = y / canvasSize.height;

    for (const zone of zones) {
      if (
        relativeX >= zone.bounds.x &&
        relativeX <= zone.bounds.x + zone.bounds.width &&
        relativeY >= zone.bounds.y &&
        relativeY <= zone.bounds.y + zone.bounds.height
      ) {
        return zone.id;
      }
    }
    return null;
  };

  return (
    <div className={cn("relative flex-1 overflow-hidden bg-white", className)}>
      {/* Canvas */}
      <motion.div
        ref={canvasRef}
        className="canvas-grid relative w-full h-full cursor-grab active:cursor-grabbing"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "0 0",
        }}
        onMouseDown={handleCanvasMouseDown}
        onDrop={(e) => {
          const zone = getZoneFromPosition(
            (e.clientX - canvasRef.current.getBoundingClientRect().left - pan.x) / zoom,
            (e.clientY - canvasRef.current.getBoundingClientRect().top - pan.y) / zoom
          );
          if (zone) {
            handleZoneDrop(e, zone);
          }
        }}
        onDragOver={handleZoneDragOver}
      >
        {/* Zones */}
        <CanvasZones
          canvasSize={canvasSize}
          onZoneHover={setHighlightedZone}
          highlightedZone={highlightedZone}
        />

        {/* Entities */}
        <AnimatePresence>
          {entities.map((entity) => (
            <motion.div
              key={entity.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute"
              style={{
                left: entity.position.x,
                top: entity.position.y,
                zIndex: selectedEntity?.id === entity.id ? 10 : 5,
              }}
            >
              <EntityCard
                entity={entity}
                isDragging={draggedEntity?.id === entity.id}
                onDragStart={(e) => handleEntityDragStart(e, entity)}
                onDragEnd={handleEntityDragEnd}
                onClick={() => onEntitySelect(entity)}
                className={cn(
                  selectedEntity?.id === entity.id && "ring-2 ring-blue-500"
                )}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Connection lines (if needed) */}
        <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          {entities.map((entity) => 
            entity.connections?.map((connectionId) => {
              const connectedEntity = entities.find(e => e.id === connectionId);
              if (!connectedEntity) return null;

              return (
                <line
                  key={`${entity.id}-${connectionId}`}
                  className="connection-line"
                  x1={entity.position.x + 90}
                  y1={entity.position.y + 50}
                  x2={connectedEntity.position.x + 90}
                  y2={connectedEntity.position.y + 50}
                />
              );
            }) || []
          )}
        </svg>
      </motion.div>

      {/* Mini Map */}
      <div className="absolute bottom-4 right-4 z-20">
        <MiniMap
          entities={entities}
          canvasSize={canvasSize}
          viewportSize={viewportSize}
          pan={pan}
          zoom={zoom}
          onNavigate={onPanChange}
        />
      </div>

      {/* AI Tip */}
      <AITip
        tip={aiTip}
        isVisible={aiTipVisible}
        onClose={() => setAiTipVisible(false)}
        position={aiTipPosition}
      />
    </div>
  );
};

export default Canvas;